import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { pathwayProfileFields } from '../config/pathwayProfile.js'

test('le vrai formulaire rend les options et contraintes partagees sans fermer les entites', async t => {
  const vite = await createServer({
    root: fileURLToPath(new URL('../../', import.meta.url)),
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  t.after(() => vite.close())
  const { default: PathwayAssistant } = await vite.ssrLoadModule('/src/components/PathwayAssistant.jsx')
  const html = renderToStaticMarkup(createElement(PathwayAssistant, { onClose() {} }))
  for (const option of [...pathwayProfileFields.personnelCategory.options, ...pathwayProfileFields.managerStatus.options]) {
    assert.ok(html.includes(`<option value="${option.value}">${option.label}</option>`), option.value)
  }
  assert.equal((html.match(/<option /g) ?? []).length, 10)
  assert.match(html, /<option value="" disabled="" selected="">À renseigner<\/option>/)
  assert.match(html, /<option value="" selected="">Non précisée<\/option>/)
  assert.match(html, /<input[^>]*maxLength="120"[^>]*placeholder="Par exemple : OPE, DIP, Police…"/)
  assert.match(html, /id="pathway-role"[^>]*required=""[^>]*maxLength="300"/)
  assert.match(html, /id="pathway-objective"[^>]*required=""[^>]*maxLength="1000"/)
})
