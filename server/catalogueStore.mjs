import { readFile, mkdir, open, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { sha256, validateCandidateSnapshot, validateCandidateReport } from '../scripts/promoteOfficialCatalogue.mjs'

export const PUBLIC_CATALOGUE_URL = 'https://technologies-formation.github.io/catalogue-formations/catalogue-sync/'
const MAX_SNAPSHOT_BYTES = 10 * 1024 * 1024

export function validateBundle({ manifest, snapshotText, reportText }) {
  if (manifest?.schemaVersion !== 1 || !/^[a-f0-9]{40}$/.test(manifest.commit ?? '') ||
      !/^[a-f0-9]{64}$/.test(manifest.snapshotHash ?? '') ||
      !/^[a-f0-9]{64}$/.test(manifest.reportHash ?? '') ||
      typeof manifest.publishedAt !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(manifest.publishedAt) ||
      !Number.isFinite(Date.parse(manifest.publishedAt))) {
    throw new Error('invalid-manifest')
  }
  if (typeof snapshotText !== 'string' || Buffer.byteLength(snapshotText) > MAX_SNAPSHOT_BYTES ||
      typeof reportText !== 'string' || Buffer.byteLength(reportText) > 1024 * 1024) {
    throw new Error('invalid-bundle-size')
  }
  const snapshot = JSON.parse(snapshotText)
  const metadata = validateCandidateSnapshot(snapshot)
  const snapshotHash = sha256(snapshotText)
  validateCandidateReport(reportText, { ...metadata, snapshotHash })
  if (manifest.snapshotHash !== snapshotHash || manifest.reportHash !== sha256(reportText) ||
      manifest.snapshotDate !== metadata.snapshotDate || manifest.courseCount !== metadata.courseCount) {
    throw new Error('manifest-mismatch')
  }
  return { snapshot, metadata: { ...metadata, snapshotHash, commit: manifest.commit, publishedAt: manifest.publishedAt } }
}

// One atomic envelope: a crash cannot leave a snapshot paired with another report.
export async function persistBundle(cacheFile, bundle) {
  await mkdir(path.dirname(cacheFile), { recursive: true, mode: 0o700 })
  const temporary = `${cacheFile}.${randomUUID()}.tmp`
  try {
    const file = await open(temporary, 'wx', 0o600)
    try {
      await file.writeFile(JSON.stringify(bundle), 'utf8')
      await file.sync()
    } finally {
      await file.close()
    }
    validateBundle(JSON.parse(await readFile(temporary, 'utf8')))
    await rename(temporary, cacheFile)
  } finally {
    await rm(temporary, { force: true })
  }
}

async function downloadText(fetchImpl, url, limit, signal) {
  const response = await fetchImpl(url, { signal, cache: 'no-store', redirect: 'error' })
  if (!response.ok) throw new Error('download-failed')
  if (Number(response.headers.get('content-length')) > limit) throw new Error('response-too-large')
  const reader = response.body.getReader()
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) throw new Error('response-too-large')
      chunks.push(value)
    }
  } finally {
    await reader.cancel()
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function createCatalogueStore({ bundledSnapshotText, prepare, cacheFile,
  fetchImpl = fetch, persist = persistBundle, timeoutMs = 15000, now = () => new Date() }) {
  const snapshot = JSON.parse(bundledSnapshotText)
  const metadata = validateCandidateSnapshot(snapshot)
  let active = { search: prepare(snapshot), metadata: { ...metadata, snapshotHash: sha256(bundledSnapshotText), commit: null, publishedAt: null }, source: 'bundled' }
  let pending = null
  let lastCheckAt = null
  let lastSuccessAt = null
  let lastError = null

  function prepareBundle(bundle, source) {
    const checked = validateBundle(bundle)
    if (checked.metadata.snapshotDate < active.metadata.snapshotDate ||
        (active.metadata.publishedAt && checked.metadata.publishedAt < active.metadata.publishedAt)) {
      throw new Error('older-catalogue')
    }
    return { search: prepare(checked.snapshot), metadata: checked.metadata, source }
  }

  async function initialize() {
    try {
      const bytes = await readFile(cacheFile)
      if (bytes.length > 25 * 1024 * 1024) throw new Error('cache-too-large')
      active = prepareBundle(JSON.parse(bytes.toString('utf8')), 'cache')
    } catch (error) {
      if (error.code !== 'ENOENT') lastError = 'cache-rejected'
    }
  }

  async function check() {
    lastCheckAt = now().toISOString()
    const signal = AbortSignal.timeout(timeoutMs)
    try {
      const manifestText = await downloadText(fetchImpl, `${PUBLIC_CATALOGUE_URL}manifest.json`, 8192, signal)
      const manifest = JSON.parse(manifestText)
      // Validate hashes before constructing paths; no remotely supplied arbitrary URL.
      if (manifest?.schemaVersion !== 1 || !/^[a-f0-9]{64}$/.test(manifest.snapshotHash ?? '') ||
          !/^[a-f0-9]{64}$/.test(manifest.reportHash ?? '')) throw new Error('invalid-manifest')
      const snapshotText = await downloadText(fetchImpl, `${PUBLIC_CATALOGUE_URL}${manifest.snapshotHash}.json`, MAX_SNAPSHOT_BYTES, signal)
      const reportText = await downloadText(fetchImpl, `${PUBLIC_CATALOGUE_URL}${manifest.reportHash}.md`, 1024 * 1024, signal)
      const bundle = { manifest, snapshotText, reportText }
      const next = prepareBundle(bundle, 'published')
      if (next.metadata.snapshotHash !== active.metadata.snapshotHash ||
          next.metadata.commit !== active.metadata.commit || active.source === 'bundled') {
        await persist(cacheFile, bundle)
        active = next
      }
      lastSuccessAt = now().toISOString()
      lastError = null
      return true
    } catch {
      lastError = 'refresh-failed'
      return false
    }
  }

  return {
    current: () => active,
    initialize,
    refresh() {
      if (!pending) pending = check().finally(() => { pending = null })
      return pending
    },
    status: () => ({ ...active.metadata, source: active.source, lastCheckAt, lastSuccessAt, lastError }),
  }
}
