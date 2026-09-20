const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const wordsInput = document.getElementById('wordsInput');
const importWordsInput = document.getElementById('importWordsInput');
const imageRows = document.getElementById('imageRows');
const buildImageRowsBtn = document.getElementById('buildImageRowsBtn');
const fillDemoBtn = document.getElementById('fillDemoBtn');
const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const clearBtn = document.getElementById('clearBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const shuffleToggle = document.getElementById('shuffleToggle');
const progressTitle = document.getElementById('progressTitle');
const ticketContent = document.getElementById('ticketContent');
const picturePanel = document.getElementById('picturePanel');
const wordPanel = document.getElementById('wordPanel');
const resultImage = document.getElementById('resultImage');
const resultWord = document.getElementById('resultWord');
const showWordBtn = document.getElementById('showWordBtn');
const scratchCanvas = document.getElementById('scratchCanvas');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
const imageStyleSelect = document.getElementById('imageStyleSelect');
const autoFillAllBtn = document.getElementById('autoFillAllBtn');
const searchStatus = document.getElementById('searchStatus');
const modal = document.getElementById('imageModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalSearchInput = document.getElementById('modalSearchInput');
const modalSearchBtn = document.getElementById('modalSearchBtn');
const modalMoreBtn = document.getElementById('modalMoreBtn');
const modalResults = document.getElementById('modalResults');
const modalMessage = document.getElementById('modalMessage');
const modalTitle = document.getElementById('modalTitle');
const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));
const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });

const STORAGE_KEY = 'scratch_speak_lottery_v8';
const demoWords = ['dog', 'apple', 'holiday', 'music', 'teacher', 'banana'];
const AUTO_REVEAL_THRESHOLD = 70;
const OPENVERSE_API = 'https://api.openverse.org/v1/images/';
const COIN_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='78' height='78' viewBox='0 0 78 78'><defs><radialGradient id='g' cx='35%' cy='35%'><stop offset='0' stop-color='#fff7bf'/><stop offset='0.55' stop-color='#ffd24d'/><stop offset='1' stop-color='#ca9418'/></radialGradient></defs><circle cx='39' cy='39' r='28' fill='url(#g)' stroke='#a36c00' stroke-width='4'/><circle cx='39' cy='39' r='22' fill='none' stroke='rgba(255,255,255,.45)' stroke-width='2'/><text x='39' y='48' text-anchor='middle' font-size='26' font-family='Arial' font-weight='700' fill='#8f5a00'>₵</text></svg>`)}") 24 24, auto`;

let cards = [];
let deck = [];
let current = null;
let usedCount = 0;
let revealedEnough = false;
let mode = 'word';
let audioContext = null;
let lastScratchAt = 0;
let confettiParticles = [];
let confettiAnimating = false;
let modalRowTarget = null;
let scratchRects = [];
let modalPage = 1;
let modalWord = '';
let modalBaseQueries = [];
let modalQueryIndex = 0;
const searchCache = new Map();
const rowResultCaches = new Map();
const rowResultIndices = new Map();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    wordsText: wordsInput.value,
    mode: getMode(),
    shuffle: shuffleToggle.checked,
    imageStyle: imageStyleSelect.value,
    images: gatherImageState(),
  }));
}
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { wordsInput.value = demoWords.join('\n'); buildImageRows([]); return; }
  try {
    const data = JSON.parse(raw);
    wordsInput.value = data.wordsText || demoWords.join('\n');
    if (data.mode) { const input = document.querySelector(`input[name="mode"][value="${data.mode}"]`); if (input) input.checked = true; }
    shuffleToggle.checked = data.shuffle ?? true; imageStyleSelect.value = data.imageStyle || 'illustration'; refreshModeStyles(); buildImageRows(data.images || []);
  } catch { wordsInput.value = demoWords.join('\n'); buildImageRows([]); }
}
function refreshModeStyles(){ document.querySelectorAll('.mode-option').forEach(el=>{ const input=el.querySelector('input'); el.classList.toggle('selected', input.checked); }); }
function getMode(){ return document.querySelector('input[name="mode"]:checked')?.value || 'word'; }
function parseWordsFromText(text){ return text.split(/\r?\n|,|;/).map(v=>v.trim()).filter(Boolean); }
function parseWords(){ return parseWordsFromText(wordsInput.value); }
function makeButton(text, className, onClick){ const btn=document.createElement('button'); btn.type='button'; btn.className=className; btn.textContent=text; btn.addEventListener('click', onClick); return btn; }
function setStatus(message){ searchStatus.textContent = message; }
function cacheKey(word){ return `${word.toLowerCase()}|${imageStyleSelect.value}`; }

function buildImageRows(existing = []) {
  const words = parseWords();
  if (!words.length) { imageRows.className='image-rows empty-state-box'; imageRows.innerHTML='<p>Add your words first, then click <strong>Refresh picture list</strong>.</p>'; saveState(); return; }
  const savedMap = new Map(existing.map(item => [item.word.toLowerCase(), item]));
  imageRows.className='image-rows'; imageRows.innerHTML='';
  words.forEach(word => {
    const row=document.createElement('div'); row.className='image-row';
    const wordInput=document.createElement('input'); wordInput.className='image-word-input'; wordInput.value=word; wordInput.readOnly=true;
    const preview=document.createElement('div'); preview.className='image-preview'; preview.textContent='No image';
    const urlInput=document.createElement('input'); urlInput.className='image-url-input'; urlInput.type='url'; urlInput.placeholder='Image URL (optional)';
    const tools=document.createElement('div'); tools.className='row-tools';
    const fileInput=document.createElement('input'); fileInput.type='file'; fileInput.accept='image/*'; fileInput.hidden=true;
    function setPreview(src){ if(src){ preview.dataset.src=src; preview.innerHTML=`<img src="${src}" alt="${word}">`; } else { delete preview.dataset.src; preview.textContent='No image'; } saveState(); }
    row.setImage=setPreview; row.word=word; row.previewBox=preview;

    const searchBtn=makeButton('Search','mini-btn gold-btn',()=>openImageModal(row,word));
    const autoBtn=makeButton('Auto','mini-btn gold-btn',async()=>{ autoBtn.disabled=true; setStatus(`Searching picture for ${word}...`); try{ const {results,best}=await getCuratedResultsForWord(word,1); if(best){ setRowResults(word, results); row.setImage(best.url); setStatus(`Picture added for ${word}.`); } else setStatus(`No good picture found for ${word}.`);}catch{ setStatus(`Could not get a picture for ${word}.`);} finally{ autoBtn.disabled=false; updateRowNextButton(word);} });
    const nextPictureBtn=makeButton('Next picture','mini-btn',()=>cycleRowPicture(word,row));
    nextPictureBtn.disabled=true;
    row.nextBtn = nextPictureBtn;
    const uploadBtn=makeButton('Upload','mini-btn',()=>fileInput.click());
    const urlBtn=makeButton('Use URL','mini-btn',()=>{ const src=urlInput.value.trim(); if(src) setPreview(src); });
    const clearImageBtn=makeButton('Clear','mini-btn',()=>{ urlInput.value=''; setPreview(''); });

    fileInput.addEventListener('change', async (e)=>{ const file=e.target.files?.[0]; if(!file) return; const src=await readFileAsDataUrl(file); setPreview(src); setStatus(`Picture uploaded for ${word}.`); });

    const existingItem=savedMap.get(word.toLowerCase());
    if(existingItem?.imageSrc){ setPreview(existingItem.imageSrc); if(/^https?:/i.test(existingItem.imageSrc)) urlInput.value=existingItem.imageSrc; }

    tools.append(searchBtn, autoBtn, nextPictureBtn, uploadBtn, urlBtn, clearImageBtn, fileInput);
    row.append(wordInput, preview, urlInput, tools); imageRows.appendChild(row); updateRowNextButton(word);
  });
  saveState();
}
function gatherImageState(){ return Array.from(document.querySelectorAll('.image-row')).map(row=>({ word: row.querySelector('.image-word-input')?.value?.trim() || '', imageSrc: row.querySelector('.image-preview')?.dataset?.src || '' })); }
function buildCards(){ const words=parseWords(); const imageMap=new Map(gatherImageState().map(item=>[item.word.toLowerCase(), item.imageSrc || ''])); return words.map(word=>({word, imageSrc:imageMap.get(word.toLowerCase()) || ''})); }
function shuffled(arr){ const copy=arr.map(v=>({...v})); if(!shuffleToggle.checked) return copy; for(let i=copy.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; } return copy; }

function isShortSimpleWord(word){ return /^[a-zA-Z-]{2,14}$/.test(word.trim()) && !/\s/.test(word.trim()); }
function buildSmartQueries(word){ const clean=word.trim(); const style=imageStyleSelect.value; const queries=[]; if(style==='illustration'){ if(isShortSimpleWord(clean)){ queries.push(`cute ${clean} cartoon isolated white background`); queries.push(`${clean} cartoon isolated white background`); queries.push(`${clean} illustration isolated`); queries.push(`${clean} clipart`); queries.push(`${clean} drawing for kids`); } else { queries.push(`${clean} illustration`); queries.push(`${clean} cartoon`); queries.push(`${clean} drawing`); queries.push(clean); } } else if(style==='photo'){ queries.push(`${clean} isolated white background`); queries.push(`${clean} photo`); queries.push(clean); } else { queries.push(clean); queries.push(`${clean} isolated`); queries.push(`${clean} illustration`); } return [...new Set(queries)]; }
function positiveScore(title, creator, word){ const t=`${title||''} ${creator||''}`.toLowerCase(); const w=word.toLowerCase(); let score=0; if(t.includes(w)) score+=6; if(/cartoon|illustration|drawing|clipart|vector/.test(t)) score += imageStyleSelect.value==='illustration' ? 4 : 1; if(/isolated|white background/.test(t)) score += 2; if(/cute|kids|child/.test(t)) score += 1.5; if(/photo|photograph/.test(t)) score += imageStyleSelect.value==='photo' ? 4 : -2; return score; }
function negativeScore(title){ const t=(title||'').toLowerCase(); let score=0; if(/logo|flag|map|diagram|chart|poster|book|cover|stamp|advertisement|banner|wallpaper|pattern/.test(t)) score -= 6; if(/museum|painting|artwork|album|screenshot|page|icon set/.test(t)) score -= 4; return score; }
function chooseBestImage(results, word){ if(!results.length) return null; const scored=results.map(item=>{ let score=positiveScore(item.title,item.creator,word)+negativeScore(item.title); score += (Math.min(item.width||0,item.height||0) >= 400 ? 1 : 0); return {item, score}; }).sort((a,b)=>b.score-a.score); return scored[0]?.item || results[0]; }
function dedupeByUrl(items){ const seen=new Set(); const out=[]; for(const item of items){ const key=item.fullUrl || item.url; if(seen.has(key)) continue; seen.add(key); out.push(item);} return out; }
async function fetchOpenverse(query, page=1){ const params=new URLSearchParams({ q:query, page:String(page), page_size:'20', mature:'false', aspect_ratio:'square', license_type:'all' }); const key=`${query}|${page}`; if(searchCache.has(key)) return searchCache.get(key); const res=await fetch(`${OPENVERSE_API}?${params.toString()}`); if(!res.ok) throw new Error('Search failed'); const data=await res.json(); const results=(data.results || []).map(item=>({ title:item.title || 'Untitled', creator:item.creator || '', thumb:item.thumbnail || item.url, url:item.thumbnail || item.url, fullUrl:item.url, width:item.width, height:item.height })).filter(item=>item.url); searchCache.set(key, results); return results; }
async function getCuratedResultsForWord(word, page=1){ const queries=buildSmartQueries(word); let merged=[]; for(const q of queries){ try{ const results=await fetchOpenverse(q, page); if(results.length) merged=merged.concat(results); if(merged.length >= 24) break; } catch{} }
  merged = dedupeByUrl(merged);
  merged.sort((a,b)=> (positiveScore(b.title,b.creator,word)+negativeScore(b.title)) - (positiveScore(a.title,a.creator,word)+negativeScore(a.title)));
  const best = chooseBestImage(merged, word);
  return {results: merged, best};
}
function setRowResults(word, results){ const key=cacheKey(word); rowResultCaches.set(key, results || []); if(!rowResultIndices.has(key)) rowResultIndices.set(key, 0); updateRowNextButton(word); }
function getRowResults(word){ return rowResultCaches.get(cacheKey(word)) || []; }
function updateRowNextButton(word){ const row = [...document.querySelectorAll('.image-row')].find(r => r.word === word); if(!row || !row.nextBtn) return; row.nextBtn.disabled = getRowResults(word).length < 2; }
function cycleRowPicture(word, row){ const key=cacheKey(word); const results=getRowResults(word); if(results.length < 2){ setStatus(`Search first to load more pictures for ${word}.`); return; } let index=(rowResultIndices.get(key) ?? 0) + 1; if(index >= results.length) index = 0; rowResultIndices.set(key,index); row.setImage(results[index].url); setStatus(`Showing another picture for ${word}.`); }

function openImageModal(row, word){ modalRowTarget=row; modalWord=word; modalPage=1; modalQueryIndex=0; modalBaseQueries=buildSmartQueries(word); modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); modalTitle.textContent=`Choose a picture for “${word}”`; modalSearchInput.value=modalBaseQueries[0]; modalResults.innerHTML=''; modalMessage.textContent='Loading pictures...'; fetchModalResults(true); }
function closeImageModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); modalRowTarget=null; modalResults.innerHTML=''; }
async function fetchModalResults(reset=false){ const rawQuery=modalSearchInput.value.trim(); if(!rawQuery) return; if(reset) modalPage=modalPage||1; modalResults.innerHTML=''; modalMessage.textContent='Loading pictures...'; modalMoreBtn.disabled=true; try{ let results=await fetchOpenverse(rawQuery, modalPage); if(!results.length && modalQueryIndex + 1 < modalBaseQueries.length){ modalQueryIndex += 1; modalSearchInput.value=modalBaseQueries[modalQueryIndex]; results=await fetchOpenverse(modalSearchInput.value, modalPage); }
  results=dedupeByUrl(results);
  results.sort((a,b)=> (positiveScore(b.title,b.creator,modalWord)+negativeScore(b.title)) - (positiveScore(a.title,a.creator,modalWord)+negativeScore(a.title)));
  if(!results.length){ modalMessage.textContent='No pictures found. Try another word.'; modalMoreBtn.disabled=false; return; }
  setRowResults(modalWord, results); rowResultIndices.set(cacheKey(modalWord), 0); updateRowNextButton(modalWord);
  modalMessage.textContent='Click a picture to insert it automatically.';
  for(const item of results){ const tile=document.createElement('button'); tile.type='button'; tile.className='result-tile'; tile.innerHTML=`<div class="result-thumb"><img src="${item.thumb}" alt="${escapeHtml(item.title)}"></div><div class="use-badge">Use this picture</div><div class="result-caption">${escapeHtml(item.title)}</div>`; tile.addEventListener('click',()=>{ if(modalRowTarget?.setImage){ modalRowTarget.setImage(item.url); const list=getRowResults(modalWord); const idx=list.findIndex(x => (x.fullUrl||x.url)===(item.fullUrl||item.url)); if(idx>=0) rowResultIndices.set(cacheKey(modalWord), idx); setStatus(`Picture inserted for ${modalRowTarget.word}.`); } closeImageModal(); }); modalResults.appendChild(tile); }
  modalMoreBtn.disabled=false;
 } catch { modalMessage.textContent='Could not load pictures right now.'; modalMoreBtn.disabled=false; } }
async function autoFillAllImages(){ const rows=Array.from(document.querySelectorAll('.image-row')); if(!rows.length) return; autoFillAllBtn.disabled=true; let ok=0, miss=0; for(const row of rows){ if(row.previewBox?.dataset?.src) continue; setStatus(`Searching picture for ${row.word}...`); try{ const {results,best}=await getCuratedResultsForWord(row.word,1); setRowResults(row.word, results); if(best){ row.setImage(best.url); ok += 1; } else miss += 1; } catch { miss += 1; } await new Promise(r=>setTimeout(r,160)); } setStatus(`Auto-fill finished: ${ok} added, ${miss} missed.`); autoFillAllBtn.disabled=false; document.querySelectorAll('.image-row').forEach(r=>updateRowNextButton(r.word)); }

function startGame(){ mode=getMode(); cards=buildCards(); if(!cards.length) return alert('Add at least one word first.'); if(mode!=='word' && cards.some(card=>!card.imageSrc)) return alert('Picture modes need a picture for every word.'); deck=shuffled(cards); usedCount=0; setupScreen.classList.remove('active'); gameScreen.classList.add('active'); loadNextCard(); saveState(); }
function loadNextCard(){ if(!deck.length) deck=shuffled(cards); current=deck.shift(); usedCount=(usedCount % cards.length)+1; progressTitle.textContent=`Ticket ${usedCount} / ${cards.length}`; renderCurrent(); prepareScratchSurface(); revealedEnough=false; nextBtn.disabled=true; }
function renderCurrent(){ const hasPicture=mode!=='word'; picturePanel.classList.toggle('hidden',!hasPicture); showWordBtn.classList.toggle('hidden', mode!=='picture'); if(mode==='word'){ ticketContent.className='ticket-content word-layout'; resultWord.textContent=current.word; resultWord.classList.remove('hidden'); } else if(mode==='picture-word'){ ticketContent.className='ticket-content dual-layout'; resultWord.textContent=current.word; resultWord.classList.remove('hidden'); resultImage.src=current.imageSrc; } else { ticketContent.className='ticket-content dual-layout'; resultWord.textContent=''; resultWord.classList.add('hidden'); resultImage.src=current.imageSrc; } requestAnimationFrame(()=>fitWord()); }
function fitWord(){ const text=(current?.word || '').trim(); if(!text || resultWord.classList.contains('hidden')) return; const availableWidth=wordPanel.clientWidth-18, availableHeight=wordPanel.clientHeight-18; if(availableWidth<=0||availableHeight<=0) return; let size=mode==='word' ? Math.min(availableWidth*0.92, availableHeight*0.95, 270) : Math.min(availableWidth*0.60, availableHeight*0.55, 150); if(mode==='word' && text.length<=4) size=Math.min(availableWidth*1.16, availableHeight*1.02, 340); if(mode==='word' && text.length<=3) size=Math.min(availableWidth*1.26, availableHeight*1.08, 380); if(text.length>=12) size*=0.88; if(text.length>=18) size*=0.79; if(text.length>=26) size*=0.72; resultWord.style.fontSize=`${Math.max(24,size)}px`; let loops=0; while((resultWord.scrollWidth>availableWidth || resultWord.scrollHeight>availableHeight) && loops<140){ size-=2; resultWord.style.fontSize=`${Math.max(20,size)}px`; loops++; } loops=0; while(mode==='word' && resultWord.scrollWidth<availableWidth*0.92 && resultWord.scrollHeight<availableHeight*0.92 && size<380 && loops<120){ size+=2; resultWord.style.fontSize=`${size}px`; if(resultWord.scrollWidth>availableWidth || resultWord.scrollHeight>availableHeight){ size-=2; resultWord.style.fontSize=`${size}px`; break;} loops++; } if(mode==='word' && text.length<=5){ const ratio=Math.min(1.45,Math.max(1,(availableWidth*0.96)/Math.max(resultWord.scrollWidth,1))); resultWord.style.transform=`translateY(-2px) scaleX(${ratio})`; } else resultWord.style.transform='translateY(-2px) scaleX(1)'; }
function prepareScratchSurface(){ const dpr=Math.max(1,window.devicePixelRatio||1), rect=scratchCanvas.getBoundingClientRect(); scratchCanvas.width=rect.width*dpr; scratchCanvas.height=rect.height*dpr; ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr); ctx.clearRect(0,0,rect.width,rect.height); ctx.save(); roundRect(ctx,0,0,rect.width,rect.height,30); ctx.clip(); scratchRects=[]; if(mode==='word'){ const field={x:26,y:70,w:rect.width-52,h:rect.height-128}; drawScratchField(field); scratchRects.push(field);} else { const innerX=24,innerY=72,innerW=rect.width-48,innerH=rect.height-128,gap=18,picW=innerW*0.43,wordW=innerW-picW-gap; const field1={x:innerX,y:innerY,w:picW,h:innerH}, field2={x:innerX+picW+gap,y:innerY,w:wordW,h:innerH}; drawScratchField(field1); drawScratchField(field2); scratchRects.push(field1,field2);} ctx.restore(); scratchCanvas.style.cursor=COIN_CURSOR; }
function drawScratchField({x,y,w,h}){ const silver=ctx.createLinearGradient(x,y,x+w,y+h); silver.addColorStop(0,'#99a5bc'); silver.addColorStop(.14,'#eff3fb'); silver.addColorStop(.3,'#cad2e0'); silver.addColorStop(.48,'#f9fbff'); silver.addColorStop(.72,'#bcc7d9'); silver.addColorStop(1,'#939eb4'); roundRect(ctx,x,y,w,h,24); ctx.fillStyle=silver; ctx.fill(); ctx.save(); roundRect(ctx,x,y,w,h,24); ctx.clip(); ctx.globalAlpha=.26; for(let i=0;i<22;i++){ ctx.fillStyle=i%2?'rgba(255,255,255,.42)':'rgba(255,255,255,.12)'; ctx.fillRect(x-20+i*(w/12),y,18,h);} ctx.globalAlpha=.18; for(let i=0;i<220;i++){ ctx.fillStyle=i%4?'rgba(255,255,255,.35)':'rgba(120,128,145,.28)'; ctx.beginPath(); ctx.arc(x+Math.random()*w,y+Math.random()*h,Math.random()*2+.3,0,Math.PI*2); ctx.fill(); } ctx.restore(); ctx.strokeStyle='rgba(120,132,159,.45)'; ctx.lineWidth=2; roundRect(ctx,x+1,y+1,w-2,h-2,24); ctx.stroke(); }
function roundRect(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function scratchAt(ev){ const rect=scratchCanvas.getBoundingClientRect(), x=ev.clientX-rect.left, y=ev.clientY-rect.top, size=Math.max(46,rect.width*.03); ctx.globalCompositeOperation='destination-out'; const grad=ctx.createRadialGradient(x,y,size*.22,x,y,size); grad.addColorStop(0,'rgba(0,0,0,1)'); grad.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fill(); playScratchSound(); }
function getAudio(){ if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)(); return audioContext; }
function playScratchSound(){ const now=performance.now(); if(now-lastScratchAt<55) return; lastScratchAt=now; const ac=getAudio(); const bufferSize=Math.floor(ac.sampleRate*0.05); const buffer=ac.createBuffer(1,bufferSize,ac.sampleRate); const data=buffer.getChannelData(0); for(let i=0;i<bufferSize;i++) data[i]=(Math.random()*2-1)*(1-i/bufferSize)*0.35; const noise=ac.createBufferSource(); noise.buffer=buffer; const filter=ac.createBiquadFilter(); filter.type='bandpass'; filter.frequency.value=1200; filter.Q.value=.7; const gain=ac.createGain(); gain.gain.setValueAtTime(.028,ac.currentTime); gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.06); noise.connect(filter).connect(gain).connect(ac.destination); noise.start(); noise.stop(ac.currentTime+.06); }
function playFanfare(){ const ac=getAudio(), now=ac.currentTime, notes=[523.25,659.25,783.99,1046.5]; notes.forEach((freq,i)=>{ const osc=ac.createOscillator(), gain=ac.createGain(); osc.type='triangle'; osc.frequency.setValueAtTime(freq,now+i*.11); gain.gain.setValueAtTime(.0001,now+i*.11); gain.gain.linearRampToValueAtTime(.07,now+i*.11+.02); gain.gain.exponentialRampToValueAtTime(.0001,now+i*.11+.25); osc.connect(gain).connect(ac.destination); osc.start(now+i*.11); osc.stop(now+i*.11+.28); }); }
function fireConfetti(){ confettiCanvas.classList.remove('hidden'); const dpr=window.devicePixelRatio||1; confettiCanvas.width=window.innerWidth*dpr; confettiCanvas.height=window.innerHeight*dpr; confettiCtx.setTransform(1,0,0,1,0,0); confettiCtx.scale(dpr,dpr); confettiParticles=Array.from({length:150},()=>({x:window.innerWidth/2+(Math.random()*220-110),y:window.innerHeight*.25+(Math.random()*20-10),vx:Math.random()*8-4,vy:Math.random()*-8-2,size:Math.random()*8+5,rot:Math.random()*Math.PI,vr:Math.random()*.3-.15,color:['#6f56f8','#04b7ff','#ffd764','#ff7f7f','#7af0b0'][Math.floor(Math.random()*5)],life:80+Math.random()*24})); if(!confettiAnimating) animateConfetti(); }
function animateConfetti(){ confettiAnimating=true; confettiCtx.clearRect(0,0,window.innerWidth,window.innerHeight); confettiParticles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.16; p.rot+=p.vr; p.life-=1; confettiCtx.save(); confettiCtx.translate(p.x,p.y); confettiCtx.rotate(p.rot); confettiCtx.fillStyle=p.color; confettiCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.64); confettiCtx.restore(); }); confettiParticles=confettiParticles.filter(p=>p.life>0 && p.y<window.innerHeight+30); if(confettiParticles.length) requestAnimationFrame(animateConfetti); else { confettiAnimating=false; confettiCanvas.classList.add('hidden'); confettiCtx.clearRect(0,0,window.innerWidth,window.innerHeight); } }
function autoRevealAndCelebrate(){ if(revealedEnough) return; revealedEnough=true; if(mode==='picture'){ resultWord.textContent=current?.word || ''; resultWord.classList.remove('hidden'); showWordBtn.classList.add('hidden'); fitWord(); } const rect=scratchCanvas.getBoundingClientRect(); ctx.clearRect(0,0,rect.width,rect.height); nextBtn.disabled=false; fireConfetti(); playFanfare(); }
function getRevealedPercent(){ if(!scratchRects.length) return 0; let clearPixels=0,total=0; for(const r of scratchRects){ const img=ctx.getImageData(Math.floor(r.x),Math.floor(r.y),Math.max(1,Math.floor(r.w)),Math.max(1,Math.floor(r.h))).data; for(let i=3;i<img.length;i+=24){ total++; if(img[i]<30) clearPixels++; } } return total ? (clearPixels/total)*100 : 0; }
function checkReveal(){ if(revealedEnough) return; if(getRevealedPercent()>=AUTO_REVEAL_THRESHOLD) autoRevealAndCelebrate(); }
function revealAll(){ autoRevealAndCelebrate(); }
function importWordsFile(file){ file.text().then(text=>{ const words=parseWordsFromText(text); if(!words.length) return alert('Could not find words in this file.'); wordsInput.value=words.join('\n'); buildImageRows(gatherImageState()); saveState(); }); }
function toggleFullscreen(){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }
function exitToSettings(){ gameScreen.classList.remove('active'); setupScreen.classList.add('active'); saveState(); }
function restartDeck(){ deck=shuffled(cards); usedCount=0; loadNextCard(); }
function readFileAsDataUrl(file){ return new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(file); }); }
function escapeHtml(str){ return String(str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

fillDemoBtn.addEventListener('click',()=>{ wordsInput.value=demoWords.join('\n'); buildImageRows(gatherImageState()); saveState(); });
importWordsInput.addEventListener('change',e=>{ const file=e.target.files?.[0]; if(file) importWordsFile(file); });
buildImageRowsBtn.addEventListener('click',()=>buildImageRows(gatherImageState()));
autoFillAllBtn.addEventListener('click',autoFillAllImages);
startBtn.addEventListener('click',startGame); backBtn.addEventListener('click',exitToSettings); restartBtn.addEventListener('click',restartDeck); clearBtn.addEventListener('click',revealAll); nextBtn.addEventListener('click',loadNextCard); fullscreenBtn.addEventListener('click',toggleFullscreen);
showWordBtn.addEventListener('click',()=>{ resultWord.textContent=current?.word || ''; resultWord.classList.remove('hidden'); showWordBtn.classList.add('hidden'); fitWord(); });
closeModalBtn.addEventListener('click',closeImageModal); modal.querySelector('[data-close-modal]').addEventListener('click',closeImageModal);
modalSearchBtn.addEventListener('click',()=>{ modalPage=1; fetchModalResults(true); });
modalMoreBtn.addEventListener('click',()=>{ modalPage += 1; fetchModalResults(true); });
modalSearchInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ modalPage=1; fetchModalResults(true); } });
wordsInput.addEventListener('input',saveState); shuffleToggle.addEventListener('change',saveState); imageStyleSelect.addEventListener('change',saveState);
modeInputs.forEach(input=>input.addEventListener('change',()=>{ refreshModeStyles(); saveState(); }));
window.addEventListener('resize',()=>{ if(gameScreen.classList.contains('active')){ prepareScratchSurface(); fitWord(); } });
window.addEventListener('keydown',e=>{ if(e.key==='Escape' && !modal.classList.contains('hidden')) closeImageModal(); });
let isDown=false; scratchCanvas.addEventListener('pointerdown',e=>{ isDown=true; scratchAt(e); checkReveal(); }); scratchCanvas.addEventListener('pointermove',e=>{ if(!isDown) return; scratchAt(e); checkReveal(); }); window.addEventListener('pointerup',()=>{ isDown=false; }); scratchCanvas.addEventListener('pointerleave',()=>{ isDown=false; });

loadState(); refreshModeStyles(); if(!document.querySelector('.image-row')) buildImageRows(gatherImageState());
