let bitCoins = 0;
let totalCPS = 0;
const upgradeButtons = document.querySelectorAll('.upgrade-btn');
const bitCoinImg = document.getElementById('shitcoin');

// Screens
const menuScreen = document.getElementById('menu-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const gameScreen = document.getElementById('game-screen');
const finishScreen = document.getElementById('finish-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');

// Buttons
const startBtn = document.getElementById('start-btn');
const howToBtn = document.getElementById('how-to-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const pauseBtn = document.getElementById('pause-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
const adsBtn = document.getElementById('ads-btn');
const adsModal = document.getElementById('ads-modal');
const closeAdsModalBtn = document.getElementById('close-ads-modal');
const purchaseAdRemovalBtn = document.getElementById('purchase-ad-removal-btn');

function showScreen(screen) {
  [menuScreen, instructionsScreen, gameScreen, finishScreen, leaderboardScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

startBtn.addEventListener('click', () => showScreen(gameScreen));
howToBtn.addEventListener('click', () => showScreen(instructionsScreen));
backToMenuBtn.addEventListener('click', () => showScreen(menuScreen));
pauseBtn.addEventListener('click', () => showScreen(menuScreen));
playAgainBtn.addEventListener('click', () => {
  // Reset game state
  bitCoins = 0;
  totalCPS = 0;
  
  // Reset all upgrade buttons to original state
  upgradeButtons.forEach(btn => {
    const originalCost = parseInt(btn.dataset.cost);
    // Find original cost by dividing by 1.15 repeatedly (reverse the increases)
    let baseCost = originalCost;
    // Reset to initial costs based on the button's name
    const costs = {
      'CPU Miner': 15,
      'GPU Rig': 100,
      'ASIC Miner': 500,
      'Mining Farm': 2000,
      'Mining Pool': 10000,
      'Satellite Node': 50000,
      'Quantum Miner': 250000,
      'Blockchain Core': 1000000,
      "Satoshi's Legacy": 5000000,
      'Bitcoin Citadel': 25000000,
      'Decentralized Empire': 1000000000,
      'Debug Ending': 0
    };
    
    const baseName = btn.dataset.name;
    baseCost = costs[baseName];
    btn.dataset.cost = baseCost;
    btn.textContent = `${baseName} (${formatNumber(baseCost)} BTC)`;
  });
  
  updateUI();
  showScreen(gameScreen);
});

function generateLeaderboard() {
  const fakeLeaders = [
    { name: 'CryptoBro420', bitcoins: 45230000000 },
    { name: 'HodlMaster', bitcoins: 38500000000 },
    { name: 'SatoshiSimp', bitcoins: 32100000000 },
    { name: 'BlockchainKing', bitcoins: 28750000000 },
    { name: 'CoinCollector', bitcoins: 25300000000 },
    { name: 'MinerMike', bitcoins: 22100000000 },
    { name: 'DiamondHands', bitcoins: 19800000000 },
    { name: 'Web3Warrior', bitcoins: 18200000000 },
    { name: 'StackSats', bitcoins: 16500000000 }
  ];
  
  return fakeLeaders;
}

function displayLeaderboard() {
  const leaderboard = generateLeaderboard();
  const leaderboardContent = document.getElementById('leaderboard-content');
  let html = '<table class="leaderboard-table"><tr><th>Rank</th><th>Name</th><th>Bitcoins</th></tr>';
  
  leaderboard.forEach((leader, index) => {
    html += `<tr><td>${index + 1}</td><td>${leader.name}</td><td>${formatNumber(leader.bitcoins)} BTC</td></tr>`;
  });
  
  html += `<tr class="player-row"><td>10</td><td>You</td><td>${formatNumber(bitCoins)} BTC</td></tr></table>`;
  
  leaderboardContent.innerHTML = html;
  showScreen(leaderboardScreen);
}

leaderboardBtn.addEventListener('click', () => displayLeaderboard());
closeLeaderboardBtn.addEventListener('click', () => showScreen(gameScreen));

adsBtn.addEventListener('click', () => {
  adsModal.classList.remove('hidden');
});

closeAdsModalBtn.addEventListener('click', () => {
  adsModal.classList.add('hidden');
});

purchaseAdRemovalBtn.addEventListener('click', () => {
  alert('Thanks for your purchase! Ads have been removed.');
  adsModal.classList.add('hidden');
});

adsModal.addEventListener('click', (e) => {
  if (e.target === adsModal) {
    adsModal.classList.add('hidden');
  }
});

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
    const cost = parseInt(btn.dataset.cost);
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
      
      // Check if this upgrade finishes the game
      if (btn.hasAttribute('finish')) {
        showScreen(finishScreen);
      }
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