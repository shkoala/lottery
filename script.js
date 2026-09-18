const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const wordsInput = document.getElementById('wordsInput');
const imageRows = document.getElementById('imageRows');
const startBtn = document.getElementById('startBtn');
const fillDemoBtn = document.getElementById('fillDemoBtn');
const buildImageRowsBtn = document.getElementById('buildImageRowsBtn');
const clearBtn = document.getElementById('clearBtn');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const showWordBtn = document.getElementById('showWordBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progressTitle = document.getElementById('progressTitle');
const resultCard = document.getElementById('resultCard');
const resultWord = document.getElementById('resultWord');
const imageWrap = document.getElementById('imageWrap');
const resultImage = document.getElementById('resultImage');
const scratchCanvas = document.getElementById('scratchCanvas');
const scratchStage = document.getElementById('scratchStage');
const shuffleToggle = document.getElementById('shuffleToggle');
const themeButtons = Array.from(document.querySelectorAll('.theme-option'));
const body = document.body;
const themeBadge = document.getElementById('themeBadge');
const toolBadge = document.getElementById('toolBadge');
const teacherModeToggle = document.getElementById('teacherModeToggle');
const promptChecks = Array.from(document.querySelectorAll('#promptChecks input[type="checkbox"]'));
const teacherPrompt = document.getElementById('teacherPrompt');
const timerSelect = document.getElementById('timerSelect');
const timerBadge = document.getElementById('timerBadge');
const soundToggle = document.getElementById('soundToggle');
const confettiToggle = document.getElementById('confettiToggle');
const exportSetBtn = document.getElementById('exportSetBtn');
const importSetInput = document.getElementById('importSetInput');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');

const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });
const STORAGE_KEY = 'scratch_speak_state_v5';
const demoWords = ['cat', 'dog', 'apple', 'school', 'travel', 'guitar'];

const THEMES = {
  lottery: {
    badge: 'Lucky Ticket',
    tool: 'Coin scratch',
    overlayTitle: 'SCRATCH TO WIN',
    overlaySubtitle: 'Scratch the silver ticket',
    colors: ['#c2cad8','#eef3f9','#aab4c8'],
    cursor: svgCursor(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><radialGradient id="g" cx="35%" cy="35%"><stop offset="0" stop-color="#fff7bf"/><stop offset="0.55" stop-color="#ffd24d"/><stop offset="1" stop-color="#ca9418"/></radialGradient></defs><circle cx="32" cy="32" r="22" fill="url(#g)" stroke="#a36c00" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-size="22" font-family="Arial" font-weight="700" fill="#8f5a00">₵</text></svg>`, 18, 18),
    brushSize: 44,
    threshold: 63,
    texture: drawLotteryTexture,
  },
  school: {
    badge: 'Notebook Reveal',
    tool: 'Pencil scrub',
    overlayTitle: 'ERASE THE SCRIBBLES',
    overlaySubtitle: 'Pencil scratches clear the black layer',
    colors: ['#1b1b1b','#2c2c2c','#111'],
    cursor: svgCursor(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g transform="rotate(-28 36 36)"><rect x="19" y="11" width="18" height="40" rx="3" fill="#ffd74f"/><rect x="19" y="11" width="18" height="8" fill="#ffc236"/><rect x="19" y="43" width="18" height="8" fill="#ff8fb1"/><polygon points="19,11 28,2 37,11" fill="#d8b28d"/><polygon points="24,7 28,2 32,7" fill="#1d1d1d"/></g></svg>`, 12, 12),
    brushSize: 28,
    threshold: 68,
    texture: drawSchoolTexture,
  },
  oldhouse: {
    badge: 'Dusty Cabinet',
    tool: 'Cloth wipe',
    overlayTitle: 'WIPE THE DUST',
    overlaySubtitle: 'Clean the surface to find the word',
    colors: ['#cdb9a8','#e9ddcf','#b99c88'],
    cursor: svgCursor(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><path d="M13 34c8-13 30-17 45-8 2 1 4 3 5 5-3 11-11 20-22 25-10 4-19 2-26-5-2-2-3-5-2-8 0-3 0-6 0-9z" fill="#d8ecea" stroke="#8ab7b3" stroke-width="3"/><path d="M18 39c11 2 24-3 33-12" stroke="#9cc8c4" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`, 16, 16),
    brushSize: 54,
    threshold: 62,
    texture: drawDustTexture,
  },
  treasure: {
    badge: 'Treasure Map',
    tool: 'Brush away sand',
    overlayTitle: 'BRUSH THE SAND',
    overlaySubtitle: 'Clear the map to uncover the clue',
    colors: ['#cfa95b','#efdca6','#ba9045'],
    cursor: svgCursor(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect x="35" y="14" width="11" height="34" rx="5" fill="#8f5d2d" transform="rotate(18 40.5 31)"/><path d="M16 48c10-9 26-13 40-10-2 7-9 12-18 15-10 3-18 2-22-5z" fill="#f2cf6f" stroke="#bd9537" stroke-width="3"/><path d="M22 47c8 1 16-2 24-7" stroke="#d8ae4f" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`, 14, 18),
    brushSize: 48,
    threshold: 64,
    texture: drawSandTexture,
  }
};

let cards = [];
let deck = [];
let currentCard = null;
let usedCount = 0;
let revealedEnough = false;
let mode = 'word';
let pointerDown = false;
let timerInterval = null;
let timeLeft = 0;
let audioContext = null;
let lastScratchAt = 0;
let confettiParticles = [];
let confettiAnimating = false;
let currentRevealThreshold = 64;

function svgCursor(svg, x, y) {
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${x} ${y}, auto`;
}

function saveState() {
  const data = {
    wordsText: wordsInput.value,
    mode: getSelectedMode(),
    shuffle: shuffleToggle.checked,
    theme: body.dataset.theme || 'lottery',
    images: gatherImageState(),
    teacherMode: teacherModeToggle.checked,
    prompts: promptChecks.filter(c => c.checked).map(c => c.value),
    timer: timerSelect.value,
    sound: soundToggle.checked,
    confetti: confettiToggle.checked,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    wordsInput.value = demoWords.join('\n');
    setTheme('lottery');
    return;
  }
  try {
    const data = JSON.parse(raw);
    wordsInput.value = data.wordsText || demoWords.join('\n');
    if (data.mode) {
      const radio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (radio) radio.checked = true;
    }
    shuffleToggle.checked = data.shuffle ?? true;
    teacherModeToggle.checked = data.teacherMode ?? true;
    timerSelect.value = String(data.timer ?? '30');
    soundToggle.checked = data.sound ?? true;
    confettiToggle.checked = data.confetti ?? true;
    if (Array.isArray(data.prompts) && data.prompts.length) {
      promptChecks.forEach(c => c.checked = data.prompts.includes(c.value));
    }
    refreshModeStyles();
    setTheme(data.theme || 'lottery');
    buildImageRows(data.images || []);
  } catch {
    wordsInput.value = demoWords.join('\n');
    setTheme('lottery');
  }
}

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || 'word';
}

function parseWords() {
  return wordsInput.value.split('\n').map(v => v.trim()).filter(Boolean);
}

function refreshModeStyles() {
  document.querySelectorAll('.mode-option').forEach(label => {
    const input = label.querySelector('input');
    label.classList.toggle('selected', input.checked);
  });
}

function setTheme(theme) {
  body.dataset.theme = theme;
  themeButtons.forEach(btn => btn.classList.toggle('selected', btn.dataset.theme === theme));
  scratchStage.className = `scratch-stage theme-${theme}`;
  themeBadge.textContent = THEMES[theme].badge;
  toolBadge.textContent = THEMES[theme].tool;
  scratchCanvas.style.cursor = THEMES[theme].cursor;
  currentRevealThreshold = THEMES[theme].threshold;
  syncModeClass();
}

function syncModeClass() {
  scratchStage.classList.toggle('picture-on', mode !== 'word');
}

function buildImageRows(existing = []) {
  const words = parseWords();
  if (!words.length) {
    imageRows.className = 'image-rows empty-state-box';
    imageRows.innerHTML = '<p>Add your words first, then click <strong>Refresh image list</strong>.</p>';
    saveState();
    return;
  }

  const savedMap = new Map(existing.map(item => [item.word.toLowerCase(), item]));
  imageRows.className = 'image-rows';
  imageRows.innerHTML = '';

  words.forEach((word) => {
    const row = document.createElement('div');
    row.className = 'image-row';

    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.value = word;
    wordInput.className = 'image-word-input';
    wordInput.readOnly = true;

    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.textContent = 'No image';

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'Image URL (optional)';
    urlInput.className = 'image-url-input';

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

    const applyUrlBtn = document.createElement('button');
    applyUrlBtn.type = 'button';
    applyUrlBtn.className = 'mini-btn';
    applyUrlBtn.textContent = 'Use URL';

    const clearImgBtn = document.createElement('button');
    clearImgBtn.type = 'button';
    clearImgBtn.className = 'mini-btn';
    clearImgBtn.textContent = 'Clear';

    function setPreview(src) {
      if (src) {
        preview.innerHTML = `<img src="${src}" alt="${word}">`;
        preview.dataset.src = src;
      } else {
        preview.innerHTML = 'No image';
        delete preview.dataset.src;
      }
      saveState();
    }

    applyUrlBtn.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (!val) return;
      setPreview(val);
    });
    clearImgBtn.addEventListener('click', () => {
      urlInput.value = '';
      setPreview('');
    });
    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const dataUrl = await readFileAsDataUrl(file);
      urlInput.value = '';
      setPreview(dataUrl);
    });

    const existingItem = savedMap.get(word.toLowerCase());
    if (existingItem?.imageSrc) {
      setPreview(existingItem.imageSrc);
      if (/^https?:/i.test(existingItem.imageSrc)) urlInput.value = existingItem.imageSrc;
    }

    tools.append(uploadBtn, applyUrlBtn, clearImgBtn, fileInput);
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
  if (!words.length) return [];
  const imageMap = new Map(gatherImageState().map(item => [item.word.toLowerCase(), item.imageSrc || '']));
  return words.map(word => ({ word, imageSrc: imageMap.get(word.toLowerCase()) || '' }));
}

function createDeck(sourceCards) {
  const cloned = sourceCards.map(card => ({ ...card }));
  if (!shuffleToggle.checked) return cloned;
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function ensureImagesForCurrentMode(sourceCards, selectedMode) {
  if (selectedMode === 'word') return true;
  return sourceCards.every(card => !!card.imageSrc);
}

function startGame() {
  cards = buildCards();
  mode = getSelectedMode();
  syncModeClass();
  if (!cards.length) return alert('Add at least one word first.');
  if (!ensureImagesForCurrentMode(cards, mode)) return alert('Picture modes need an image for every word.');
  deck = createDeck(cards);
  usedCount = 0;
  setupScreen.classList.remove('active');
  gameScreen.classList.add('active');
  loadNextCard(true);
  saveState();
}

function loadNextCard(isFirst = false) {
  if (!deck.length) deck = createDeck(cards);
  currentCard = deck.shift();
  usedCount = (usedCount % cards.length) + 1;
  progressTitle.textContent = `Card ${usedCount} / ${cards.length}`;
  resultCard.classList.remove('revealed');
  renderCard(currentCard);
  prepareScratchSurface();
  nextBtn.disabled = true;
  revealedEnough = false;
  setTeacherPrompt();
  startTimer();
  if (!isFirst) saveState();
}

function renderCard(card) {
  const hasImage = mode !== 'word';
  syncModeClass();
  if (hasImage) {
    imageWrap.classList.remove('hidden');
    resultImage.src = card.imageSrc;
    resultImage.alt = card.word;
  } else {
    imageWrap.classList.add('hidden');
    resultImage.removeAttribute('src');
  }
  if (mode === 'picture') {
    resultWord.textContent = '';
    resultWord.classList.add('hidden');
    showWordBtn.classList.remove('hidden');
  } else {
    resultWord.textContent = card.word;
    resultWord.classList.remove('hidden');
    showWordBtn.classList.add('hidden');
  }
  fitWord();
}

function fitWord() {
  const text = (currentCard?.word || '').trim();
  if (!text || resultWord.classList.contains('hidden')) return;
  const len = text.length;
  let size = 'clamp(5rem, 12vw, 10.4rem)';
  if (len > 10) size = 'clamp(4.4rem, 10vw, 8.8rem)';
  if (len > 18) size = 'clamp(3.8rem, 8.3vw, 7rem)';
  if (len > 28) size = 'clamp(3rem, 6.5vw, 5.6rem)';
  if (mode !== 'word') {
    if (len <= 12) size = 'clamp(3.3rem, 6.8vw, 5.8rem)';
    else if (len > 20) size = 'clamp(2.5rem, 5.4vw, 4.4rem)';
  }
  resultWord.style.fontSize = size;
}

function prepareScratchSurface() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = scratchCanvas.getBoundingClientRect();
  scratchCanvas.width = rect.width * dpr;
  scratchCanvas.height = rect.height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const theme = THEMES[body.dataset.theme];

  ctx.clearRect(0, 0, w, h);
  ctx.save();
  drawRoundedRect(ctx, 0, 0, w, h, 42);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, 0, w, h);
  theme.colors.forEach((c, i) => bg.addColorStop(i / (theme.colors.length - 1), c));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  theme.texture(w, h);

  ctx.fillStyle = body.dataset.theme === 'school' ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.92)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${Math.max(34, w * 0.052)}px "Baloo 2", sans-serif`;
  ctx.fillText(theme.overlayTitle, w / 2, h / 2 - 12);
  ctx.font = `700 ${Math.max(16, w * 0.022)}px Inter, sans-serif`;
  ctx.fillText(theme.overlaySubtitle, w / 2, h / 2 + Math.max(42, w * 0.05));

  ctx.restore();
}

function drawRoundedRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function drawLotteryTexture(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.24;
  for (let i = 0; i < 24; i++) {
    const y = i * (h / 24);
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.08)';
    ctx.fillRect(0, y, w, 14);
  }
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = 'rgba(255,255,255,.42)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.setLineDash([]);
  ctx.restore();
}

function drawSchoolTexture(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.94;
  for (let y = 30; y < h; y += 28) {
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,.16)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, h);
  ctx.stroke();
  ctx.globalAlpha = 0.42;
  for (let i = 0; i < 56; i++) {
    ctx.strokeStyle = 'rgba(255,255,255,.11)';
    ctx.lineWidth = 3 + Math.random() * 5;
    ctx.beginPath();
    const sx = Math.random() * w;
    const sy = Math.random() * h;
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 26 + Math.random() * 100, sy + (Math.random() * 42 - 21));
    ctx.stroke();
  }
  ctx.restore();
}

function drawDustTexture(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.36;
  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.52)' : 'rgba(255,245,230,.4)';
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.3 + 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSandTexture(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.32;
  for (let i = 0; i < 780; i++) {
    ctx.fillStyle = i % 5 === 0 ? 'rgba(255,247,199,.44)' : 'rgba(145,104,23,.18)';
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.1 + 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function getCanvasPos(event) {
  const rect = scratchCanvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function scratchAt(event) {
  const { x, y } = getCanvasPos(event);
  const theme = THEMES[body.dataset.theme];
  const size = Math.max(theme.brushSize, scratchCanvas.getBoundingClientRect().width * 0.03);
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(x, y, size * 0.25, x, y, size);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  maybePlayScratchSound();
}

function handleScratchProgress() {
  if (revealedEnough) return;
  const percent = getRevealedPercent();
  if (percent >= currentRevealThreshold) {
    markRevealed();
  }
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

function markRevealed() {
  if (revealedEnough) return;
  revealedEnough = true;
  nextBtn.disabled = false;
  resultCard.classList.add('revealed');
  if (confettiToggle.checked) fireConfetti();
}

function revealAll() {
  const rect = scratchCanvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  markRevealed();
}

function setTeacherPrompt() {
  const selected = promptChecks.filter(c => c.checked).map(c => c.value);
  if (!teacherModeToggle.checked || !selected.length) {
    teacherPrompt.classList.add('hidden');
    teacherPrompt.textContent = '';
    return;
  }
  teacherPrompt.classList.remove('hidden');
  teacherPrompt.textContent = selected[Math.floor(Math.random() * selected.length)];
}

function startTimer() {
  clearInterval(timerInterval);
  const seconds = Number(timerSelect.value || 0);
  if (!seconds) {
    timerBadge.classList.add('hidden');
    return;
  }
  timeLeft = seconds;
  timerBadge.classList.remove('hidden');
  updateTimerBadge();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerBadge();
    if (timeLeft <= 0) clearInterval(timerInterval);
  }, 1000);
}

function updateTimerBadge() {
  timerBadge.textContent = `${timeLeft}s`;
  timerBadge.classList.toggle('danger', timeLeft <= 5);
}

function maybePlayScratchSound() {
  if (!soundToggle.checked) return;
  const now = performance.now();
  if (now - lastScratchAt < 60) return;
  lastScratchAt = now;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220 + Math.random() * 70, audioContext.currentTime);
  gain.gain.setValueAtTime(0.016, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}

function fireConfetti() {
  confettiCanvas.classList.remove('hidden');
  confettiCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
  confettiCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
  confettiCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  confettiParticles = Array.from({ length: 120 }, () => ({
    x: window.innerWidth / 2 + (Math.random() * 180 - 90),
    y: window.innerHeight * 0.18 + (Math.random() * 20 - 10),
    vx: Math.random() * 8 - 4,
    vy: Math.random() * -7 - 2,
    size: Math.random() * 8 + 4,
    rot: Math.random() * Math.PI,
    vr: Math.random() * 0.28 - 0.14,
    color: ['#6d5efc', '#00b7ff', '#ffd95e', '#ff7d7d', '#84f3c9'][Math.floor(Math.random() * 5)],
    life: 80 + Math.random() * 20
  }));
  if (!confettiAnimating) animateConfetti();
}

function animateConfetti() {
  confettiAnimating = true;
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.14;
    p.rot += p.vr;
    p.life -= 1;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
    confettiCtx.restore();
  });
  confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < window.innerHeight + 40);
  if (confettiParticles.length) requestAnimationFrame(animateConfetti);
  else {
    confettiAnimating = false;
    confettiCanvas.classList.add('hidden');
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function exportSet() {
  const payload = {
    wordsText: wordsInput.value,
    images: gatherImageState(),
    mode: getSelectedMode(),
    shuffle: shuffleToggle.checked,
    theme: body.dataset.theme,
    teacherMode: teacherModeToggle.checked,
    prompts: promptChecks.filter(c => c.checked).map(c => c.value),
    timer: timerSelect.value,
    sound: soundToggle.checked,
    confetti: confettiToggle.checked
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scratch-speak-set.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function importSet(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  wordsInput.value = data.wordsText || '';
  if (data.mode) {
    const radio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
    if (radio) radio.checked = true;
  }
  shuffleToggle.checked = data.shuffle ?? true;
  teacherModeToggle.checked = data.teacherMode ?? true;
  timerSelect.value = String(data.timer ?? '30');
  soundToggle.checked = data.sound ?? true;
  confettiToggle.checked = data.confetti ?? true;
  if (Array.isArray(data.prompts)) promptChecks.forEach(c => c.checked = data.prompts.includes(c.value));
  refreshModeStyles();
  mode = getSelectedMode();
  setTheme(data.theme || 'lottery');
  buildImageRows(data.images || []);
  saveState();
}

function exitToSetup() {
  clearInterval(timerInterval);
  gameScreen.classList.remove('active');
  setupScreen.classList.add('active');
  saveState();
}

function restartDeck() {
  if (!cards.length) return;
  deck = createDeck(cards);
  usedCount = 0;
  loadNextCard(true);
}

function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
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
buildImageRowsBtn.addEventListener('click', () => buildImageRows(gatherImageState()));
startBtn.addEventListener('click', startGame);
clearBtn.addEventListener('click', revealAll);
nextBtn.addEventListener('click', () => loadNextCard());
backBtn.addEventListener('click', exitToSetup);
restartBtn.addEventListener('click', restartDeck);
showWordBtn.addEventListener('click', () => {
  resultWord.textContent = currentCard?.word || '';
  resultWord.classList.remove('hidden');
  showWordBtn.classList.add('hidden');
  fitWord();
});
fullscreenBtn.addEventListener('click', toggleFullScreen);
exportSetBtn.addEventListener('click', exportSet);
importSetInput.addEventListener('change', (e) => { const f = e.target.files?.[0]; if (f) importSet(f); });

wordsInput.addEventListener('input', saveState);
shuffleToggle.addEventListener('change', saveState);
teacherModeToggle.addEventListener('change', saveState);
promptChecks.forEach(c => c.addEventListener('change', saveState));
timerSelect.addEventListener('change', saveState);
soundToggle.addEventListener('change', saveState);
confettiToggle.addEventListener('change', saveState);
document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener('change', () => { mode = getSelectedMode(); refreshModeStyles(); syncModeClass(); saveState(); }));
themeButtons.forEach(btn => btn.addEventListener('click', () => { setTheme(btn.dataset.theme); saveState(); if (gameScreen.classList.contains('active')) prepareScratchSurface(); }));
window.addEventListener('resize', () => { if (gameScreen.classList.contains('active')) prepareScratchSurface(); });

scratchCanvas.addEventListener('pointerdown', (event) => { pointerDown = true; scratchAt(event); handleScratchProgress(); });
scratchCanvas.addEventListener('pointermove', (event) => { if (!pointerDown) return; scratchAt(event); handleScratchProgress(); });
window.addEventListener('pointerup', () => { pointerDown = false; });
scratchCanvas.addEventListener('pointerleave', () => { pointerDown = false; });

loadState();
mode = getSelectedMode();
refreshModeStyles();
syncModeClass();
if (!document.querySelector('.image-row')) buildImageRows(gatherImageState());
