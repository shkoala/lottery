const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const wordsInput = document.getElementById('wordsInput');
const tableInput = document.getElementById('tableInput');
const imageRows = document.getElementById('imageRows');
const startBtn = document.getElementById('startBtn');
const fillDemoBtn = document.getElementById('fillDemoBtn');
const buildImageRowsBtn = document.getElementById('buildImageRowsBtn');
const importTableBtn = document.getElementById('importTableBtn');
const csvFileInput = document.getElementById('csvFileInput');
const clearBtn = document.getElementById('clearBtn');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const showWordBtn = document.getElementById('showWordBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progressTitle = document.getElementById('progressTitle');
const resultWord = document.getElementById('resultWord');
const imageWrap = document.getElementById('imageWrap');
const resultImage = document.getElementById('resultImage');
const scratchCanvas = document.getElementById('scratchCanvas');
const shuffleToggle = document.getElementById('shuffleToggle');
const themeButtons = Array.from(document.querySelectorAll('.theme-chip'));
const body = document.body;
const teacherModeToggle = document.getElementById('teacherModeToggle');
const teacherTaskOptions = document.getElementById('teacherTaskOptions');
const timerSelect = document.getElementById('timerSelect');
const soundToggle = document.getElementById('soundToggle');
const confettiToggle = document.getElementById('confettiToggle');
const teacherTask = document.getElementById('teacherTask');
const timerPill = document.getElementById('timerPill');
const exportSetBtn = document.getElementById('exportSetBtn');
const importSetInput = document.getElementById('importSetInput');
const setNameInput = document.getElementById('setNameInput');

const ctx = scratchCanvas.getContext('2d', { willReadFrequently: true });
let cards = [];
let deck = [];
let currentCard = null;
let usedCount = 0;
let scratchReady = false;
let pointerDown = false;
let revealedEnough = false;
let mode = 'word';
let timerId = null;
let timerRemaining = 0;
let audioCtx = null;
let lastScratchSoundAt = 0;
let confettiFired = false;

const STORAGE_KEY = 'scratch_speak_state_v2';
const demoWords = [
  { word: 'cat', imageSrc: '' },
  { word: 'dog', imageSrc: '' },
  { word: 'apple', imageSrc: '' },
  { word: 'school', imageSrc: '' },
  { word: 'travel', imageSrc: '' },
  { word: 'teacher', imageSrc: '' },
  { word: 'summer holiday', imageSrc: '' },
  { word: 'guitar', imageSrc: '' },
];

function saveState() {
  const data = {
    wordsText: wordsInput.value,
    tableText: tableInput.value,
    mode: getSelectedMode(),
    shuffle: shuffleToggle.checked,
    images: gatherImageState(),
    theme: body.dataset.theme || 'school',
    teacherMode: teacherModeToggle.checked,
    teacherTasks: getSelectedTeacherTasks(),
    timerSeconds: Number(timerSelect.value || 0),
    sound: soundToggle.checked,
    confetti: confettiToggle.checked,
    setName: setNameInput.value.trim()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    wordsInput.value = demoWords.map(x => x.word).join('\n');
    setTheme('school');
    return;
  }
  try {
    const data = JSON.parse(raw);
    wordsInput.value = data.wordsText || demoWords.map(x => x.word).join('\n');
    tableInput.value = data.tableText || '';
    if (data.mode) {
      const radio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (radio) radio.checked = true;
    }
    shuffleToggle.checked = data.shuffle ?? true;
    refreshModeStyles();
    setTheme(data.theme || 'school');
    teacherModeToggle.checked = !!data.teacherMode;
    setTeacherModeUI();
    if (Array.isArray(data.teacherTasks)) applyTeacherTaskSelection(data.teacherTasks);
    timerSelect.value = String(data.timerSeconds || 0);
    soundToggle.checked = data.sound ?? true;
    confettiToggle.checked = data.confetti ?? true;
    setNameInput.value = data.setName || '';
    buildImageRows(data.images || []);
  } catch {
    wordsInput.value = demoWords.map(x => x.word).join('\n');
    setTheme('school');
  }
}

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || 'word';
}

function parseWords() {
  return wordsInput.value
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean);
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

    urlInput.addEventListener('change', saveState);

    const existingItem = savedMap.get(word.toLowerCase());
    if (existingItem?.imageSrc) {
      if (/^data:|^https?:|^blob:|^\//i.test(existingItem.imageSrc)) {
        setPreview(existingItem.imageSrc);
        if (/^https?:/i.test(existingItem.imageSrc)) urlInput.value = existingItem.imageSrc;
      }
    }

    tools.append(uploadBtn, applyUrlBtn, clearImgBtn, fileInput);
    row.append(wordInput, preview, urlInput, tools);
    imageRows.appendChild(row);
  });

  saveState();
}

function gatherImageState() {
  return Array.from(document.querySelectorAll('.image-row')).map(row => {
    const word = row.querySelector('.image-word-input')?.value?.trim() || '';
    const preview = row.querySelector('.image-preview');
    const imageSrc = preview?.dataset?.src || '';
    return { word, imageSrc };
  });
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

  if (!cards.length) {
    alert('Add at least one word first.');
    return;
  }
  if (!ensureImagesForCurrentMode(cards, mode)) {
    alert('This mode needs an image for every word. Please add the missing images or switch to Word mode.');
    return;
  }

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
  renderCard(currentCard);
  prepareScratchSurface();
  resetCardExtras();
  nextBtn.disabled = true;
  revealedEnough = false;
  if (!isFirst) saveState();
}

function renderCard(card) {
  const hasImage = mode !== 'word';
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
  teacherTask.classList.add('hidden');
  teacherTask.textContent = '';
  fitWord();
}

function fitWord() {
  const text = (currentCard?.word || '').trim();
  if (!text || resultWord.classList.contains('hidden')) return;
  let size;
  const len = text.length;
  if (len <= 10) size = 'clamp(2.8rem, 8vw, 7rem)';
  else if (len <= 18) size = 'clamp(2.4rem, 6.6vw, 5.8rem)';
  else if (len <= 28) size = 'clamp(2rem, 5.4vw, 4.9rem)';
  else size = 'clamp(1.65rem, 4.6vw, 4rem)';
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
  const grad = ctx.createLinearGradient(0, 0, w, h);
  const theme = body.dataset.theme;
  const gradients = {
    school: ['#6d5efc', '#8f82ff', '#00b7ff'],
    magic: ['#8d43ff', '#b45cff', '#ff63c5'],
    neon: ['#00f0ff', '#00b8ff', '#8c5bff'],
    cute: ['#ff78b8', '#ffa2b1', '#ffaf60']
  };
  const [c1, c2, c3] = gradients[theme] || gradients.school;
  grad.addColorStop(0, c1);
  grad.addColorStop(.45, c2);
  grad.addColorStop(1, c3);
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, w, h, 38);
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = .16;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 22 + Math.random() * 56, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#ffd95e';
    ctx.fill();
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,.98)';
  ctx.font = `800 ${Math.max(28, w * 0.05)}px "Baloo 2", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCRATCH ME', w / 2, h / 2);

  ctx.font = `700 ${Math.max(16, w * 0.022)}px Inter, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.fillText('Reveal the surprise card', w / 2, h / 2 + Math.max(48, w * 0.06));

  scratchReady = true;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function getCanvasPos(event) {
  const rect = scratchCanvas.getBoundingClientRect();
  let clientX = 0;
  let clientY = 0;
  if (event.touches?.[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function scratchAt(event) {
  if (!scratchReady) return;
  const { x, y } = getCanvasPos(event);
  const rect = scratchCanvas.getBoundingClientRect();
  const size = Math.max(34, rect.width * 0.045);
  ctx.globalCompositeOperation = 'destination-out';
  const grad = ctx.createRadialGradient(x, y, size * 0.2, x, y, size);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  playScratchSound();
}

function handleScratchProgress() {
  if (revealedEnough) return;
  const percent = getRevealedPercent();
  if (percent >= 35) {
    revealedEnough = true;
    nextBtn.disabled = false;
    onCardRevealed();
  }
}

function getRevealedPercent() {
  const data = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let clearPixels = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 30) clearPixels++;
  }
  return (clearPixels / (data.length / 4)) * 100;
}

function revealAll() {
  const rect = scratchCanvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  revealedEnough = true;
  nextBtn.disabled = false;
  onCardRevealed();
}


function getSelectedTeacherTasks() {
  return Array.from(teacherTaskOptions.querySelectorAll('input[type="checkbox"]:checked')).map(x => x.value);
}

function applyTeacherTaskSelection(tasks) {
  teacherTaskOptions.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = tasks.includes(input.value);
  });
}

function setTeacherModeUI() {
  teacherTaskOptions.classList.toggle('disabled-block', !teacherModeToggle.checked);
}

function resetCardExtras() {
  confettiFired = false;
  teacherTask.classList.add('hidden');
  teacherTask.textContent = '';
  stopTimer();
  const seconds = Number(timerSelect.value || 0);
  if (seconds > 0) startTimer(seconds);
  else timerPill.classList.add('hidden');
}

function startTimer(seconds) {
  stopTimer();
  timerRemaining = seconds;
  timerPill.classList.remove('hidden');
  updateTimerDisplay();
  timerId = setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1);
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      stopTimer(false);
      timerPill.classList.add('warning');
      playTimerEndSound();
    }
  }, 1000);
}

function stopTimer(hideWarning = true) {
  if (timerId) clearInterval(timerId);
  timerId = null;
  if (hideWarning) timerPill.classList.remove('warning');
}

function updateTimerDisplay() {
  const min = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const sec = String(timerRemaining % 60).padStart(2, '0');
  timerPill.textContent = `${min}:${sec}`;
  timerPill.classList.toggle('warning', timerRemaining > 0 && timerRemaining <= 5);
}

function onCardRevealed() {
  stopTimer();
  if (teacherModeToggle.checked) {
    const tasks = getSelectedTeacherTasks();
    if (tasks.length) {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      teacherTask.textContent = task;
      teacherTask.classList.remove('hidden');
    }
  }
  if (confettiToggle.checked && !confettiFired) {
    confettiFired = true;
    launchConfetti();
  }
}

function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playScratchSound() {
  if (!soundToggle.checked) return;
  const now = performance.now();
  if (now - lastScratchSoundAt < 45) return;
  lastScratchSoundAt = now;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const freq = 230 + Math.random() * 120;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(0.015, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.055);
  } catch {}
}

function playTimerEndSound() {
  if (!soundToggle.checked) return;
  try {
    const ac = getAudioContext();
    [0, .16].forEach((delay, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(i ? 760 : 620, ac.currentTime + delay);
      gain.gain.setValueAtTime(0.055, ac.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + .13);
      osc.connect(gain).connect(ac.destination);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + .14);
    });
  } catch {}
}

function launchConfetti() {
  const palette = ['#6d5efc', '#00b7ff', '#ffd95e', '#ff78b8', '#2dff9b', '#ff8a5b'];
  const count = Math.min(70, Math.max(34, Math.floor(window.innerWidth / 18)));
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = palette[Math.floor(Math.random() * palette.length)];
    piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
    piece.style.animationDuration = `${1.9 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * .25}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
  }
}

function buildSetPayload() {
  return {
    app: 'Scratch & Speak',
    version: 3,
    name: setNameInput.value.trim() || 'Scratch & Speak set',
    words: buildCards(),
    mode: getSelectedMode(),
    shuffle: shuffleToggle.checked,
    theme: body.dataset.theme || 'school',
    teacherMode: teacherModeToggle.checked,
    teacherTasks: getSelectedTeacherTasks(),
    timerSeconds: Number(timerSelect.value || 0),
    sound: soundToggle.checked,
    confetti: confettiToggle.checked
  };
}

function exportSet() {
  const payload = buildSetPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = payload.name.replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'scratch_speak_set';
  a.href = url;
  a.download = `${safeName}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importSetData(data) {
  if (!data || !Array.isArray(data.words)) throw new Error('Invalid set file');
  const normalized = data.words.map(item => {
    if (typeof item === 'string') return { word: item, imageSrc: '' };
    return { word: String(item.word || '').trim(), imageSrc: String(item.imageSrc || '').trim() };
  }).filter(x => x.word);
  if (!normalized.length) throw new Error('No words in set');

  wordsInput.value = normalized.map(x => x.word).join('\n');
  buildImageRows(normalized);
  if (data.mode && document.querySelector(`input[name="mode"][value="${data.mode}"]`)) {
    document.querySelector(`input[name="mode"][value="${data.mode}"]`).checked = true;
  }
  refreshModeStyles();
  shuffleToggle.checked = data.shuffle ?? true;
  setTheme(data.theme || 'school');
  teacherModeToggle.checked = !!data.teacherMode;
  setTeacherModeUI();
  if (Array.isArray(data.teacherTasks)) applyTeacherTaskSelection(data.teacherTasks);
  timerSelect.value = String(data.timerSeconds || 0);
  soundToggle.checked = data.sound ?? true;
  confettiToggle.checked = data.confetti ?? true;
  setNameInput.value = data.name || '';
  saveState();
}

async function readFileAsDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function exitToSetup() {
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

function parseDelimitedText(text) {
  const rows = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const parsed = [];

  for (const row of rows) {
    let parts;
    if (row.includes('\t')) parts = row.split('\t');
    else if (row.includes(';')) parts = row.split(';');
    else parts = row.split(',');

    const word = (parts[0] || '').trim();
    const imageSrc = (parts[1] || '').trim();
    if (!word) continue;
    parsed.push({ word, imageSrc });
  }
  return parsed;
}

function importStructuredItems(items) {
  if (!items.length) {
    alert('Nothing to import.');
    return;
  }
  wordsInput.value = items.map(item => item.word).join('\n');
  buildImageRows(items);
  saveState();
}

fillDemoBtn.addEventListener('click', () => {
  wordsInput.value = demoWords.map(x => x.word).join('\n');
  buildImageRows(demoWords);
  tableInput.value = '';
  saveState();
});

buildImageRowsBtn.addEventListener('click', () => buildImageRows(gatherImageState()));
importTableBtn.addEventListener('click', () => {
  const items = parseDelimitedText(tableInput.value);
  importStructuredItems(items);
});
csvFileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  tableInput.value = text;
  importStructuredItems(parseDelimitedText(text));
});
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
window.addEventListener('resize', () => {
  if (gameScreen.classList.contains('active')) prepareScratchSurface();
  fitWord();
});

wordsInput.addEventListener('input', saveState);
tableInput.addEventListener('input', saveState);
shuffleToggle.addEventListener('change', saveState);
document.querySelectorAll('input[name="mode"]').forEach(input => {
  input.addEventListener('change', () => {
    refreshModeStyles();
    saveState();
  });
});
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setTheme(btn.dataset.theme);
    saveState();
    if (gameScreen.classList.contains('active')) prepareScratchSurface();
  });
});

scratchCanvas.addEventListener('pointerdown', (event) => {
  pointerDown = true;
  scratchAt(event);
  handleScratchProgress();
});
scratchCanvas.addEventListener('pointermove', (event) => {
  if (!pointerDown) return;
  scratchAt(event);
  handleScratchProgress();
});
window.addEventListener('pointerup', () => { pointerDown = false; });
scratchCanvas.addEventListener('pointerleave', () => { pointerDown = false; });


teacherModeToggle.addEventListener('change', () => { setTeacherModeUI(); saveState(); });
teacherTaskOptions.querySelectorAll('input[type="checkbox"]').forEach(input => input.addEventListener('change', saveState));
timerSelect.addEventListener('change', saveState);
soundToggle.addEventListener('change', saveState);
confettiToggle.addEventListener('change', saveState);
setNameInput.addEventListener('input', saveState);
exportSetBtn.addEventListener('click', exportSet);
importSetInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    importSetData(data);
  } catch {
    alert('This file is not a valid Scratch & Speak set.');
  } finally {
    event.target.value = '';
  }
});

loadState();
refreshModeStyles();
if (!document.querySelector('.image-row')) buildImageRows(gatherImageState());
