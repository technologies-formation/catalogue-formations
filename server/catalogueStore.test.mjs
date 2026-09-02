import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createCatalogueStore, validateBundle, PUBLIC_CATALOGUE_URL } from './catalogueStore.mjs'
import { sha256 } from '../scripts/promoteOfficialCatalogue.mjs'
import { preparePublishedCatalogue } from '../scripts/preparePublishedCatalogue.mjs'
import { prepareSearchCatalogue } from './catalogueState.mjs'
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'

function fixture(code = 'NEW', date = '2026-09-02') {
  const snapshotText = JSON.stringify([{ code, titleRaw: `Course ${code}`, sourceUrl: 'https://example.com/course',
    catalogueOffers: ['Offer'], fetchStatus: 'ok', sourceSnapshotDate: date }])
  const snapshotHash = sha256(snapshotText)
  const reportText = `- Date du snapshot : ${date}\n- Empreinte SHA-256 du snapshot : \`${snapshotHash}\`\n| Cours dans le candidat | 1 |\n| Anomalies techniques | 0 |\n`
  return { snapshotText, reportText, manifest: { schemaVersion: 1, snapshotHash, reportHash: sha256(reportText),
    snapshotDate: date, courseCount: 1, commit: 'a'.repeat(40), publishedAt: `${date}T05:00:00.000Z` } }
}

async function setup(t, options = {}) {
  const dir = await mkdtemp(path.join(tmpdir(), 'a658-sync-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const next = fixture()
  const requests = []
  const fetchImpl = async (url) => {
    requests.push(url)
    assert.ok(url.startsWith(PUBLIC_CATALOGUE_URL), 'only static Pages, never OpenAI')
    const content = url.endsWith('manifest.json') ? JSON.stringify(next.manifest)
      : url.endsWith('.md') ? next.reportText : next.snapshotText
    return new Response(content)
  }
  const args = { bundledSnapshotText: fixture('OLD', '2026-09-01').snapshotText,
    prepare: prepareSearchCatalogue, cacheFile: path.join(dir, 'cache.json'), fetchImpl, ...options }
  return { dir, next, requests, args, store: createCatalogueStore(args) }
}

test('published version replaces all indexes and survives offline restart', async t => {
  const { store, args, requests } = await setup(t)
  await store.initialize()
  const previous = store.current()
  assert.equal(await store.refresh(), true)
  const active = store.current()
  assert.deepEqual(active.search.officialCodes, ['NEW'])
  assert.deepEqual([...active.search.detailedByCode.keys()], ['NEW'])
  assert.deepEqual([...active.search.courseByCode.keys()], ['NEW'])
  assert.equal(active.search.courses[0].code, 'NEW')
  assert.deepEqual(previous.search.officialCodes, ['OLD'])
  assert.equal(requests.length, 3)
  const restarted = createCatalogueStore({ ...args, fetchImpl: async () => { throw new Error('offline') } })
  await restarted.initialize()
  assert.equal(restarted.status().source, 'cache')
  assert.equal(await restarted.refresh(), false)
  assert.deepEqual(restarted.current().search.officialCodes, ['NEW'])
  assert.equal(restarted.status().lastError, 'refresh-failed')
})

test('corrupt download preserves both memory and persisted version', async t => {
  const { store, next, args } = await setup(t)
  await store.refresh()
  const before = await readFile(args.cacheFile, 'utf8')
  const active = store.current()
  next.snapshotText = next.snapshotText.replace('Course NEW', 'Tampered')
  assert.equal(await store.refresh(), false)
  assert.equal(store.current(), active)
  assert.equal(await readFile(args.cacheFile, 'utf8'), before)
})

test('failed disk write never promotes the new catalogue', async t => {
  const { store } = await setup(t, { persist: async () => { throw new Error('disk full') } })
  const before = store.current()
  assert.equal(await store.refresh(), false)
  assert.equal(store.current(), before)
})

test('corrupt cache falls back to bundled catalogue and can recover', async t => {
  const { store, args } = await setup(t)
  await writeFile(args.cacheFile, '{broken')
  await store.initialize()
  assert.equal(store.status().source, 'bundled')
  assert.equal(store.status().lastError, 'cache-rejected')
  assert.equal(await store.refresh(), true)
  assert.equal(store.status().lastError, null)
})

test('stale publication cannot roll back a newer catalogue', async t => {
  const { store, next } = await setup(t)
  await store.refresh()
  const before = store.current()
  Object.assign(next, fixture('OLDER', '2026-08-31'))
  assert.equal(await store.refresh(), false)
  assert.equal(store.current(), before)
})

test('concurrent refreshes share one download sequence', async t => {
  const { store, requests } = await setup(t)
  await Promise.all([store.refresh(), store.refresh(), store.refresh()])
  assert.equal(requests.length, 3)
})

test('invalid manifest paths and oversized responses are rejected', async t => {
  const { store, next, requests } = await setup(t)
  next.manifest.snapshotHash = '../../elsewhere'
  assert.equal(await store.refresh(), false)
  assert.equal(requests.length, 1)
  const large = await setup(t, { fetchImpl: async () => new Response('x'.repeat(8193)) })
  assert.equal(await large.store.refresh(), false)
})

test('network timeout preserves the current state', async t => {
  const { store } = await setup(t, { timeoutMs: 10, fetchImpl: async (_url, { signal }) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(new Response('{}')), 100)
      signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason) }, { once: true })
    }) })
  const before = store.current()
  assert.equal(await store.refresh(), false)
  assert.equal(store.current(), before)
})

test('publisher packages matching content and rejects inconsistent reports', async t => {
  const { dir, next } = await setup(t)
  await mkdir(path.join(dir, 'src/data'), { recursive: true })
  await mkdir(path.join(dir, 'reports'))
  await writeFile(path.join(dir, 'src/data/officialCatalogueSnapshot.json'), next.snapshotText)
  await writeFile(path.join(dir, 'reports/catalogue-import-report.md'), next.reportText)
  const manifest = await preparePublishedCatalogue(dir, 'b'.repeat(40))
  const published = JSON.parse(await readFile(path.join(dir, 'dist/catalogue-sync/manifest.json')))
  assert.deepEqual(published, manifest)
  validateBundle({ manifest, snapshotText: await readFile(path.join(dir, `dist/catalogue-sync/${manifest.snapshotHash}.json`), 'utf8'),
    reportText: await readFile(path.join(dir, `dist/catalogue-sync/${manifest.reportHash}.md`), 'utf8') })
  await writeFile(path.join(dir, 'reports/catalogue-import-report.md'), next.reportText.replace('| 1 |', '| 2 |'))
  await assert.rejects(preparePublishedCatalogue(dir, 'b'.repeat(40)))
})

test('dynamic projection preserves the existing full catalogue projection', async () => {
  const snapshot = JSON.parse(await readFile(new URL('../src/data/officialCatalogueSnapshot.json', import.meta.url), 'utf8'))
  assert.deepEqual(prepareSearchCatalogue(snapshot).courses, fullCatalogueCourses)
})

test('a running two-pass search keeps its captured catalogue when refresh completes', async t => {
  const { catalogueStore } = await import('./catalogueRuntime.mjs')
  const { searchWithLuna } = await import('./llmSearch.mjs')
  const oldSearch = prepareSearchCatalogue(JSON.parse(fixture('OLD').snapshotText))
  const newSearch = prepareSearchCatalogue(JSON.parse(fixture('NEW').snapshotText))
  let current = oldSearch
  const originalCurrent = catalogueStore.current
  const originalFetch = globalThis.fetch
  const originalKey = process.env.OPENAI_API_KEY
  t.after(() => {
    catalogueStore.current = originalCurrent
    globalThis.fetch = originalFetch
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY
    else process.env.OPENAI_API_KEY = originalKey
  })
  catalogueStore.current = () => ({ search: current })
  process.env.OPENAI_API_KEY = 'local-test-no-network'
  const calls = []
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body)
    calls.push(body)
    current = newSearch
    const result = calls.length === 1 ? { codes: ['OLD'] }
      : { abstain: false, recommendedCodes: ['OLD'], complementaryCodes: [], relatedCodes: [], reason: 'test' }
    return new Response(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: JSON.stringify(result) }] }], usage: {} }))
  }
  const result = await searchWithLuna('Course OLD')
  assert.equal(calls.length, 2)
  assert.match(calls[1].input, /Course OLD/)
  assert.doesNotMatch(calls[1].input, /Course NEW/)
  assert.equal(result.recommendedResults[0].code, 'OLD')
})
