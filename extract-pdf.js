const fs=require('fs'), zlib=require('zlib');
const buf=fs.readFileSync('3d-hanging-rack-hero-section-prompt.pdf');
const str=buf.toString('latin1');
let out='';
const re=/stream\r?\n/g; let m;
while((m=re.exec(str))){
  const start=m.index+m[0].length;
  const end=str.indexOf('endstream',start);
  if(end<0) continue;
  let raw=buf.slice(start,end);
  try{
    let data=zlib.inflateSync(raw).toString('latin1');
    let texts=[];
    let tr=/\((?:\\.|[^\\()])*\)\s*Tj/g, tm;
    while((tm=tr.exec(data))) texts.push(tm[0].replace(/\)\s*Tj$/,'').slice(1).replace(/\\([()\\])/g,'$1'));
    let tr2=/\[(.*?)\]\s*TJ/g;
    while((tm=tr2.exec(data))){
      let inner=tm[1], arr=[], rr=/\((?:\\.|[^\\()])*\)/g, am;
      while((am=rr.exec(inner))) arr.push(am[0].slice(1,-1).replace(/\\([()\\])/g,'$1'));
      if(arr.length) texts.push(arr.join(''));
    }
    if(texts.length) out+=texts.join('\n')+'\n';
  }catch(e){}
}
console.log(out.slice(0,12000));
