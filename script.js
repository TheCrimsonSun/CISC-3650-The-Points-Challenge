let shitcoinClicks = 0;
let totalCPS = 0;
const sidebarButtons = document.querySelectorAll('.sidebar-btn');

function trackClick(event) {
  shitcoinClicks++;
  updateUI();

  // Visual feedback for the image
  const img = document.getElementById('shitcoin');
  img.classList.add('clicked');
  setTimeout(() => img.classList.remove('clicked'), 50);

  // Floating number logic
  if (event) {
    createFloatingNumber(event.clientX, event.clientY);
  }
}

function updateUI() {
  document.getElementById('clickCounter').textContent = `Bitcoins: ${Math.floor(shitcoinClicks)}`;
  document.getElementById('cpsCounter').textContent = `Bitcoins per second: ${totalCPS}`;
  updateSidebarButtons();
}

function createFloatingNumber(x, y, text = '+1') {
  const floating = document.createElement('div');
  floating.className = 'floating-number';
  floating.textContent = text;
  
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
  btn.addEventListener('click', () => {
    const score = parseInt(btn.dataset.score);
    const cps = parseInt(btn.dataset.cps);
    if (shitcoinClicks >= score) {
      shitcoinClicks -= score;
      totalCPS += cps;
      updateUI();
      console.log(`Subtracted ${score} points! Total CPS: ${totalCPS}`);
    }
  });
});

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
