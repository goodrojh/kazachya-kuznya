import fs from 'node:fs'; import sharp from 'sharp';
const OUT='public/img'; fs.mkdirSync(OUT,{recursive:true});
const map = {
  // atmosphere / forge
  'l201.jpg':            ['forge-1', 1400, 84],
  'l202.jpg':            ['forge-2', 1400, 84],
  // превью видео с YouTube
  'yt-ASFXP6gA2g8.jpg':  ['video-baklanov', 1280, 86],
  // categories
  'cat_shashki.jpg':     ['cat-shashki', 900, 86],
  'cat_sabli.jpg':       ['cat-sabli', 900, 86],
  'cat_nozhi.jpg':       ['cat-nozhi', 900, 86],
  'cat_kinzhaly.jpg':    ['cat-kinzhaly', 900, 86],
  'cat_accessories.jpg': ['cat-aksessuary', 900, 86],
  'img_2195.jpeg':       ['cat-palashi', 900, 86],
  'img_1498.jpeg':       ['cat-shpagi', 900, 86],
  'IMG_2585.JPEG':       ['cat-yaponiya', 900, 86],
  // products
  'img_8226-scaled.jpg':                   ['p-romanov', 860, 85],
  'img_8555-scaled.jpg':                   ['p-kuban', 860, 85],
  'img_8471-scaled.jpg':                   ['p-1838', 860, 85],
  'img_8454-scaled.jpg':                   ['p-baklanov', 860, 85],
  'img_8486-scaled.jpg':                   ['p-snamibog', 860, 85],
  'img_8467-scaled.jpg':                   ['p-kkv', 860, 85],
  'img_8562-scaled.jpg':                   ['p-kavkaz', 860, 85],
  'img_2269-scaled-e1770650503565.jpg':    ['p-klych', 860, 85],
  'img_7904-2-scaled.jpg':                 ['p-talisman', 860, 85],
  'img_6481-scaled.jpg':                   ['p-nozh-bga', 860, 85],
  'img_6471-scaled.jpg':                   ['p-nozh-cenu', 860, 85],
  'img_6461-scaled.jpg':                   ['p-nozh-otech', 860, 85],
  'img_2220-scaled.jpg':                   ['p-katana', 860, 85],
  'img_8259-scaled.jpg':                   ['p-palash-1855', 860, 85],
  'IMG_0526.JPEG':                         ['p-kavalergard', 860, 85],
  'img_6437-scaled.jpg':                   ['p-shpaga-1740', 860, 85],
  'img_7543-scaled.jpg':                   ['p-kinzhal-kkv', 860, 85],
  'img_8529-scaled.jpg':                   ['p-bebut', 860, 85],
  'img_7710-scaled.jpg':                   ['p-vakidzasi', 860, 85],
  'img_3509-scaled.jpeg':                  ['p-nagayka', 860, 85],
  'img_6964-scaled.jpg':                   ['p-futlyar-nozh', 860, 85],
  'img_1143-scaled.jpeg':                  ['p-podstavka', 860, 85],
  'img_6535-scaled.jpg':                   ['p-futlyar', 860, 85],
  'img_1484-scaled.jpeg':                  ['p-shpaga-1798', 860, 85],
};
let total=0;
for (const [src,[name,w,q]] of Object.entries(map)) {
  const dst = `${OUT}/${name}.webp`;
  await sharp('raw/'+src).rotate().resize({width:w,withoutEnlargement:true}).sharpen({sigma:0.7,m1:0.5,m2:0.9}).webp({quality:q}).toFile(dst);
  const kb = fs.statSync(dst).size/1024;
  total += kb;
  console.log(name.padEnd(18), (kb|0)+'kb');
}
console.log('TOTAL', (total/1024).toFixed(2)+'MB');
