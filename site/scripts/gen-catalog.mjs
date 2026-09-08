/**
 * Собирает весь каталог из выгрузки WooCommerce (prods.json):
 * товары, описания, характеристики и изображения.
 *
 *   node scripts/fetch-catalog.mjs   # сначала выгрузка
 *   node scripts/gen-catalog.mjs     # затем сборка
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const RAW = 'raw/catalog'
const OUT = 'public/img'
fs.mkdirSync(RAW, { recursive: true })
fs.mkdirSync(OUT, { recursive: true })

/** Сколько кадров галереи брать дополнительно к обложке. */
const EXTRA_SHOTS = 2
const COVER = { width: 780, quality: 80 }
const SHOT = { width: 760, quality: 76 }

/** Витринные позиции на главной — порядок и подписи заданы вручную. */
const FEATURED = [
  ['KSKR014', 'Хит'], ['KSK0192M'], ['KSKR0161'], ['KSKR0162'], ['KSKR0122'],
  ['KSK0191M'], ['KSK019M'], ['KSB003B', 'Парадный'], ['KSBR005M'],
  ['KNJ0021M'], ['KNJ0024M'], ['KNJ0027M'], ['KKNR003M'], ['KKNR001'],
  ['KPLR001'], ['KPL002', 'Коллекция'], ['KSPR002'], ['KSPR001'],
  ['PYP001'], ['KYP002'], ['PSK016'], ['A10'], ['TEMP012'], ['PSK030'],
]

/** Названия, которые мы переписали вручную — они читаются лучше исходных. */
const NAME_OVERRIDES = {
  KSKR014: 'Реплика шашка «300 лет Дому Романовых»',
  KSK0192M: 'Шашка кавказская погружная «За Кубань и Отечество», мельхиор',
  KSKR0161: 'Реплика шашка обр. 1838 года «Чаю воскресенья мертвых»',
  KSKR0162: 'Реплика шашка генерала Бакланова «Честь дороже чем жизнь»',
  KSKR0122: 'Реплика шашка «С нами Бог»',
  KSK0191M: 'Шашка кавказская ККВ, силовая рубка',
  KSK019M: 'Шашка кавказская, мельхиор',
  KSB003B: 'Клыч Николаевский парадный',
  KSBR005M: 'Реплика сабля «Боевой талисман», мельхиор',
  KNJ0021M: 'Пластунский нож «Бга бойся, Цря чти»',
  KNJ0024M: 'Пластунский нож «Цену жизни спроси у мертвых»',
  KNJ0027M: 'Пластунский нож «Отечество или смерть»',
  KKNR003M: 'Реплика кинжал ККВ, мельхиор',
  KKNR001: 'Реплика кинжал бебут обр. 1905 г.',
  KPLR001: 'Палаш морской обр. 1855 г.',
  KPL002: 'Палаш кавалергарда',
  KSPR002: 'Шпага гвардейская елизаветинская обр. 1740 г.',
  KSPR001: 'Шпага пехотная офицерская обр. 1798 г.',
  PYP001: 'Японский меч катана «Синоби-Кэн»',
  KYP002: 'Японский меч вакидзаси «Золотой дракон»',
  PSK016: 'Нагайка кубанская, красная',
  A10: 'Футляр подарочный для шашки / сабли, чёрный бархат',
  TEMP012: 'Подставка дубовая для шашки / сабли / катаны',
  PSK030: 'Футляр подарочный для ножа / кортика',
}

const decode = (s) =>
  s
    .replace(/&#8212;/g, '—').replace(/&#8211;/g, '–')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&laquo;|&#171;/g, '«').replace(/&raquo;|&#187;/g, '»')
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8216;|&#8218;/g, '’')
    .replace(/&hellip;|&#8230;/g, '…').replace(/&#039;|&#39;/g, '’')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&#8470;/g, '№').replace(/&#8217;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

/** Прямые кавычки в названиях приводим к «ёлочкам». */
const tidyName = (s) => decode(s).replace(/"([^"]+)"/g, '«$1»').replace(/\s+,/g, ',')

const toParagraphs = (html) =>
  html.split(/<\/p>/i).map((c) => decode(c.replace(/<[^>]+>/g, ''))).filter(Boolean)

// Хвосты описаний дублируют блоки доставки, производства и плашку о сертификате.
const BOILERPLATE =
  /^(Наши филиалы|Осуществляем отправку|Производитель осуществляет отправку|В соответствии с ГОСТ|Доставка|ИЗДЕЛИЕ СЕРТИФИЦИРОВАНО)/i

const slug = (sku) => sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const products = JSON.parse(fs.readFileSync('prods.json', 'utf8'))
const featuredTag = new Map(FEATURED.map(([sku, tag]) => [sku, tag]))

const catalog = []
const details = {}
let downloaded = 0

for (const p of products) {
  if (!p.sku) continue
  const id = slug(p.sku)

  // Обложка + дополнительные кадры.
  const images = []
  for (let i = 0; i <= EXTRA_SHOTS && i < p.images.length; i++) {
    const src = p.images[i].src
    const name = i === 0 ? `p-${id}` : `g-${id}-${i}`
    const ext = path.extname(new URL(src).pathname) || '.jpg'
    const rawFile = path.join(RAW, name + ext)
    if (!fs.existsSync(rawFile)) {
      const r = await fetch(src)
      if (!r.ok) {
        console.log('  пропуск', r.status, src)
        continue
      }
      fs.writeFileSync(rawFile, Buffer.from(await r.arrayBuffer()))
      downloaded++
    }
    const preset = i === 0 ? COVER : SHOT
    await sharp(rawFile)
      .rotate()
      .resize({ width: preset.width, withoutEnlargement: true })
      .sharpen({ sigma: 0.7, m1: 0.5, m2: 0.9 })
      .webp({ quality: preset.quality })
      .toFile(`${OUT}/${name}.webp`)
    images.push(name)
  }
  if (!images.length) {
    console.log('НЕТ ФОТО:', p.sku)
    continue
  }

  const price = Number(p.prices.price)
  const oldPrice = Number(p.prices.regular_price)

  catalog.push({
    sku: p.sku,
    name: NAME_OVERRIDES[p.sku] || tidyName(p.name),
    category: decode((p.categories?.[0]?.name) || 'Прочее'),
    price,
    oldPrice: oldPrice > price ? oldPrice : price,
    image: images[0],
    ...(featuredTag.get(p.sku) ? { tag: featuredTag.get(p.sku) } : {}),
  })

  details[p.sku] = {
    summary: toParagraphs(p.short_description).join(' '),
    body: toParagraphs(p.description).filter((t) => !BOILERPLATE.test(t) && t.length > 25),
    specs: p.attributes
      .map((a) => ({ label: decode(a.name).replace(/:\s*$/, ''), value: a.terms.map((t) => decode(t.name)).join(', ') }))
      .filter((s) => s.value),
    gallery: images.slice(1),
  }
}

// Порядок: сначала витрина в заданной последовательности, дальше всё остальное.
const order = new Map(FEATURED.map(([sku], i) => [sku, i]))
catalog.sort((a, b) => (order.get(a.sku) ?? 999) - (order.get(b.sku) ?? 999))

const header = `/**
 * Каталог с kazachya-kuznya.ru: товары, описания и характеристики.
 * Файл сгенерирован: node scripts/gen-catalog.mjs
 */

export type Product = {
  sku: string
  name: string
  category: string
  price: number
  oldPrice: number
  image: string
  tag?: string
}

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

/** Артикулы витрины на главной — в порядке показа. */
export const FEATURED_SKUS: string[] = ${JSON.stringify(FEATURED.map(([sku]) => sku))}

export const ALL_PRODUCTS: Product[] = ${JSON.stringify(catalog, null, 2)}
`

fs.writeFileSync('src/catalog.ts', header)

// Описания и характеристики нужны только при открытии карточки — держим их
// отдельным модулем, чтобы стартовый бандл оставался лёгким.
fs.writeFileSync(
  'src/catalog-details.ts',
  `/**
 * Описания и характеристики карточек — подгружаются по требованию.
 * Файл сгенерирован: node scripts/gen-catalog.mjs
 */

import type { ProductDetail } from './catalog'

export const PRODUCT_DETAILS: Record<string, ProductDetail> = ${JSON.stringify(details, null, 2)}
`,
)

const bytes = fs
  .readdirSync(OUT)
  .filter((f) => f.startsWith('p-') || f.startsWith('g-'))
  .reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0)

const byCat = {}
for (const c of catalog) byCat[c.category] = (byCat[c.category] || 0) + 1
console.log('\nТоваров:', catalog.length, byCat)
console.log('Скачано новых файлов:', downloaded)
console.log('Фото каталога:', (bytes / 1024 / 1024).toFixed(1) + ' МБ')
