// Vérifie l’interface réelle avec trois fiches fictives et aucun service externe.
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { fullCatalogueCourses } from '../src/data/fullCatalogueCourses.js'

if (!process.env.CATALOGUE_PLAYWRIGHT_MODULE) throw Error('Module Playwright explicite requis')
const { chromium } = await import(pathToFileURL(resolve(process.env.CATALOGUE_PLAYWRIGHT_MODULE)).href)
const first = fullCatalogueCourses.find(course => course.code === 'TRT1019')
assert.ok(first)
const courses = [
  { ...first, officialData: { ...first.officialData, hasOpenSession: true, hasScheduledSession: false } },
  { ...first, code: 'TEST-LONG', officialData: { ...first.officialData, titleRaw: 'Word — structurer des documents longs, des modèles et des rapports pour le suivi de dossiers complexes', targetAudienceRaw: 'Public fictif pour vérifier que les informations restent accessibles. '.repeat(12), hasOpenSession: false, hasScheduledSession: true } },
  { ...first, code: 'TEST-EMPTY', officialData: { ...first.officialData, titleRaw: 'Word — fiche sans indication de sessions', targetAudienceRaw: '', hasOpenSession: false, hasScheduledSession: false } },
]
const vite = await createServer({ mode: 'self-hosted', server: { host: '127.0.0.1', port: 0, hmr: false }, optimizeDeps: { include: ['react', 'react-dom/client', 'react/jsx-dev-runtime'] } })
await vite.listen()
const origin = `http://127.0.0.1:${vite.httpServer.address().port}`
const browser = await chromium.launch({ headless: true, ...(process.env.CATALOGUE_BROWSER_EXECUTABLE ? { executablePath: process.env.CATALOGUE_BROWSER_EXECUTABLE } : {}) })
mkdirSync('visual-check', { recursive: true })
const report = []
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 900, 1000], ['mobile', 390, 844], ['small-mobile', 320, 780]]) {
    const context = await browser.newContext({ viewport: { width, height } })
    const unexpected = [], errors = [], pathwayRequests = []
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (url.origin !== origin) { unexpected.push(url.href); return route.abort() }
      if (url.pathname === '/api/catalogue') return route.fulfill({ json: { courses, catalogue: { snapshotDate: '2026-10-27' } } })
      if (url.pathname === '/api/pathway' && route.request().method() === 'POST') {
        pathwayRequests.push(route.request().postDataJSON())
        return route.fulfill({ json: { summary:'Parcours fictif de vérification',recommendedSteps:[],optionalSteps:[],informationalCourses:[],durationSummary:{budgetHours:null} } })
      }
      if (url.pathname.startsWith('/api/')) { unexpected.push(url.pathname); return route.abort() }
      return route.continue()
    })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(origin)
    try {
      await page.waitForFunction(() => document.querySelector('.catalogue-summary')?.textContent.includes('3 formations'))
    } catch (error) {
      await page.screenshot({ path: `visual-check/catalogue-${name}-failure.png`, fullPage: true })
      console.error(JSON.stringify({ name, errors, unexpected, content: (await page.locator('body').innerText()).slice(0, 2000) }))
      throw error
    }
    await page.locator('#catalogue-search').fill('word')
    await page.getByRole('heading', { name: '3 formations trouvées' }).waitFor()
    assert.equal(await page.locator('.official-course-card').count(), 3)
    assert.equal(await page.locator('.search-hero .help-button').count(), 0)
    assert.equal(await page.locator('.search-hero').getByText('Échanger avec l’assistant', { exact: false }).count(), 1)
    const help = page.getByRole('button', { name: 'Aide à la recherche', exact: true })
    const select = page.getByRole('combobox', { name: 'Trier par', exact: true })
    const helpBox = await help.boundingBox(), sortBox = await select.boundingBox()
    const titleBox = await page.getByRole('heading', { name: '3 formations trouvées' }).boundingBox()
    const controlsBox = await page.locator('.results-controls').boundingBox()
    assert.ok(controlsBox.y >= titleBox.y + titleBox.height - 1, 'commandes sous le nombre de résultats')
    assert.ok(Math.abs(controlsBox.x - titleBox.x) < 1, 'commandes alignées à gauche du titre')
    if (width <= 620) assert.ok(Math.abs(helpBox.x - titleBox.x) < 1, 'aide alignée à gauche sur mobile')
    assert.equal(await page.locator('.pathway-choice').evaluate(e => getComputedStyle(e).borderLeftWidth), width > 760 ? '0px' : '1px')
    if (width > 620) assert.ok(helpBox.x >= sortBox.x + sortBox.width - 1, 'aide à droite du tri')
    else assert.ok(helpBox.y >= sortBox.y + sortBox.height - 1, 'aide sous le tri sur mobile')
    await help.click()
    await page.locator('#getting-started-panel').waitFor()
    assert.equal(await page.locator('.official-results-heading #getting-started-panel').count(), 1)
    await page.getByRole('button', { name: 'Fermer l’aide' }).click()
    const cards = page.locator('.official-course-card')
    const titleXs = []
    for (const card of await cards.all()) {
      const code = card.locator('.official-course-code strong'), title = card.getByRole('heading', { level: 3 })
      assert.equal(await code.evaluate(e => getComputedStyle(e).fontFamily), await title.evaluate(e => getComputedStyle(e).fontFamily))
      const titleBox = await title.boundingBox(); titleXs.push(titleBox.x)
      assert.ok(await title.evaluate(e => e.scrollWidth <= e.clientWidth + 1))
      const action = await card.getByRole('link', { name: 'Voir la formation' }).boundingBox()
      const audience = await card.locator('.official-course-target-audience').boundingBox()
      if (width > 760) assert.ok(action.x >= audience.x + audience.width - 1, 'action à côté du public')
      else assert.ok(action.y >= audience.y + audience.height - 1, 'action sous le public sur mobile')
    }
    assert.ok(titleXs.every(x => Math.abs(x - titleXs[0]) < 1), 'titres alignés')
    const longCard = cards.filter({ hasText: 'TEST-LONG' })
    await longCard.getByText('Lire le public visé complet').click()
    assert.equal(await longCard.locator('details').getAttribute('open'), '')
    assert.equal(await cards.filter({ hasText: 'TEST-EMPTY' }).locator('.course-session-status').count(), 0)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `visual-check/catalogue-${name}-header.png`, animations: 'disabled' })
    await page.locator('.official-results-heading').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `visual-check/catalogue-${name}-results.png`, animations: 'disabled' })
    const launcher = page.getByRole('button', { name: 'Préparer un parcours avec le formulaire', exact: true })
    await launcher.click()
    const dialog = page.getByRole('dialog', { name: 'Construire mon parcours de formation', exact: true })
    await dialog.waitFor()
    assert.equal(pathwayRequests.length,0,'ouvrir le formulaire ne lance pas le moteur')
    assert.equal(await page.locator('#pathway-objective').inputValue(),'')
    await dialog.getByRole('button',{name:'Construire mon parcours',exact:true}).click()
    assert.equal(pathwayRequests.length,0,'les champs obligatoires doivent être complétés')
    await page.locator('#pathway-personnelCategory').selectOption('PAT')
    await page.locator('#pathway-role').fill('Assistant administratif')
    await page.locator('#pathway-objective').fill('Mieux structurer mes documents Word')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false)
    await page.screenshot({path:`visual-check/catalogue-${name}-pathway-form.png`,animations:'disabled'})
    await dialog.getByRole('button',{name:'Construire mon parcours',exact:true}).click()
    await dialog.getByText('Parcours fictif de vérification',{exact:true}).waitFor()
    assert.equal(pathwayRequests.length,1)
    assert.equal(pathwayRequests[0].objective,'Mieux structurer mes documents Word')
    await page.keyboard.press('Escape')
    await dialog.waitFor({state:'hidden'})
    await launcher.waitFor({state:'visible'})
    await page.waitForFunction(() => document.activeElement?.textContent === 'Préparer un parcours avec le formulaire')
    assert.equal(await page.locator('#catalogue-search').inputValue(),'word','la recherche classique reste conservée')
    assert.equal(pathwayRequests.length,1)
    assert.deepEqual(errors, []); assert.deepEqual(unexpected, [])
    report.push({ name, width, noOverflow: true, accessibleDetails: true, noPaidCalls: true })
    await context.close()
  }
} finally { await browser.close(); await vite.close() }
writeFileSync('visual-check/catalogue-layout.json', JSON.stringify(report, null, 2))
console.log(JSON.stringify(report))
