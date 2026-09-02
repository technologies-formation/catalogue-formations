import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256, validateCandidateSnapshot } from './promoteOfficialCatalogue.mjs'
import { validateBundle } from '../server/catalogueStore.mjs'

export async function preparePublishedCatalogue(root, commit, publishedAt = new Date().toISOString()) {
  const snapshotText = await readFile(path.join(root, 'src/data/officialCatalogueSnapshot.json'), 'utf8')
  const reportText = await readFile(path.join(root, 'reports/catalogue-import-report.md'), 'utf8')
  const metadata = validateCandidateSnapshot(JSON.parse(snapshotText))
  const manifest = { schemaVersion: 1, commit, publishedAt, ...metadata,
    snapshotHash: sha256(snapshotText), reportHash: sha256(reportText) }
  validateBundle({ manifest, snapshotText, reportText })
  const destination = path.join(root, 'dist/catalogue-sync')
  await mkdir(destination, { recursive: true })
  await writeFile(path.join(destination, `${manifest.snapshotHash}.json`), snapshotText)
  await writeFile(path.join(destination, `${manifest.reportHash}.md`), reportText)
  await writeFile(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  return manifest
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  console.log(JSON.stringify(await preparePublishedCatalogue(root, commit)))
}
