// Capture the version before the asynchronous generation, from the same catalogue.
export async function buildCataloguePathway(profile, active, build) {
  const version = {
    snapshotDate: active.metadata.snapshotDate,
    snapshotHash: active.metadata.snapshotHash,
  }
  const result = await build(profile, { catalogue: active.search })
  return { ...result, catalogue: version }
}
