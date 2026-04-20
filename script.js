let shitcoinClicks = 0;
let totalCPS = 0;
const upgradeButtons = document.querySelectorAll('.upgrade-btn');

function trackClick() {
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

// Initialize
updateUpgradeButtons();

// CPS timer
setInterval(() => {
  if (totalCPS > 0) {
    shitcoinClicks += totalCPS;
    document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
  }
}, 1000);
