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

function createTable() {
  const table = document.getElementById('table');
  table.innerHTML = '';
  philosophers = [];
  forks = [];

  const num = 5;
  const centerX = 275;
  const centerY = 275;
  const radiusPhilosophers = 220;
  const radiusForks = 200;

  for (let i = 0; i < num; i++) {
    const angle = (2 * Math.PI * i) / num - Math.PI / 2;

    // 👤 Philosopher
    const phil = document.createElement('div');
    phil.classList.add('philosopher', 'thinking');
    phil.textContent = `P${i + 1}`;
    phil.style.left = `${centerX + radiusPhilosophers * Math.cos(angle) - 45}px`;
    phil.style.top = `${centerY + radiusPhilosophers * Math.sin(angle) - 45}px`;

    phil.addEventListener('click', () => togglePhilosopher(i));
    table.appendChild(phil);
    philosophers.push(phil);
  }

  // 🍴 Forks placed correctly between philosophers
  for (let i = 0; i < num; i++) {
    const angle = (2 * Math.PI * i) / num - Math.PI / 2 + Math.PI / num;
    const fork = document.createElement('div');
    fork.classList.add('fork');
    fork.style.left = `${centerX + radiusForks * Math.cos(angle) - 7}px`;
    fork.style.top = `${centerY + radiusForks * Math.sin(angle) - 45}px`;
    fork.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;
    table.appendChild(fork);
    forks.push(fork);
  }

  document.getElementById('dpStatus').textContent =
    '🖱️ Click on a philosopher to let them try to eat.';
}

function togglePhilosopher(i) {
  const phil = philosophers[i];
  const leftFork = forks[i]; // left fork for philosopher i
  const rightFork = forks[(i - 1 + forks.length) % forks.length]; // right fork (previous one)
  const leftNeighbor = philosophers[(i - 1 + philosophers.length) % philosophers.length];
  const rightNeighbor = philosophers[(i + 1) % philosophers.length];
  const status = document.getElementById('dpStatus');

  // Stop eating
  if (phil.classList.contains('eating')) {
    phil.classList.remove('eating');
    phil.classList.add('thinking');
    leftFork.classList.remove('active');
    rightFork.classList.remove('active');
    status.textContent = `${phil.textContent} finished eating. 🍽️`;
    return;
  }

  // Try to eat if neighbors aren’t eating
  if (!leftNeighbor.classList.contains('eating') && !rightNeighbor.classList.contains('eating')) {
    phil.classList.add('eating');
    phil.classList.remove('thinking');
    leftFork.classList.add('active');
    rightFork.classList.add('active');
    status.textContent = `${phil.textContent} started eating. 🥢`;
  } else {
    phil.classList.add('waiting');
    status.textContent = `${phil.textContent} is waiting (neighbors are eating). ⏳`;
    setTimeout(() => phil.classList.remove('waiting'), 1000);
  }
}

function resetDining() {
  createTable();
  document.getElementById('dpStatus').textContent = '🔄 Dining reset.';
}

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
