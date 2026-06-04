/**
 * bake-japanese.js — Pre-bake Japanese translations into ribbit-stories.js
 *
 * Reads every vocabulary entry, fetches Japanese word + definition via
 * MyMemory API, and writes the translations directly into the stories file.
 *
 * Run ONCE locally (needs network):
 *   node bake-japanese.js
 *
 * Result: each vocab entry gains a `ja` object:
 *   "cat": { def:"...", pos:"noun", ja:{ word:"猫", def:"..." } }
 *
 * After running: the word popup will show instant Japanese with no API calls.
 */

const fs = require('fs');
const https = require('https');

const FILE = './ribbit-stories.js';

function fetchMyMemory(text, delay=0){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ja`;
      https.get(url, (res)=>{
        let data='';
        res.on('data',d=>data+=d);
        res.on('end',()=>{
          try{
            const j=JSON.parse(data);
            resolve(j?.responseData?.translatedText||null);
          } catch(e){ resolve(null); }
        });
      }).on('error',()=>resolve(null));
    }, delay);
  });
}

async function run(){
  let content = fs.readFileSync(FILE,'utf8');

  // Extract all vocab entries: "word":{def:"...",pos:"..."}
  const regex = /"(\w[\w\s'-]*)"\s*:\s*\{\s*def\s*:\s*"([^"]+)"\s*,\s*pos\s*:\s*"([^"]+)"\s*\}/g;
  const entries = [];
  let m;
  while((m=regex.exec(content))!==null){
    entries.push({ word:m[1], def:m[2], pos:m[3], index:m.index, full:m[0] });
  }

  // Deduplicate by word (translate each unique word once)
  const unique = {};
  entries.forEach(e=>{ if(!unique[e.word]) unique[e.word]=e; });
  const words = Object.values(unique);

  console.log(`Found ${entries.length} entries (${words.length} unique). Translating...`);

  const cache = {};
  const BATCH = 5;
  for(let i=0;i<words.length;i+=BATCH){
    const batch = words.slice(i,i+BATCH);
    const results = await Promise.all(batch.map((w,j)=>
      Promise.all([
        fetchMyMemory(w.word, j*200),
        fetchMyMemory(w.def, j*200+100)
      ])
    ));
    results.forEach(([wordTr, defTr], j)=>{
      const w = batch[j].word;
      cache[w] = { word: wordTr||w, def: defTr||'' };
      if((i+j)%50===0) console.log(`  ${i+j}/${words.length}: ${w} → ${wordTr||'(failed)'}`);
    });
    // Pause between batches to respect rate limits
    await new Promise(r=>setTimeout(r,1000));
  }

  // Inject ja:{} into each entry
  let updated = content;
  entries.forEach(e=>{
    const ja = cache[e.word];
    if(!ja) return;
    const jaStr = `,ja:{word:"${ja.word.replace(/"/g,'\\"')}",def:"${ja.def.replace(/"/g,'\\"')}"}`;
    // Only add if not already present
    const newEntry = e.full.replace('}', ''+jaStr+'}');
    // Replace just this occurrence
    updated = updated.replace(e.full, newEntry);
  });

  fs.writeFileSync(FILE, updated, 'utf8');
  console.log(`\nDone. Updated ${FILE}`);
}

run().catch(console.error);
