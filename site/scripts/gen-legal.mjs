import fs from 'node:fs'

const PAGES = [
  { key: 'privacy', slug: 'politika-konfidenczialnosti', title: 'Политика конфиденциальности' },
  { key: 'offer', slug: 'dogovor-oferty', title: 'Договор оферты' },
]

const decode = (s) => s
  .replace(/&#8212;/g,'—').replace(/&#8211;/g,'–').replace(/&mdash;/g,'—').replace(/&ndash;/g,'–')
  .replace(/&laquo;/g,'«').replace(/&raquo;/g,'»').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"')
  .replace(/&#8470;/g,'№').replace(/&#039;/g,"'").replace(/&#8217;/g,'’').replace(/&amp;/g,'&')
  .replace(/\s+/g,' ').trim()

const out = {}

for (const page of PAGES) {
  const html = await fetch(`https://kazachya-kuznya.ru/${page.slug}/`).then(r => r.text())
  let t = html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'')
  const m = t.match(/<main[\s\S]*?<\/main>/) || t.match(/<article[\s\S]*?<\/article>/)
  t = m ? m[0] : t
  // Абзац рвём только на блочных тегах: <strong> и <a> внутри предложения
  // не должны разбивать его на куски.
  t = t
    .replace(/<(?:p|div|li|tr|h[1-6]|br|section|ul|ol|table)\b[^>]*>/gi, '\n')
    .replace(/<\/(?:p|div|li|tr|h[1-6]|section|ul|ol|table)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  const lines = t.split('\n').map(s => decode(s)).filter(s => s.length > 1)

  // Первая строка — заголовок страницы, он у нас свой.
  const body = lines.slice(1)

  // Определение вида «Договор» + «— текст настоящей Оферты…» приходит двумя
  // строками: сначала сшиваем термин с его определением.
  const merged = []
  for (const line of body) {
    // Тире-определение и голый адрес сайта продолжают предыдущую строку.
    if (/^([—–]|https?:\/\/)/.test(line) && merged.length) merged[merged.length - 1] += ' ' + line
    else merged.push(line)
  }

  // Группируем в разделы: строка вида «1. Общие положения» открывает новый раздел.
  const sections = []
  let cur = null
  for (const line of merged) {
    if (/^\d{1,2}\.\s+\D/.test(line) && line.length < 90) {
      cur = { heading: line, items: [] }
      sections.push(cur)
    } else {
      if (!cur) { cur = { heading: '', items: [] }; sections.push(cur) }
      // «Срок возврата:» или «ИНН:» — это подпись к следующей строке, склеиваем.
      // Строка с тире внутри — уже готовое определение, её не трогаем.
      const prev = cur.items[cur.items.length - 1]
      const isLabel = prev && /:$/.test(prev) && prev.length < 60
      if (isLabel && !/[—–]/.test(line)) cur.items[cur.items.length - 1] = prev + ' ' + line
      else cur.items.push(line)
    }
  }
  out[page.key] = { title: page.title, sections: sections.filter(s => s.items.length) }
  console.log(page.key, '·', out[page.key].sections.length, 'разделов,',
    out[page.key].sections.reduce((n,s)=>n+s.items.length,0), 'абзацев')
}

const header = `/**
 * Юридические тексты с kazachya-kuznya.ru.
 * Файл сгенерирован: node scripts/gen-legal.mjs
 */

export type LegalSection = { heading: string; items: string[] }
export type LegalDoc = { title: string; sections: LegalSection[] }

export const LEGAL: Record<'privacy' | 'offer', LegalDoc> = `

fs.writeFileSync('src/legal.ts', header + JSON.stringify(out, null, 2) + '\n')
console.log('src/legal.ts записан,', (fs.statSync('src/legal.ts').size/1024|0) + ' КБ')
