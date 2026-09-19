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
const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));
const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });

const STORAGE_KEY = 'scratch_speak_lottery_v1';
const demoWords = ['dog', 'apple', 'holiday', 'music', 'teacher', 'banana'];
const COIN_CURSOR = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='78' height='78' viewBox='0 0 78 78'><defs><radialGradient id='g' cx='35%' cy='35%'><stop offset='0' stop-color='#fff7bf'/><stop offset='0.55' stop-color='#ffd24d'/><stop offset='1' stop-color='#ca9418'/></radialGradient></defs><circle cx='39' cy='39' r='28' fill='url(#g)' stroke='#a36c00' stroke-width='4'/><circle cx='39' cy='39' r='22' fill='none' stroke='rgba(255,255,255,.45)' stroke-width='2'/><text x='39' y='48' text-anchor='middle' font-size='26' font-family='Arial' font-weight='700' fill='#8f5a00'>₵</text></svg>`)}") 24 24, auto`;

let cards = [];
let deck = [];
let current = null;
let usedCount = 0;
let revealedEnough = false;
let mode = 'word';
let pointerDown = false;
let audioContext = null;
let lastScratchAt = 0;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    wordsText: wordsInput.value,
    mode: getMode(),
    shuffle: shuffleToggle.checked,
    images: gatherImageState()
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
  return text
    .split(/\r?\n|,|;/)
    .map(v => v.trim())
    .filter(Boolean);
}

function parseWords() {
  return parseWordsFromText(wordsInput.value);
}

function buildImageRows(existing = []) {
  const words = parseWords();
  if (!words.length) {
    imageRows.className = 'image-rows empty-state-box';
    imageRows.innerHTML = '<p>Add your words first, then click <strong>Refresh picture list</strong>.</p>';
    return saveState();
  }
  const savedMap = new Map(existing.map(item => [item.word.toLowerCase(), item]));
  imageRows.className = 'image-rows';
  imageRows.innerHTML = '';

  words.forEach(word => {
    const row = document.createElement('div');
    row.className = 'image-row';

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
    tools.style.display = 'flex';
    tools.style.gap = '8px';
    tools.style.flexWrap = 'wrap';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'mini-btn';
    uploadBtn.textContent = 'Upload';
    uploadBtn.addEventListener('click', () => fileInput.click());

    const urlBtn = document.createElement('button');
    urlBtn.type = 'button';
    urlBtn.className = 'mini-btn';
    urlBtn.textContent = 'Use URL';
    urlBtn.addEventListener('click', () => {
      const src = urlInput.value.trim();
      if (src) setPreview(src);
    });

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'mini-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
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
        preview.innerHTML = `<img src="${src}" alt="${word}">`;
      } else {
        delete preview.dataset.src;
        preview.textContent = 'No image';
      }
      saveState();
    }

    const existingItem = savedMap.get(word.toLowerCase());
    if (existingItem?.imageSrc) {
      setPreview(existingItem.imageSrc);
      if (/^https?:/i.test(existingItem.imageSrc)) urlInput.value = existingItem.imageSrc;
    }

    tools.append(uploadBtn, urlBtn, clearBtn, fileInput);
    row.append(wordInput, preview, urlInput, tools);
    imageRows.appendChild(row);
  });
  saveState();
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
  prepareScratchSurface();
  revealedEnough = false;
  nextBtn.disabled = true;
}

function renderCurrent() {
  stage.className = `stage ${mode}-mode`;
  const hasPicture = mode !== 'word';
  picturePanel.classList.toggle('hidden', !hasPicture);
  showWordBtn.classList.toggle('hidden', mode !== 'picture');

  if (mode === 'word') {
    ticket.classList.add('single-field');
    ticketContent.className = 'ticket-content word-layout';
    resultWord.textContent = current.word;
    resultWord.classList.remove('hidden');
  } else if (mode === 'picture-word') {
    ticket.classList.remove('single-field');
    ticketContent.className = 'ticket-content dual-layout';
    resultWord.textContent = current.word;
    resultWord.classList.remove('hidden');
    resultImage.src = current.imageSrc;
  } else {
    ticket.classList.remove('single-field');
    ticketContent.className = 'ticket-content dual-layout';
    resultWord.textContent = '';
    resultWord.classList.add('hidden');
    resultImage.src = current.imageSrc;
  }
  fitWord();
}

function fitWord() {
  const text = (current?.word || '').trim();
  if (!text || resultWord.classList.contains('hidden')) return;
  const len = text.length;
  let size = 'clamp(4.8rem, 10vw, 8rem)';
  if (mode === 'word') {
    size = 'clamp(5.4rem, 12vw, 8.8rem)';
    if (len > 10) size = 'clamp(4.9rem, 10vw, 7.8rem)';
    if (len > 18) size = 'clamp(4rem, 8vw, 6.8rem)';
    if (len > 28) size = 'clamp(3rem, 6.2vw, 5.4rem)';
  } else {
    size = 'clamp(3.4rem, 5.5vw, 5.4rem)';
    if (len > 14) size = 'clamp(3rem, 4.8vw, 4.6rem)';
    if (len > 24) size = 'clamp(2.3rem, 3.8vw, 3.8rem)';
  }
  resultWord.style.fontSize = size;
}

function prepareScratchSurface() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = scratchCanvas.getBoundingClientRect();
  scratchCanvas.width = rect.width * dpr;
  scratchCanvas.height = rect.height * dpr;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0,0,rect.width,rect.height);
  ctx.save();
  roundRect(ctx, 0, 0, rect.width, rect.height, 30);
  ctx.clip();

  // Leave outer ticket visible. Draw realistic scratch areas only.
  if (mode === 'word') {
    drawScratchField({ x: 26, y: 70, w: rect.width - 52, h: rect.height - 128 });
  } else {
    const innerX = 24;
    const innerY = 72;
    const innerW = rect.width - 48;
    const innerH = rect.height - 128;
    const gap = 18;
    const picW = innerW * 0.43;
    const wordW = innerW - picW - gap;
    drawScratchField({ x: innerX, y: innerY, w: picW, h: innerH });
    drawScratchField({ x: innerX + picW + gap, y: innerY, w: wordW, h: innerH });
  }
  ctx.restore();
  scratchCanvas.style.cursor = COIN_CURSOR;
}

function drawScratchField({x,y,w,h}) {
  const silver = ctx.createLinearGradient(x, y, x + w, y + h);
  silver.addColorStop(0, '#a5afc4');
  silver.addColorStop(.18, '#eef2fa');
  silver.addColorStop(.42, '#c9d0dd');
  silver.addColorStop(.62, '#f8fbff');
  silver.addColorStop(1, '#9ba7bc');

  roundRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = silver;
  ctx.fill();

  ctx.save();
  roundRect(ctx, x, y, w, h, 24);
  ctx.clip();
  ctx.globalAlpha = .28;
  for (let i = 0; i < 22; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.38)' : 'rgba(255,255,255,.12)';
    ctx.fillRect(x - 20 + i * (w / 12), y, 18, h);
  }
  ctx.globalAlpha = .14;
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = i % 4 ? 'rgba(255,255,255,.35)' : 'rgba(120,128,145,.28)';
    ctx.beginPath();
    ctx.arc(x + Math.random() * w, y + Math.random() * h, Math.random() * 2 + .3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(120,132,159,.45)';
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
  const size = Math.max(46, rect.width * .03);
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(x, y, size * .22, x, y, size);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  maybePlayScratchSound();
}

function maybePlayScratchSound() {
  const now = performance.now();
  if (now - lastScratchAt < 60) return;
  lastScratchAt = now;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(210 + Math.random() * 70, audioContext.currentTime);
  gain.gain.setValueAtTime(0.015, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + .08);
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + .08);
}

function getRevealedPercent() {
  const data = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clearPixels = 0;
  let total = 0;
  for (let i = 3; i < data.length; i += 24) {
    total++;
    if (data[i] < 30) clearPixels++;
  }
  return (clearPixels / total) * 100;
}

function checkReveal() {
  if (revealedEnough) return;
  const percent = getRevealedPercent();
  if (percent >= 34) {
    revealedEnough = true;
    nextBtn.disabled = false;
  }
}

function revealAll() {
  const rect = scratchCanvas.getBoundingClientRect();
  ctx.clearRect(0,0,rect.width,rect.height);
  revealedEnough = true;
  nextBtn.disabled = false;
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
window.addEventListener('resize', () => { if (gameScreen.classList.contains('active')) prepareScratchSurface(); fitWord(); });

let isDown = false;
scratchCanvas.addEventListener('pointerdown', e => { isDown = true; scratchAt(e); checkReveal(); });
scratchCanvas.addEventListener('pointermove', e => { if (!isDown) return; scratchAt(e); checkReveal(); });
window.addEventListener('pointerup', () => { isDown = false; });
scratchCanvas.addEventListener('pointerleave', () => { isDown = false; });

loadState();
refreshModeStyles();
if (!document.querySelector('.image-row')) buildImageRows(gatherImageState());
