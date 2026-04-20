let shitcoinClicks = 0;
const sidebarButtons = document.querySelectorAll('.sidebar-btn');

function trackClick() {
  shitcoinClicks++;
  document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
  updateSidebarButtons();
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
    if (shitcoinClicks >= score) {
      shitcoinClicks -= score;
      document.getElementById('clickCounter').textContent = `Clicks: ${shitcoinClicks}`;
      updateSidebarButtons();
      console.log(`Subtracted ${score} points!`);
    }
  });
});

// Initialize
updateSidebarButtons();
