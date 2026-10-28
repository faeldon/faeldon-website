// Assertions on the built site in dist/, one per requirement of change 086 that a file can show.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const read = (path) => readFileSync(join('dist', path), 'utf8')
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
const files = walk('dist')
const pages = files.filter((path) => path.endsWith('.html'))
const text = files.filter((path) => /\.(html|js|css|json|xml|webmanifest|txt)$/.test(path))

let failed = 0
const check = (req, ok, what) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${req} ${what}`)
  if (!ok) failed += 1
}

// R6: the GraphX post's images and the COVID post's Tableau embed.
const graphx = read('generating-descendant-table-using-spark-graph-x/index.html')
for (const img of ['/img/descendant-1.png', '/img/descendant-2.png']) {
  check('R6', graphx.includes(`src="${img}"`) && existsSync(join('dist', img)), `${img} referenced and present`)
}
check(
  'R6',
  read('tracking-covid-19-cost-of-assistance-in-the-philippines/index.html').includes(
    '<iframe src="https://public.tableau.com/views/PhilippinesCOVID19CostofAssistance/Dashboard',
  ),
  'Tableau iframe present',
)

// R7: the react-live block is a static, highlighted code block, and no React ships anywhere.
const alive = read('this-blog-site-is-alive/index.html')
check(
  'R7',
  /<pre class="astro-code[^"]*"[^>]*data-language="js"[\s\S]*>render</.test(alive),
  'live demo is a js code block',
)
check('R7', !/<script(?! type="application\/ld\+json")/.test(alive), 'live demo page ships no script')
check('R7', !files.some((path) => /react/i.test(path)), 'no React bundle in dist/')

// R8: the contact form Netlify detects at deploy time.
const contact = read('contact/index.html')
const form = contact.match(/<form[^>]*>/)?.[0] ?? ''
for (const attr of [
  'name="contact-form"',
  'method="post"',
  'data-netlify="true"',
  'data-netlify-honeypot="bot-field"',
  'action="/success"',
]) {
  check('R8', form.includes(attr), `form has ${attr}`)
}
check('R8', /<input[^>]*name="bot-field"/.test(contact), 'honeypot input present')
check('R8', /<input type="hidden" name="form-name" value="contact-form"/.test(contact), 'hidden form-name present')

// R9: the kill switch for the old service worker, and no new worker registered.
check('R9', existsSync('dist/sw.js') && read('sw.js').includes('registration.unregister()'), 'sw.js unregisters itself')
check(
  'R9',
  !text.some((path) => readFileSync(path, 'utf8').includes('serviceWorker.register')),
  'nothing registers a worker',
)

// R10: head tags on every page, JSON-LD by page type, and the sitemap.
for (const page of pages) {
  const html = readFileSync(page, 'utf8')
  const tags = ['property="og:title"', 'name="twitter:card"', 'rel="canonical"', 'application/ld+json', '<title>']
  check(
    'R10',
    tags.every((tag) => html.includes(tag)),
    `${page} has title, OG, Twitter, canonical, JSON-LD`,
  )
}
check('R10', read('index.html').includes('"@type":"WebSite"'), 'index has WebSite JSON-LD')
check('R10', alive.includes('"@type":"BlogPosting"'), 'posts have BlogPosting JSON-LD')
check('R10', existsSync('dist/sitemap-index.xml'), 'sitemap-index.xml generated')
check('R10', read('robots.txt').includes('/sitemap-index.xml'), 'robots.txt points at sitemap-index.xml')

// R11: no analytics or consent manager left behind.
const banned = /UA-141571270|googletagmanager|google-analytics|metomic|Manage Cookies/i
const leaks = text.filter((path) => banned.test(readFileSync(path, 'utf8')))
check('R11', leaks.length === 0, `no GA or Metomic${leaks.length ? `: ${leaks.join(', ')}` : ''}`)

// R13: the web manifest, with icons that exist.
const manifest = JSON.parse(read('manifest.webmanifest'))
check('R13', manifest.name === 'James Faeldon' && manifest.start_url === '/', 'manifest name and start_url')
check(
  'R13',
  manifest.icons.length === 2 && manifest.icons.every((icon) => existsSync(join('dist', icon.src))),
  'manifest icons present',
)

console.log(failed ? `${failed} check(s) failed` : 'all checks passed')
process.exit(failed ? 1 : 0)
