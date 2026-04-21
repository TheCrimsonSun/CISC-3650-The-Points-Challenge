let shitcoinClicks = 0;
let totalCPS = 0;
const upgradeButtons = document.querySelectorAll('.upgrade-btn');

function trackClick(event) {
  shitcoinClicks++;
  document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
}

function updateUpgradeButtons() {
  upgradeButtons.forEach(btn => {
    const cost = parseInt(btn.dataset.cost);
    btn.disabled = shitcoinClicks < cost;
  });
}

upgradeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    const cps = parseInt(btn.dataset.cps);
    if (shitcoinClicks >= cost) {
      shitcoinClicks -= cost;
      totalCPS += cps;
      document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
      document.getElementById('cpsCounter').textContent = `CPS: ${totalCPS}`;
      updateUpgradeButtons();
      console.log(`Bought upgrade! +${cps} CPS`);
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
updateUpgradeButtons();

// CPS timer
setInterval(() => {
  if (totalCPS > 0) {
    shitcoinClicks += totalCPS;
    document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
  }
}, 1000);
