import test from 'node:test'
import assert from 'node:assert/strict'
import { checkAssistantAvailability, createCataloguePeerMonitoring } from './peerMonitoring.mjs'

function assistantResponse(status = 401, headers = {}) {
  return new Response('', { status, headers: {
    'WWW-Authenticate': 'Basic realm="A658-YG pilote prive", charset="UTF-8"',
    'Strict-Transport-Security': 'max-age=86400',
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  } })
}

test('catalogue : le controle reconnait uniquement la vraie application privee', async () => {
  let request
  assert.equal(await checkAssistantAvailability({ fetchImpl: async (url, init) => {
    request = { url, init }
    return assistantResponse()
  } }), true)
  assert.equal(request.url, 'https://avatar.a658yg-catalogue.ch/private/')
  assert.equal(request.init.credentials, 'omit')
  assert.equal(request.init.headers.Authorization, undefined)
  await assert.rejects(checkAssistantAvailability({
    fetchImpl: async () => new Response('<h1>Maintenance</h1>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
  }), /Assistant indisponible/)
})

test('catalogue : surveillance desactivee sans lecture SMTP', () => {
  const env = { A658_PEER_MONITOR_ENABLED: 'false', get SMTP_PASSWORD() { throw new Error('secret lu') } }
  assert.equal(createCataloguePeerMonitoring({ env }), null)
})

test('catalogue : configuration commune transmise sans connexion au demarrage', () => {
  let settings
  let transportConfiguration
  const env = {
    A658_PEER_MONITOR_ENABLED: 'true', SMTP_HOST: 'smtp.example.test', SMTP_PORT: '465',
    SMTP_USER: 'mailer', SMTP_PASSWORD: 'secret', MAIL_FROM: 'from@example.test', MAIL_TO: 'to@example.test',
  }
  const monitor = { start() {}, stop() {} }
  assert.equal(createCataloguePeerMonitoring({ env,
    createTransport(value) { transportConfiguration = value; return { sendMail() { throw new Error('aucun envoi attendu') } } },
    createMonitor(value) { settings = value; return monitor },
  }), monitor)
  assert.equal(settings.intervalMs, 300_000)
  assert.equal(settings.failureThreshold, 3)
  assert.equal(settings.peerName, 'Assistant A658-YG')
  assert.equal(transportConfiguration.auth.pass, 'secret')
})
