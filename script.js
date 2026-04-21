let bitCoins = 0;
let totalCPS = 0;
const upgradeButtons = document.querySelectorAll('.upgrade-btn');
const bitCoinImg = document.getElementById('shitcoin');

// Screens
const menuScreen = document.getElementById('menu-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const gameScreen = document.getElementById('game-screen');

// Buttons
const startBtn = document.getElementById('start-btn');
const howToBtn = document.getElementById('how-to-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const pauseBtn = document.getElementById('pause-btn');

function showScreen(screen) {
  [menuScreen, instructionsScreen, gameScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

startBtn.addEventListener('click', () => showScreen(gameScreen));
howToBtn.addEventListener('click', () => showScreen(instructionsScreen));
backToMenuBtn.addEventListener('click', () => showScreen(menuScreen));
pauseBtn.addEventListener('click', () => showScreen(menuScreen));

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return Math.floor(num).toString();
}

function updateUI() {
  document.getElementById('clickCounter').textContent = `Bitcoins: ${formatNumber(bitCoins)}`;
  document.getElementById('cpsCounter').textContent = `Bitcoins per second: ${formatNumber(totalCPS)}`;
  
  upgradeButtons.forEach(btn => {
    const cost = parseInt(btn.dataset.cost);
    btn.disabled = bitCoins < cost;
  });
}

function createFloatingNumber(x, y, text) {
  const floating = document.createElement('div');
  floating.className = 'floating-number';
  floating.textContent = text;
  
  // Randomize position slightly
  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = (Math.random() - 0.5) * 40;
  
  floating.style.left = `${x + offsetX}px`;
  floating.style.top = `${y + offsetY}px`;
  
  document.body.appendChild(floating);
  
  setTimeout(() => {
    floating.remove();
  }, 800);
}

bitCoinImg.addEventListener('click', (event) => {
  bitCoins++;
  
  // Visual click effect
  bitCoinImg.classList.add('clicked');
  setTimeout(() => bitCoinImg.classList.remove('clicked'), 50);
  
  createFloatingNumber(event.clientX, event.clientY, '+1');
  updateUI();
});

upgradeButtons.forEach(btn => {
  // Store base name
  const originalText = btn.textContent.trim();
  const baseName = originalText.split(' (')[0].trim();
  btn.dataset.name = baseName;

  btn.addEventListener('click', () => {
    const score = parseInt(btn.dataset.score);
    const cps = parseInt(btn.dataset.cps);
    
    if (bitCoins >= cost) {
      bitCoins -= cost;
      totalCPS += cps;
      
      // Increase cost
      const newCost = Math.ceil(cost * 1.15);
      btn.dataset.cost = newCost;
      
      // Update text
      btn.textContent = `${btn.dataset.name} (${formatNumber(newCost)} BTC)`;
      
      updateUI();
    }
  });
});

// Passive Income loop (100ms for smoothness)
setInterval(() => {
  if (totalCPS > 0) {
    bitCoins += totalCPS / 10;
    updateUI();
  }
}, 100);

// Periodic floating text for CPS
setInterval(() => {
  if (totalCPS > 0 && !gameScreen.classList.contains('hidden')) {
    const rect = bitCoinImg.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createFloatingNumber(x, y, `+${formatNumber(totalCPS)}`);
  }
}, 2000);

// Initial UI sync
updateUI();
