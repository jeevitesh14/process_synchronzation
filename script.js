// ---------- Intro Screen Logic ----------
function enterSimulation() {
  const intro = document.getElementById('introScreen');
  const main = document.getElementById('mainContent');
  intro.classList.add('hidden');
  setTimeout(() => {
    intro.style.display = 'none';
    main.classList.remove('hidden');

    document.querySelectorAll('.content').forEach(sec => {
      sec.classList.remove('show');
      sec.classList.add('hidden');
    });
  }, 1000);
}

// ---------- Section Switch ----------
function showSection(id) {
  const sections = document.querySelectorAll('.content');
  sections.forEach(sec => {
    if (!sec.classList.contains('hidden')) {
      sec.classList.remove('show');
      sec.classList.add('hide');
      setTimeout(() => {
        sec.classList.add('hidden');
        sec.classList.remove('hide');
      }, 600);
    }
  });

  const target = document.getElementById(id);
  target.classList.remove('hidden');
  setTimeout(() => target.classList.add('show'), 20);
}

// ---------- Producer-Consumer ----------
const buffer = [];
const bufferSize = 5;
const bufferContainer = document.getElementById('buffer');
const pcStatus = document.getElementById('pcStatus');

function renderBuffer(animationType, index) {
  bufferContainer.innerHTML = '';
  for (let i = 0; i < bufferSize; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    if (buffer[i] !== undefined) {
      slot.classList.add('full');
      slot.textContent = buffer[i];
    }

    if (animationType === 'produce' && i === buffer.length - 1) slot.classList.add('produced');
    if (animationType === 'consume' && i === index) slot.classList.add('consumed');

    bufferContainer.appendChild(slot);
  }
}

function produce() {
  if (buffer.length < bufferSize) {
    const item = Math.floor(Math.random() * 100);
    buffer.push(item);
    pcStatus.textContent = `🟢 Produced item ${item}`;
    renderBuffer('produce');
  } else {
    pcStatus.textContent = '🔴 Buffer is full! Producer waiting...';
    renderBuffer();
  }
}

function consume() {
  if (buffer.length > 0) {
    const item = buffer[0];
    pcStatus.textContent = `🟠 Consumed item ${item}`;
    const slots = bufferContainer.querySelectorAll('.slot');
    if (slots[0]) slots[0].classList.add('consumed');
    setTimeout(() => {
      buffer.shift();
      renderBuffer();
    }, 400);
  } else {
    pcStatus.textContent = '🔴 Buffer is empty! Consumer waiting...';
    renderBuffer();
  }
}

function resetBuffer() {
  buffer.length = 0;
  pcStatus.textContent = '🔄 Buffer reset.';
  renderBuffer();
}

renderBuffer();

// ---------- Dining Philosophers ----------
let philosophers = [];
let forks = [];
let interval = null;

function createTable() {
  const table = document.getElementById('table');
  table.innerHTML = '';
  philosophers = [];
  forks = [];

  const num = 5;
  const radius = 120;
  const centerX = 175;
  const centerY = 175;

  for (let i = 0; i < num; i++) {
    const phil = document.createElement('div');
    phil.classList.add('philosopher', 'thinking');
    phil.textContent = `P${i + 1}`;

    const angle = (2 * Math.PI * i) / num;
    phil.style.left = `${centerX + radius * Math.cos(angle) - 30}px`;
    phil.style.top = `${centerY + radius * Math.sin(angle) - 30}px`;

    table.appendChild(phil);
    philosophers.push(phil);

    const fork = document.createElement('div');
    fork.classList.add('fork');
    const forkAngle = angle + Math.PI / num;
    fork.style.left = `${centerX + (radius - 50) * Math.cos(forkAngle)}px`;
    fork.style.top = `${centerY + (radius - 50) * Math.sin(forkAngle)}px`;
    fork.style.transform = `rotate(${(forkAngle * 180) / Math.PI}deg)`;

    table.appendChild(fork);
    forks.push(fork);
  }

  document.getElementById('dpStatus').textContent = '';
}

// Start Dining Philosophers
function startDining() {
  if (interval) return;
  document.getElementById('dpStatus').textContent = '🍴 Philosophers are thinking and eating...';

  interval = setInterval(() => {
    const i = Math.floor(Math.random() * philosophers.length);
    const phil = philosophers[i];
    const leftFork = forks[i];
    const rightFork = forks[(i + 1) % forks.length];

    if (phil.classList.contains('eating')) {
      phil.classList.remove('eating');
      phil.classList.add('thinking');
      leftFork.classList.remove('active');
      rightFork.classList.remove('active');
      document.getElementById('dpStatus').textContent = `${phil.textContent} finished eating`;
    } else {
      const leftNeighbor = philosophers[(i - 1 + philosophers.length) % philosophers.length];
      const rightNeighbor = philosophers[(i + 1) % philosophers.length];

      if (!leftNeighbor.classList.contains('eating') && !rightNeighbor.classList.contains('eating')) {
        phil.classList.add('eating');
        phil.classList.remove('thinking');
        leftFork.classList.add('active');
        rightFork.classList.add('active');
        document.getElementById('dpStatus').textContent = `${phil.textContent} is eating`;
      } else {
        document.getElementById('dpStatus').textContent = `${phil.textContent} is waiting`;
      }
    }
  }, 1200);
}

// Stop Dining
function stopDining() {
  clearInterval(interval);
  interval = null;
  philosophers.forEach(p => p.classList.remove('eating'));
  philosophers.forEach(p => p.classList.add('thinking'));
  forks.forEach(f => f.classList.remove('active'));
  document.getElementById('dpStatus').textContent = '⛔ Dining stopped.';
}

// Reset Dining
function resetDining() {
  stopDining();
  createTable();
  document.getElementById('dpStatus').textContent = '🔄 Dining reset.';
}

// Initialize
createTable();

// ---------- Theme Toggle ----------
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.toggle('light', currentTheme === 'light');
themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const newTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Enable page scroll
document.body.style.overflowY = 'auto';
