/**
 * Выгружает весь каталог WooCommerce действующего сайта в prods.json.
 *
 *   node scripts/fetch-catalog.mjs
 */
import fs from 'node:fs'

const BASE = 'https://kazachya-kuznya.ru/wp-json/wc/store/v1/products'
const all = []

for (let page = 1; page <= 20; page++) {
  const res = await fetch(`${BASE}?per_page=100&page=${page}&orderby=popularity`)
  if (!res.ok) throw new Error(`Страница ${page}: HTTP ${res.status}`)
  const batch = await res.json()
  all.push(...batch)
  const total = Number(res.headers.get('x-wp-totalpages') || 1)
  console.log(`страница ${page}/${total}: +${batch.length}`)
  if (page >= total) break
}

fs.writeFileSync('prods.json', JSON.stringify(all))
console.log('всего товаров:', all.length)

const byCat = {}
for (const p of all) for (const c of p.categories || []) byCat[c.name] = (byCat[c.name] || 0) + 1
console.log(byCat)
