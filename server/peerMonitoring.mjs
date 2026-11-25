import nodemailer from 'nodemailer'
import { smtpConfiguration } from '../scripts/sendCatalogueUpdateEmail.mjs'
import { createPeerMonitor } from './peerMonitor.mjs'

const ASSISTANT_URL = 'https://avatar.a658yg-catalogue.ch/private/'

function integerSetting(env, name, fallback, minimum) {
  const raw = env[name]
  if (raw === undefined || raw === '') return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value < minimum) throw new Error(`${name} invalide`)
  return value
}

export async function checkAssistantAvailability({ fetchImpl = globalThis.fetch, timeoutMs = 10_000 } = {}) {
  const response = await fetchImpl(ASSISTANT_URL, {
    method: 'GET',
    redirect: 'error',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  const challenge = response.headers.get('www-authenticate') ?? ''
  const transport = response.headers.get('strict-transport-security') ?? ''
  const type = response.headers.get('content-type') ?? ''
  try { await response.body?.cancel() } catch {}
  if (response.status !== 401 || challenge !== 'Basic realm="A658-YG pilote prive", charset="UTF-8"' ||
      !transport.startsWith('max-age=') || !type.startsWith('application/json')) {
    throw new Error('Assistant indisponible')
  }
  return true
}

export function buildPeerMonitoringMessage({ type, peerName, occurredAt, detectedAt }) {
  const restored = type === 'recovery'
  const subject = restored
    ? `[A658-YG] ${peerName} de nouveau disponible`
    : `[A658-YG] ALERTE : ${peerName} indisponible`
  const lines = restored
    ? [
        `${peerName} répond de nouveau au contrôle de disponibilité.`,
        `Rétablissement constaté : ${occurredAt.toISOString()}`,
        `Alerte initiale : ${detectedAt.toISOString()}`,
      ]
    : [
        `${peerName} ne répond plus correctement après trois contrôles consécutifs.`,
        `Alerte constatée : ${occurredAt.toISOString()}`,
        'Action : vérifier le service et solliciter une investigation si nécessaire.',
      ]
  return { subject, text: lines.join('\n') }
}

export function createCataloguePeerMonitoring({
  env = process.env,
  fetchImpl = globalThis.fetch,
  createTransport = nodemailer.createTransport,
  createMonitor = createPeerMonitor,
  onStatus = (value) => console.log(JSON.stringify(value)),
} = {}) {
  if (env.A658_PEER_MONITOR_ENABLED !== 'true') return null
  const smtp = smtpConfiguration(env)
  const intervalMs = integerSetting(env, 'A658_PEER_MONITOR_INTERVAL_MS', 300_000, 60_000)
  const timeoutMs = integerSetting(env, 'A658_PEER_MONITOR_TIMEOUT_MS', 10_000, 1_000)
  const failureThreshold = integerSetting(env, 'A658_PEER_MONITOR_FAILURES', 3, 1)
  const transport = createTransport(smtp.transport)
  return createMonitor({
    peerName: 'Assistant A658-YG',
    intervalMs,
    failureThreshold,
    probe: () => checkAssistantAvailability({ fetchImpl, timeoutMs }),
    async notify(event) {
      const message = buildPeerMonitoringMessage(event)
      const info = await transport.sendMail({ from: smtp.from, to: smtp.to, ...message })
      if (!Array.isArray(info?.accepted) || info.accepted.length === 0 || info.rejected?.length) {
        throw new Error('Alerte non confirmee')
      }
    },
    onStatus,
  })
}
