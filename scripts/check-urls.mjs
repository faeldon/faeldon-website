// Fails when the build in dist/ lacks a page for any URL the live site has served.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const expected = readFileSync(new URL('./expected-urls.txt', import.meta.url), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))

const missing = expected.filter((path) => !existsSync(join('dist', path, 'index.html')))

for (const path of missing) console.error(`missing: ${path}`)
console.log(`${expected.length - missing.length}/${expected.length} published URLs present in dist/`)
process.exit(missing.length ? 1 : 0)
