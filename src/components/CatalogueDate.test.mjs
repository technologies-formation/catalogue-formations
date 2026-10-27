import assert from 'node:assert/strict'
import test from 'node:test'
import {fileURLToPath} from 'node:url'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'
test('catalogue : la page affiche la date injectée avec les données, pas celle du navigateur',async t=>{
 const vite=await createServer({root:fileURLToPath(new URL('../../',import.meta.url)),server:{middlewareMode:true,hmr:false,watch:null},optimizeDeps:{noDiscovery:true,include:[]}})
 t.after(()=>vite.close());const previous=globalThis.window;globalThis.window={location:{search:''}}
 t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous})
 const {default:App}=await vite.ssrLoadModule('/src/App.jsx')
 assert.match(renderToStaticMarkup(createElement(App,{catalogueDate:'2026-10-27'})),/Catalogue actualisé le 27.10.2026/)
 assert.match(renderToStaticMarkup(createElement(App,{catalogueDate:null})),/Date du catalogue non renseignée/)
})
