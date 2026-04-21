let shitcoinClicks = 0;
let totalCPS = 0;
let comboCount = 0;
let lastClickTime = 0;
const COMBO_TIMEOUT = 1000; // 1 second
const sidebarButtons = document.querySelectorAll('.sidebar-btn');

function trackClick(event) {
  const now = Date.now();
  if (now - lastClickTime < COMBO_TIMEOUT) {
    comboCount++;
  } else {
    comboCount = 1;
  }
  lastClickTime = now;

  // Bonus: +1 bitcoin for every 5 combo
  const bonus = Math.floor(comboCount / 5);
  const clickValue = 1 + bonus;
  
  shitcoinClicks += clickValue;
  updateUI();

  // Visual feedback for the image
  const img = document.getElementById('shitcoin');
  img.classList.add('clicked');
  setTimeout(() => img.classList.remove('clicked'), 50);

  // Floating number logic
  if (event) {
    createFloatingNumber(event.clientX, event.clientY, `+${clickValue}`);
  }
}

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
  document.getElementById('clickCounter').textContent = `Bitcoins: ${formatNumber(shitcoinClicks)}`;
  document.getElementById('cpsCounter').textContent = `Bitcoins per second: ${formatNumber(totalCPS)}`;
  
  const comboEl = document.getElementById('comboCounter');
  if (comboCount > 1) {
    comboEl.style.display = 'block';
    comboEl.textContent = `${comboCount}x Combo!`;
    // Add a little pop effect
    comboEl.classList.remove('combo-pop');
    void comboEl.offsetWidth; // Trigger reflow
    comboEl.classList.add('combo-pop');
  } else {
    comboEl.style.display = 'none';
  }

  updateSidebarButtons();
}

function createFloatingNumber(x, y, text = '+1') {
  const floating = document.createElement('div');
  floating.className = 'floating-number';
  
  // Format the number if it's a numeric string like "+10" or "500"
  let displayValue = text;
  if (text.startsWith('+')) {
    const num = parseFloat(text.slice(1));
    if (!isNaN(num)) displayValue = '+' + formatNumber(num);
  } else if (!isNaN(parseFloat(text))) {
    displayValue = formatNumber(parseFloat(text));
  }
  
  floating.textContent = displayValue;
  
  // Randomize position slightly
  const offsetX = (Math.random() - 0.5) * 80;
  const offsetY = (Math.random() - 0.5) * 80;
  
  floating.style.left = `${x + offsetX}px`;
  floating.style.top = `${y + offsetY}px`;
  
  document.body.appendChild(floating);
  
  // Remove element after animation finishes
  setTimeout(() => {
    floating.remove();
  }, 800);
}

function updateSidebarButtons() {
  sidebarButtons.forEach(btn => {
    const score = parseInt(btn.dataset.score);
    btn.disabled = shitcoinClicks < score;
  });
}

sidebarButtons.forEach(btn => {
  // Store the base name of the upgrade
  const originalText = btn.textContent;
  const baseName = originalText.split(' (')[0];
  btn.dataset.name = baseName;

  btn.addEventListener('click', () => {
    const score = parseInt(btn.dataset.score);
    const cps = parseInt(btn.dataset.cps);
    if (shitcoinClicks >= score) {
      shitcoinClicks -= score;
      totalCPS += cps;
      
      // Increase cost by 1.15x
      const nextScore = Math.ceil(score * 1.15);
      btn.dataset.score = nextScore;
      
      // Update button text
      btn.textContent = `${btn.dataset.name} (${formatNumber(nextScore)} BTC)`;
      
      updateUI();
      console.log(`Purchased ${btn.dataset.name}! New cost: ${nextScore}. Total CPS: ${totalCPS}`);
    }
  });
});

// Periodic combo reset check
setInterval(() => {
  const now = Date.now();
  if (comboCount > 1 && now - lastClickTime >= COMBO_TIMEOUT) {
    comboCount = 0;
    updateUI();
  }
}, 100);

// Passive Income Interval (every 100ms)
setInterval(() => {
  if (totalCPS > 0) {
    shitcoinClicks += totalCPS / 10;
    updateUI();
  }
}, 100);

// Visual feedback for passive income (every 1 second)
setInterval(() => {
  if (totalCPS > 0) {
    const img = document.getElementById('shitcoin');
    const rect = img.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createFloatingNumber(x, y, `+${totalCPS}`);
  }
}, 1000);

// Initialize
updateUI();
