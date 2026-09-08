import fs from 'node:fs'; import sharp from 'sharp';
const files = fs.readdirSync('raw').filter(f=>!f.startsWith('.'));
const C=5, W=260, H=200;
const rows=Math.ceil(files.length/C);
const comp=[];
for(let i=0;i<files.length;i++){
  const buf=await sharp('raw/'+files[i]).resize(W,H,{fit:'cover'}).toBuffer();
  comp.push({input:buf,left:(i%C)*W,top:Math.floor(i/C)*H});
}
await sharp({create:{width:C*W,height:rows*H,channels:3,background:'#111'}}).composite(comp).jpeg({quality:72}).toFile('sheet.jpg');
console.log(files.map((f,i)=>i+':'+f).join('\n'));
