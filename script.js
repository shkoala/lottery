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
const stage = document.getElementById('stage');
const ticket = document.getElementById('ticket');
const ticketContent = document.getElementById('ticketContent');
const picturePanel = document.getElementById('picturePanel');
const wordPanel = document.getElementById('wordPanel');
const resultImage = document.getElementById('resultImage');
const resultWord = document.getElementById('resultWord');
const showWordBtn = document.getElementById('showWordBtn');
const scratchCanvas = document.getElementById('scratchCanvas');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
const yandexStyleSelect = document.getElementById('yandexStyleSelect');
const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));
const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });

const STORAGE_KEY = 'scratch_speak_lottery_v3';
const demoWords = ['dog', 'apple', 'holiday', 'music', 'teacher', 'banana'];
const AUTO_REVEAL_THRESHOLD = 70;
const COIN_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'><defs><radialGradient id='g' cx='32%' cy='28%'><stop offset='0' stop-color='#fffbe0'/><stop offset='.28' stop-color='#ffe57b'/><stop offset='.63' stop-color='#ffc92f'/><stop offset='1' stop-color='#b77700'/></radialGradient><filter id='s'><feDropShadow dx='0' dy='4' stdDeviation='3' flood-opacity='.35'/></filter></defs><circle cx='46' cy='46' r='33' fill='url(#g)' stroke='#9d6200' stroke-width='4' filter='url(#s)'/><circle cx='46' cy='46' r='26' fill='none' stroke='rgba(255,255,255,.5)' stroke-width='2'/><path d='M27 38c10-12 29-15 41-5' stroke='rgba(255,255,255,.52)' stroke-width='4' fill='none' stroke-linecap='round'/><text x='46' y='57' text-anchor='middle' font-size='31' font-family='Arial' font-weight='700' fill='#875300'>₵</text></svg>`)}") 28 28, auto`;

let cards = [];
let deck = [];
let current = null;
let usedCount = 0;
let revealedEnough = false;
let mode = 'word';
let audioContext = null;
let lastScratchAt = 0;
let scratchFields = [];
let confettiParticles = [];
let confettiAnimating = false;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    wordsText: wordsInput.value,
    mode: getMode(),
    shuffle: shuffleToggle.checked,
    images: gatherImageState(),
    yandexStyle: yandexStyleSelect?.value || 'illustration'
  }));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    wordsInput.value = demoWords.join('\n');
    buildImageRows([]);
    return;
  }
  try {
    const data = JSON.parse(raw);
    wordsInput.value = data.wordsText || demoWords.join('\n');
    if (data.mode) {
      const input = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (input) input.checked = true;
    }
    shuffleToggle.checked = data.shuffle ?? true;
    if (yandexStyleSelect) yandexStyleSelect.value = data.yandexStyle || 'illustration';
    refreshModeStyles();
    buildImageRows(data.images || []);
  } catch {
    wordsInput.value = demoWords.join('\n');
    buildImageRows([]);
  }
}

function refreshModeStyles() {
  document.querySelectorAll('.mode-option').forEach(el => {
    const input = el.querySelector('input');
    el.classList.toggle('selected', input.checked);
  });
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || 'word';
}

function parseWordsFromText(text) {
  return text.split(/\r?\n|,|;/).map(v => v.trim()).filter(Boolean);
}

function parseWords() {
  return parseWordsFromText(wordsInput.value);
}

function buildImageRows(existing = []) {
  const words = parseWords();
  if (!words.length) {
    imageRows.className = 'image-rows empty-state-box';
    imageRows.innerHTML = '<p>Add your words first, then click <strong>Refresh picture list</strong>.</p>';
    saveState();
    return;
  }
  const savedMap = new Map(existing.map(item => [item.word.toLowerCase(), item]));
  imageRows.className = 'image-rows';
  imageRows.innerHTML = '';

  words.forEach(word => {
    const row = document.createElement('div');
    row.className = 'image-row';
    row.dataset.word = word;

    const wordInput = document.createElement('input');
    wordInput.className = 'image-word-input';
    wordInput.value = word;
    wordInput.readOnly = true;

    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.textContent = 'No image';

    const urlInput = document.createElement('input');
    urlInput.className = 'image-url-input';
    urlInput.type = 'url';
    urlInput.placeholder = 'Image URL (optional)';

    const tools = document.createElement('div');
    tools.className = 'yandex-result-tools';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;

    const uploadBtn = makeButton('Upload', 'mini-btn');
    uploadBtn.addEventListener('click', () => fileInput.click());

    const urlBtn = makeButton('Use URL', 'mini-btn');
    urlBtn.addEventListener('click', () => {
      const src = urlInput.value.trim();
      if (src) setPreview(src);
    });

    const yandexBtn = makeButton('Find in Yandex', 'mini-btn yandex-btn');
    yandexBtn.addEventListener('click', () => openYandexImageSearch(word));

    const clearImageBtn = makeButton('Clear', 'mini-btn');
    clearImageBtn.addEventListener('click', () => {
      urlInput.value = '';
      setPreview('');
    });

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const src = await readFileAsDataUrl(file);
      setPreview(src);
    });

    function setPreview(src) {
      if (src) {
        preview.dataset.src = src;
        preview.innerHTML = `<img src="${src}" alt="${escapeHtml(word)}">`;
        if (/^https?:/i.test(src)) urlInput.value = src;
      } else {
        delete preview.dataset.src;
        preview.textContent = 'No image';
      }
      saveState();
    }

    row._setPreview = setPreview;

    const existingItem = savedMap.get(word.toLowerCase());
    if (existingItem?.imageSrc) setPreview(existingItem.imageSrc);

    tools.append(yandexBtn, uploadBtn, urlBtn, clearImageBtn, fileInput);
    row.append(wordInput, preview, urlInput, tools);
    imageRows.appendChild(row);
  });
  saveState();
}

function makeButton(text, classes) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = classes;
  b.textContent = text;
  return b;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function gatherImageState() {
  return Array.from(document.querySelectorAll('.image-row')).map(row => ({
    word: row.querySelector('.image-word-input')?.value?.trim() || '',
    imageSrc: row.querySelector('.image-preview')?.dataset?.src || ''
  }));
}

function buildCards() {
  const words = parseWords();
  const imageMap = new Map(gatherImageState().map(item => [item.word.toLowerCase(), item.imageSrc || '']));
  return words.map(word => ({ word, imageSrc: imageMap.get(word.toLowerCase()) || '' }));
}

function shuffled(arr) {
  const copy = arr.map(v => ({ ...v }));
  if (!shuffleToggle.checked) return copy;
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  mode = getMode();
  cards = buildCards();
  if (!cards.length) return alert('Add at least one word first.');
  if (mode !== 'word' && cards.some(card => !card.imageSrc)) return alert('Picture modes need a picture for every word.');
  deck = shuffled(cards);
  usedCount = 0;
  setupScreen.classList.remove('active');
  gameScreen.classList.add('active');
  loadNextCard();
  saveState();
}

function loadNextCard() {
  if (!deck.length) deck = shuffled(cards);
  current = deck.shift();
  usedCount = (usedCount % cards.length) + 1;
  progressTitle.textContent = `Ticket ${usedCount} / ${cards.length}`;
  renderCurrent();
  requestAnimationFrame(() => {
    prepareScratchSurface();
    fitWord();
  });
  revealedEnough = false;
  nextBtn.disabled = true;
}

function renderCurrent() {
  stage.className = `stage ${mode}-mode`;
  const hasPicture = mode !== 'word';
  picturePanel.classList.toggle('hidden', !hasPicture);
  showWordBtn.classList.toggle('hidden', mode !== 'picture');
  wordPanel.classList.remove('hidden');

  if (mode === 'word') {
    ticketContent.className = 'ticket-content word-layout';
    resultWord.textContent = current.word;
    resultWord.classList.remove('hidden');
  } else if (mode === 'picture-word') {
    ticketContent.className = 'ticket-content dual-layout';
    resultWord.textContent = current.word;
    resultWord.classList.remove('hidden');
    resultImage.src = current.imageSrc;
  } else {
    ticketContent.className = 'ticket-content dual-layout';
    resultWord.textContent = '';
    resultWord.classList.add('hidden');
    resultImage.src = current.imageSrc;
  }
}

async function fitWord() {
  await document.fonts?.ready;
  const text = (current?.word || '').trim();
  if (!text || resultWord.classList.contains('hidden')) return;

  const boxWidth = Math.max(80, wordPanel.clientWidth - 36);
  const boxHeight = Math.max(70, wordPanel.clientHeight - 28);
  const isShortSingle = mode === 'word' && !/\s/.test(text) && text.length <= 8;
  const oneLine = !/\s/.test(text) || text.length <= 15;

  resultWord.style.transform = 'scaleX(1)';
  resultWord.style.transformOrigin = 'center center';
  resultWord.style.whiteSpace = oneLine ? 'nowrap' : 'normal';
  resultWord.style.width = oneLine ? 'auto' : '100%';
  resultWord.style.maxWidth = '100%';
  resultWord.style.lineHeight = oneLine ? '.86' : '.94';

  let low = 20;
  let high = mode === 'word' ? 360 : 220;
  let best = low;

  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    resultWord.style.fontSize = `${mid}px`;
    const r = resultWord.getBoundingClientRect();
    if (r.width <= boxWidth * 0.98 && r.height <= boxHeight * 0.94) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  resultWord.style.fontSize = `${best}px`;

  if (isShortSingle) {
    const r = resultWord.getBoundingClientRect();
    if (r.width > 0) {
      const target = boxWidth * 0.96;
      const scaleX = Math.min(1.9, Math.max(1, target / r.width));
      resultWord.style.transform = `scaleX(${scaleX})`;
    }
  }
}

function prepareScratchSurface() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = scratchCanvas.getBoundingClientRect();
  scratchCanvas.width = rect.width * dpr;
  scratchCanvas.height = rect.height * dpr;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,rect.width,rect.height);
  scratchFields = [];

  if (mode === 'word') {
    addScratchField(wordPanel, 'word');
  } else if (mode === 'picture-word') {
    addScratchField(picturePanel, 'picture');
    addScratchField(wordPanel, 'word');
  } else {
    addScratchField(picturePanel, 'picture');
  }

  scratchCanvas.style.cursor = COIN_CURSOR;
}

function addScratchField(element, type) {
  const ticketRect = ticket.getBoundingClientRect();
  const elRect = element.getBoundingClientRect();
  const rect = {
    x: elRect.left - ticketRect.left,
    y: elRect.top - ticketRect.top,
    w: elRect.width,
    h: elRect.height
  };
  scratchFields.push({ type, rect, revealed: false });
  drawScratchField(rect);
}

function drawScratchField({x,y,w,h}) {
  const silver = ctx.createLinearGradient(x, y, x + w, y + h);
  silver.addColorStop(0, '#8f9bb2');
  silver.addColorStop(.12, '#f5f7fb');
  silver.addColorStop(.28, '#bac4d5');
  silver.addColorStop(.47, '#ffffff');
  silver.addColorStop(.65, '#c8d0dd');
  silver.addColorStop(.84, '#eef2f8');
  silver.addColorStop(1, '#8f9bb2');

  roundRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = silver;
  ctx.fill();

  ctx.save();
  roundRect(ctx, x, y, w, h, 24);
  ctx.clip();
  ctx.globalAlpha = .2;
  for (let i = 0; i < 28; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.5)' : 'rgba(85,98,120,.12)';
    ctx.fillRect(x - 20 + i * (w / 16), y, 12, h);
  }
  ctx.globalAlpha = .2;
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = i % 5 ? 'rgba(255,255,255,.45)' : 'rgba(90,102,122,.35)';
    ctx.beginPath();
    ctx.arc(x + Math.random() * w, y + Math.random() * h, Math.random() * 1.8 + .25, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(100,112,137,.48)';
  ctx.lineWidth = 2;
  roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 24);
  ctx.stroke();
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function scratchAt(ev) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  const activeField = scratchFields.find(f => pointInRect(x, y, f.rect) && !f.revealed);
  if (!activeField) return;

  const size = Math.max(48, rect.width * .033);
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(x, y, size * .22, x, y, size);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(.78, 'rgba(0,0,0,.92)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  playScratchSound();
}

function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function checkReveal() {
  if (revealedEnough) return;
  let changed = false;
  for (const field of scratchFields) {
    if (field.revealed) continue;
    const pct = fieldRevealPercent(field.rect);
    if (pct >= AUTO_REVEAL_THRESHOLD) {
      clearScratchField(field.rect);
      field.revealed = true;
      changed = true;
    }
  }
  if (changed && scratchFields.every(f => f.revealed)) celebrateReveal();
}

function fieldRevealPercent(r) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const data = ctx.getImageData(
    Math.max(0, Math.floor(r.x * dpr)),
    Math.max(0, Math.floor(r.y * dpr)),
    Math.max(1, Math.floor(r.w * dpr)),
    Math.max(1, Math.floor(r.h * dpr))
  ).data;
  let clear = 0;
  let total = 0;
  for (let i = 3; i < data.length; i += 48) {
    total++;
    if (data[i] < 30) clear++;
  }
  return total ? (clear / total) * 100 : 0;
}

function clearScratchField(r) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.clearRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6);
  ctx.restore();
}

function revealAll() {
  if (revealedEnough) return;
  scratchFields.forEach(field => {
    if (!field.revealed) clearScratchField(field.rect);
    field.revealed = true;
  });
  celebrateReveal();
}

function celebrateReveal() {
  if (revealedEnough) return;
  revealedEnough = true;
  if (mode === 'picture') {
    resultWord.textContent = current?.word || '';
    resultWord.classList.remove('hidden');
    showWordBtn.classList.add('hidden');
    fitWord();
  }
  nextBtn.disabled = false;
  fireConfetti();
  playFanfare();
}

function getAudio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

function playScratchSound() {
  const nowMs = performance.now();
  if (nowMs - lastScratchAt < 48) return;
  lastScratchAt = nowMs;
  const ac = getAudio();
  const now = ac.currentTime;

  const duration = 0.055;
  const bufferSize = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * decay * 0.42;
  }
  const noise = ac.createBufferSource();
  noise.buffer = buffer;
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1550 + Math.random() * 500;
  band.Q.value = 0.75;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  noise.connect(band).connect(gain).connect(ac.destination);
  noise.start(now);
  noise.stop(now + duration);

  const metal = ac.createOscillator();
  const mg = ac.createGain();
  metal.type = 'sine';
  metal.frequency.setValueAtTime(2400 + Math.random() * 350, now);
  mg.gain.setValueAtTime(0.009, now);
  mg.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  metal.connect(mg).connect(ac.destination);
  metal.start(now);
  metal.stop(now + 0.04);
}

function playFanfare() {
  const ac = getAudio();
  const now = ac.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.105);
    gain.gain.setValueAtTime(0.0001, now + i * 0.105);
    gain.gain.linearRampToValueAtTime(0.07, now + i * 0.105 + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.105 + 0.28);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + i * 0.105);
    osc.stop(now + i * 0.105 + 0.3);
  });
}

function fireConfetti() {
  confettiCanvas.classList.remove('hidden');
  const dpr = window.devicePixelRatio || 1;
  confettiCanvas.width = window.innerWidth * dpr;
  confettiCanvas.height = window.innerHeight * dpr;
  confettiCtx.setTransform(1,0,0,1,0,0);
  confettiCtx.scale(dpr, dpr);
  confettiParticles = Array.from({ length: 160 }, () => ({
    x: window.innerWidth / 2 + (Math.random() * 220 - 110),
    y: window.innerHeight * 0.24 + (Math.random() * 20 - 10),
    vx: Math.random() * 8 - 4,
    vy: Math.random() * -8.5 - 2,
    size: Math.random() * 8 + 5,
    rot: Math.random() * Math.PI,
    vr: Math.random() * 0.3 - 0.15,
    color: ['#6f56f8','#04b7ff','#ffd764','#ff7f7f','#7af0b0'][Math.floor(Math.random()*5)],
    life: 84 + Math.random() * 24,
  }));
  if (!confettiAnimating) animateConfetti();
}

function animateConfetti() {
  confettiAnimating = true;
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.16;
    p.rot += p.vr;
    p.life -= 1;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.64);
    confettiCtx.restore();
  });
  confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < window.innerHeight + 30);
  if (confettiParticles.length) requestAnimationFrame(animateConfetti);
  else {
    confettiAnimating = false;
    confettiCanvas.classList.add('hidden');
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function buildYandexQuery(word) {
  const style = yandexStyleSelect?.value || 'illustration';
  if (style === 'photo') return `${word} photo`;
  if (style === 'illustration') return `${word} illustration`;
  return word;
}

function openYandexImageSearch(word) {
  const query = buildYandexQuery(word);
  const url = `https://yandex.ru/images/search?text=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function importWordsFile(file) {
  file.text().then(text => {
    const words = parseWordsFromText(text);
    if (!words.length) return alert('Could not find words in this file.');
    wordsInput.value = words.join('\n');
    buildImageRows(gatherImageState());
    saveState();
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function exitToSettings() {
  gameScreen.classList.remove('active');
  setupScreen.classList.add('active');
  saveState();
}

function restartDeck() {
  deck = shuffled(cards);
  usedCount = 0;
  loadNextCard();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

fillDemoBtn.addEventListener('click', () => {
  wordsInput.value = demoWords.join('\n');
  buildImageRows(gatherImageState());
  saveState();
});
importWordsInput.addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (file) importWordsFile(file);
});
buildImageRowsBtn.addEventListener('click', () => buildImageRows(gatherImageState()));
startBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', exitToSettings);
restartBtn.addEventListener('click', restartDeck);
clearBtn.addEventListener('click', revealAll);
nextBtn.addEventListener('click', loadNextCard);
fullscreenBtn.addEventListener('click', toggleFullscreen);
showWordBtn.addEventListener('click', () => {
  resultWord.textContent = current?.word || '';
  resultWord.classList.remove('hidden');
  showWordBtn.classList.add('hidden');
  fitWord();
});
wordsInput.addEventListener('input', saveState);
shuffleToggle.addEventListener('change', saveState);
modeInputs.forEach(input => input.addEventListener('change', () => { refreshModeStyles(); saveState(); }));
yandexStyleSelect?.addEventListener('change', saveState);
window.addEventListener('resize', () => { if (gameScreen.classList.contains('active')) { prepareScratchSurface(); fitWord(); } });

let isDown = false;
scratchCanvas.addEventListener('pointerdown', e => { isDown = true; scratchAt(e); checkReveal(); });
scratchCanvas.addEventListener('pointermove', e => { if (!isDown) return; scratchAt(e); checkReveal(); });
window.addEventListener('pointerup', () => { isDown = false; });
scratchCanvas.addEventListener('pointerleave', () => { isDown = false; });

loadState();
refreshModeStyles();
if (!document.querySelector('.image-row')) buildImageRows(gatherImageState());
