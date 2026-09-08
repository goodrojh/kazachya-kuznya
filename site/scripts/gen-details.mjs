/**
 * Собирает подробности карточек товара из выгрузки WooCommerce (prods.json)
 * и складывает дополнительные фото галереи в public/img.
 *
 *   node scripts/gen-details.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SKUS = [
  'KSKR014', 'KSK0192M', 'KSKR0161', 'KSKR0162', 'KSKR0122', 'KSK0191M',
  'KSK019M', 'KSB003B', 'KSBR005M', 'KNJ0021M', 'KNJ0024M', 'KNJ0027M',
  'KKNR003M', 'KKNR001', 'KPLR001', 'KPL002', 'KSPR002', 'KSPR001',
  'PYP001', 'KYP002', 'PSK016', 'A10', 'TEMP012', 'PSK030',
]

/** Сколько кадров галереи брать дополнительно к обложке. */
const EXTRA_SHOTS = 2

const RAW = 'raw/gallery'
const OUT = 'public/img'
fs.mkdirSync(RAW, { recursive: true })
fs.mkdirSync(OUT, { recursive: true })

const decode = (s) =>
  s
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const toParagraphs = (html) =>
  html
    .split(/<\/p>/i)
    .map((chunk) => decode(chunk.replace(/<[^>]+>/g, '')))
    .filter(Boolean)

// Хвост описаний повторяет то, что уже есть в блоках доставки, производства
// и в постоянной плашке о сертификате — в карточке он не нужен.
const BOILERPLATE =
  /^(Наши филиалы|Осуществляем отправку|Производитель осуществляет отправку|В соответствии с ГОСТ|Доставка|ИЗДЕЛИЕ СЕРТИФИЦИРОВАНО)/i

const products = JSON.parse(fs.readFileSync('prods.json', 'utf8'))
const bySku = new Map(products.map((p) => [p.sku, p]))

const details = []

for (const sku of SKUS) {
  const p = bySku.get(sku)
  if (!p) {
    console.log('НЕТ ДАННЫХ:', sku)
    continue
  }

  const summary = toParagraphs(p.short_description).join(' ')
  const body = toParagraphs(p.description).filter((t) => !BOILERPLATE.test(t) && t.length > 25)

  const specs = p.attributes
    .map((a) => ({
      label: decode(a.name).replace(/:\s*$/, ''),
      value: a.terms.map((t) => decode(t.name)).join(', '),
    }))
    .filter((s) => s.value)

  // Галерея: обложка уже лежит в public/img, докачиваем следующие кадры.
  const gallery = []
  for (let i = 1; i <= EXTRA_SHOTS && i < p.images.length; i++) {
    const src = p.images[i].src
    const name = `g-${sku.toLowerCase()}-${i}`
    const rawFile = path.join(RAW, name + path.extname(new URL(src).pathname))
    if (!fs.existsSync(rawFile)) {
      const r = await fetch(src)
      if (!r.ok) {
        console.log('  пропуск', r.status, src)
        continue
      }
      fs.writeFileSync(rawFile, Buffer.from(await r.arrayBuffer()))
    }
    const dst = `${OUT}/${name}.webp`
    await sharp(rawFile)
      .rotate()
      .resize({ width: 860, withoutEnlargement: true })
      .sharpen({ sigma: 0.7, m1: 0.5, m2: 0.9 })
      .webp({ quality: 82 })
      .toFile(dst)
    gallery.push(name)
  }

  details.push({ sku, summary, body, specs, gallery })
  console.log(sku.padEnd(10), body.length + ' абз.', specs.length + ' хар.', gallery.length + ' фото')
}

const header = `/**
 * Подробности карточек товара — описания и характеристики с kazachya-kuznya.ru.
 * Файл сгенерирован: node scripts/gen-details.mjs
 */

export type ProductDetail = {
  /** Короткое описание для шапки карточки. */
  summary: string
  /** Абзацы подробного описания. */
  body: string[]
  /** Характеристики: сталь, размеры, вес, твёрдость. */
  specs: { label: string; value: string }[]
  /** Дополнительные кадры галереи (имена файлов в public/img). */
  gallery: string[]
}

export const PRODUCT_DETAILS: Record<string, ProductDetail> = `

const map = Object.fromEntries(
  details.map((d) => [d.sku, { summary: d.summary, body: d.body, specs: d.specs, gallery: d.gallery }]),
)

fs.writeFileSync('src/product-details.ts', header + JSON.stringify(map, null, 2) + '\n')

const kb = fs.readdirSync(OUT).filter((f) => f.startsWith('g-')).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0)
console.log('\nВсего товаров:', details.length, '· доп. фото:', (kb / 1024 / 1024).toFixed(2) + ' МБ')
