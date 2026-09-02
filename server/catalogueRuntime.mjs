import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createCatalogueStore } from './catalogueStore.mjs'
import { prepareSearchCatalogue } from './catalogueState.mjs'
import { positiveIntegerEnv } from './config.mjs'

export const catalogueSyncEnabled = process.env.CATALOGUE_SYNC_ENABLED === 'true'
const intervalMs = positiveIntegerEnv('CATALOGUE_SYNC_INTERVAL_MS', 3600000, 60000)
export const catalogueStore = createCatalogueStore({
  bundledSnapshotText: readFileSync(new URL('../src/data/officialCatalogueSnapshot.json', import.meta.url), 'utf8'),
  prepare: prepareSearchCatalogue,
  cacheFile: process.env.CATALOGUE_CACHE_FILE || fileURLToPath(new URL('../var/catalogue-cache.json', import.meta.url)),
})

export async function initializeCatalogue() {
  if (catalogueSyncEnabled) await catalogueStore.initialize()
}

export function startCatalogueSync() {
  if (!catalogueSyncEnabled) return () => {}
  async function refresh() {
    const ok = await catalogueStore.refresh()
    console.log(JSON.stringify({ event: 'catalogue-sync', ok, ...catalogueStore.status() }))
  }
  void refresh()
  const timer = setInterval(() => { void refresh() }, intervalMs)
  timer.unref()
  return () => clearInterval(timer)
}
