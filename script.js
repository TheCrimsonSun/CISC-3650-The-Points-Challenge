let shitcoinClicks = 0;
const sidebarButtons = document.querySelectorAll('.sidebar-btn');

function trackClick(event) {
  shitcoinClicks++;
  document.getElementById('clickCounter').textContent = `Bitcoins: ${shitcoinClicks}`;
  updateSidebarButtons();

  // Visual feedback for the image
  const img = document.getElementById('shitcoin');
  img.classList.add('clicked');
  setTimeout(() => img.classList.remove('clicked'), 50);

  // Floating number logic
  if (event) {
    createFloatingNumber(event.clientX, event.clientY);
  }
}

function createFloatingNumber(x, y) {
  const floating = document.createElement('div');
  floating.className = 'floating-number';
  floating.textContent = '+1';
  
  // Randomize position slightly
  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = (Math.random() - 0.5) * 40;
  
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
    if (shitcoinClicks >= score) {
      shitcoinClicks -= score;
      document.getElementById('clickCounter').textContent = `Bitcoins: ${shitcoinClicks}`;
      updateSidebarButtons();
      console.log(`Subtracted ${score} points!`);
    }
  });
});

// Initialize
updateSidebarButtons();
