import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { Writable } from 'node:stream'
import { createStaticFrontendHandler } from './staticFrontend.mjs'

class TestResponse extends Writable {
  constructor() {
    super()
    this.body = ''
    this.headers = {}
    this.status = null
  }

  _write(chunk, encoding, callback) {
    this.body += chunk.toString()
    callback()
  }

  writeHead(status, headers) {
    this.status = status
    this.headers = headers
  }
}

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'catalogue-static-'))
  await mkdir(path.join(root, 'assets'))
  await writeFile(path.join(root, 'index.html'), '<main>catalogue</main>')
  await writeFile(path.join(root, 'assets', 'app.js'), 'console.log("ok")')
  return root
}

test('sert le frontend, ses assets et le fallback SPA', async (context) => {
  const root = await fixture()
  context.after(() => rm(root, { recursive: true, force: true }))
  const serve = createStaticFrontendHandler({ root })

  for (const [pathname, expected] of [
    ['/', '<main>catalogue</main>'],
    ['/assets/app.js', 'console.log("ok")'],
    ['/une-route', '<main>catalogue</main>'],
  ]) {
    const response = new TestResponse()
    assert.equal(await serve({ method: 'GET' }, response, { pathname }), true)
    await new Promise((resolve) => response.on('finish', resolve))
    assert.equal(response.status, 200)
    assert.equal(response.body, expected)
  }
})

test('ne sert ni les routes API ni les méthodes d écriture', async (context) => {
  const root = await fixture()
  context.after(() => rm(root, { recursive: true, force: true }))
  const serve = createStaticFrontendHandler({ root })

  assert.equal(await serve({ method: 'GET' }, new TestResponse(), { pathname: '/api/health' }), false)
  assert.equal(await serve({ method: 'GET' }, new TestResponse(), { pathname: '/assets/absent.js' }), false)
  assert.equal(await serve({ method: 'POST' }, new TestResponse(), { pathname: '/' }), false)
})
