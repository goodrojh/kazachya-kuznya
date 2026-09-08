import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const B = 'https://kazachya-kuznya.ru/wp-content/uploads/';
const T = 'https://kazachya-kuznya.ru/wp-content/themes/kuznyachiy/assets/img/';
const urls = [
  'https://i.ytimg.com/vi/ASFXP6gA2g8/maxresdefault.jpg',
  T+'l201.jpg', T+'l202.jpg', T+'l401.jpg', T+'l402.jpg', T+'l403.jpg', T+'l404.jpg',
  B+'2025/08/cat_accessories.jpg', B+'2025/08/cat_kinzhaly.jpg', B+'2025/08/cat_nozhi.jpg',
  B+'2025/08/cat_sabli.jpg', B+'2025/08/cat_shashki.jpg', B+'2026/02/img_2195.jpeg',
  B+'2026/02/img_1498.jpeg', B+'2025/10/MYP0032/IMG_2585.JPEG',
  B+'2026/02/img_8226-scaled.jpg', B+'2026/02/img_8454-scaled.jpg', B+'2026/02/img_8471-scaled.jpg',
  B+'2026/02/img_8555-scaled.jpg', B+'2026/02/img_8467-scaled.jpg', B+'2026/02/img_8562-scaled.jpg',
  B+'2026/02/img_8486-scaled.jpg', B+'2026/02/img_2269-scaled-e1770650503565.jpg',
  B+'2026/02/img_7904-2-scaled.jpg', B+'2026/02/img_6461-scaled.jpg', B+'2026/02/img_6471-scaled.jpg',
  B+'2026/02/img_6481-scaled.jpg', B+'2026/02/img_6495-scaled.jpg', B+'2026/02/img_2220-scaled.jpg',
  B+'2025/10/img_8259-scaled.jpg', B+'2025/10/KPL002/IMG_0526.JPEG', B+'2025/10/img_6437-scaled.jpg',
  B+'2025/10/img_7543-scaled.jpg', B+'2025/10/img_8529-scaled.jpg', B+'2025/10/img_7710-scaled.jpg',
  B+'2026/02/img_3509-scaled.jpeg', B+'2026/02/img_6964-scaled.jpg', B+'2025/10/img_1143-scaled.jpeg',
  B+'2025/10/img_6535-scaled.jpg', B+'2026/02/img_1668-scaled.jpeg', B+'2025/10/img_1484-scaled.jpeg',
];
fs.mkdirSync('raw', { recursive: true });
for (const u of urls) {
  let name = decodeURIComponent(u.split('/').pop());
  if (u.includes('ytimg')) name = 'yt-' + u.split('/vi/')[1].split('/')[0] + '.jpg';
  const out = path.join('raw', name);
  if (!fs.existsSync(out)) {
    const r = await fetch(u);
    if (!r.ok) { console.log('FAIL', r.status, u); continue; }
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  }
  const m = await sharp(out).metadata();
  console.log(name.padEnd(42), m.width + 'x' + m.height, (fs.statSync(out).size/1024|0)+'kb');
}
