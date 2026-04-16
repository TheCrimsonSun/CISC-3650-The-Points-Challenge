const rounds = [
  {
    id: "tap-rush-1",
    title: "Tap Rush",
    text: "Click the glowing target 10 times before the round ends.",
    type: "clicker",
    target: 10
  },
  {
    id: "choice-1",
    title: "Prize Pick",
    text: "Choose the box that matches the highest score value.",
    type: "choice",
    prompt: "Which reward box shows the highest point value?",
    options: [
      { label: "120 points", correct: false },
      { label: "250 points", correct: true },
      { label: "90 points", correct: false },
      { label: "180 points", correct: false }
    ]
  },
  {
    id: "grid-1",
    title: "Flash Tap",
    text: "Hit the highlighted tiles as fast as you can.",
    type: "grid",
    target: 6
  },
  {
    id: "tap-rush-2",
    title: "Coin Burst",
    text: "Catch the moving coin 8 times.",
    type: "clicker",
    target: 8
  },
  {
    id: "choice-2",
    title: "Quick Match",
    text: "Pick the word that matches the shown color name.",
    type: "choice",
    prompt: "Select the word BLUE.",
    options: [
      { label: "GREEN", correct: false },
      { label: "RED", correct: false },
      { label: "BLUE", correct: true },
      { label: "YELLOW", correct: false }
    ]
  },
  {
    id: "grid-2",
    title: "Lucky Tiles",
    text: "Tap 5 bright tiles before they disappear.",
    type: "grid",
    target: 5
  },
  {
    id: "tap-rush-3",
    title: "Bonus Blast",
    text: "Tap the bonus orb 12 times for a reward streak.",
    type: "clicker",
    target: 12
  },
  {
    id: "choice-3",
    title: "Fast Choice",
    text: "Pick the number with the highest value.",
    type: "choice",
    prompt: "Which number is largest?",
    options: [
      { label: "491", correct: false },
      { label: "509", correct: false },
      { label: "530", correct: true },
      { label: "518", correct: false }
    ]
  }
];

const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const finalScreen = document.getElementById("finalScreen");
const interstitialModal = document.getElementById("interstitialModal");
const startBtn = document.getElementById("startBtn");
const learnBtn = document.getElementById("learnBtn");
const replayBtn = document.getElementById("replayBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreEl = document.getElementById("score");
const roundCounterEl = document.getElementById("roundCounter");
const timerEl = document.getElementById("timer");
const roundTitleEl = document.getElementById("roundTitle");
const challengeTitleEl = document.getElementById("challengeTitle");
const challengeTextEl = document.getElementById("challengeText");
const gameAreaEl = document.getElementById("gameArea");
const feedbackEl = document.getElementById("feedback");
const goalTextEl = document.getElementById("goalText");
const merchantHintEl = document.getElementById("merchantHint");
const pressureBannerEl = document.getElementById("pressureBanner");
const upsellCardEl = document.getElementById("upsellCard");
const boostToggleEl = document.getElementById("boostToggle");
const meterFillEl = document.getElementById("meterFill");
const modalTitleEl = document.getElementById("modalTitle");
const modalTextEl = document.getElementById("modalText");
const modalActionsEl = document.getElementById("modalActions");
const finalSummaryEl = document.getElementById("finalSummary");
const finalScoreEl = document.getElementById("finalScore");
const finalRoundsEl = document.getElementById("finalRounds");

const state = {
  roundIndex: 0,
  score: 0,
  timer: 12,
  timerId: null,
  miniTimerId: null,
  pressureMode: false,
  activeRoundResolved: false,
  clickCount: 0,
  gridCount: 0
};

function switchScreen(screen) {
  [welcomeScreen, gameScreen, finalScreen].forEach((item) => item.classList.remove("active"));
  screen.classList.add("active");
}

function resetGame() {
  clearInterval(state.timerId);
  clearInterval(state.miniTimerId);
  state.roundIndex = 0;
  state.score = 0;
  state.timer = 12;
  state.pressureMode = false;
  state.activeRoundResolved = false;
  state.clickCount = 0;
  state.gridCount = 0;
  boostToggleEl.checked = true;
  upsellCardEl.classList.add("hidden");
  pressureBannerEl.classList.add("hidden");
  interstitialModal.classList.add("hidden");
  updateHud();
}

function updateHud() {
  scoreEl.textContent = state.score;
  roundCounterEl.textContent = `${Math.min(state.roundIndex + 1, rounds.length)} / ${rounds.length}`;
  timerEl.textContent = state.timer;
  meterFillEl.style.width = `${Math.min((state.score / 500) * 100, 100)}%`;
}

function startTimer() {
  clearInterval(state.timerId);
  state.timer = state.pressureMode ? 8 : 12;
  updateHud();

  state.timerId = setInterval(() => {
    state.timer -= 1;
    timerEl.textContent = state.timer;
    if (state.timer <= 0) {
      clearInterval(state.timerId);
      resolveRound(false, "Time ran out. The arcade keeps your attention moving before you can slow down.");
    }
  }, 1000);
}

function startGame() {
  resetGame();
  switchScreen(gameScreen);
  loadRound();
}

function loadRound() {
  clearInterval(state.miniTimerId);
  if (state.roundIndex >= rounds.length) {
    finishGame();
    return;
  }

  if (!state.pressureMode && state.roundIndex >= 5) {
    state.pressureMode = true;
    pressureBannerEl.classList.remove("hidden");
    merchantHintEl.textContent = "Bonus mode is active. Higher energy rounds are now live.";
    upsellCardEl.classList.remove("hidden");
  }

  state.activeRoundResolved = false;
  state.clickCount = 0;
  state.gridCount = 0;

  const round = rounds[state.roundIndex];
  roundTitleEl.textContent = round.title;
  challengeTitleEl.textContent = round.title;
  challengeTextEl.textContent = round.text;
  feedbackEl.textContent = "Play the mini-game to keep your points growing.";
  goalTextEl.textContent = state.pressureMode
    ? "Premium Prize Box nearly within reach. Keep playing before the bonus window ends."
    : "Reach 500 points to unlock the Premium Prize Box.";

  gameAreaEl.innerHTML = "";
  renderRound(round);
  startTimer();
  updateHud();
}

function renderRound(round) {
  if (round.type === "clicker") {
    renderClicker(round);
    return;
  }

  if (round.type === "choice") {
    renderChoice(round);
    return;
  }

  if (round.type === "grid") {
    renderGrid(round);
  }
}

function renderClicker(round) {
  const status = document.createElement("div");
  status.className = "mini-status";
  status.innerHTML = `<span>Taps: <strong id="tapScore">0 / ${round.target}</strong></span>`;

  const board = document.createElement("div");
  board.className = "target-board";

  const target = document.createElement("button");
  target.className = "target-btn";
  target.textContent = "Tap Me";

  function moveTarget() {
    const maxX = Math.max(board.clientWidth - 100, 20);
    const maxY = Math.max(board.clientHeight - 70, 20);
    target.style.left = `${Math.random() * maxX}px`;
    target.style.top = `${Math.random() * maxY}px`;
  }

  target.addEventListener("click", () => {
    state.clickCount += 1;
    document.getElementById("tapScore").textContent = `${state.clickCount} / ${round.target}`;
    moveTarget();
    if (state.clickCount >= round.target) {
      resolveRound(true, "Round cleared. The player feels rewarded and primed to continue.");
    }
  });

  board.appendChild(target);
  gameAreaEl.appendChild(status);
  gameAreaEl.appendChild(board);
  requestAnimationFrame(moveTarget);
}

function renderChoice(round) {
  const prompt = document.createElement("p");
  prompt.className = "challenge-copy";
  prompt.textContent = round.prompt;

  const grid = document.createElement("div");
  grid.className = "choice-grid";

  round.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "choice-chip";
    button.textContent = option.label;
    button.addEventListener("click", () => {
      if (option.correct) {
        resolveRound(true, "Correct. A quick win keeps the player engaged.");
      } else {
        resolveRound(false, "Wrong pick. The round still pushes the player toward the next reward.");
      }
    });
    grid.appendChild(button);
  });

  gameAreaEl.appendChild(prompt);
  gameAreaEl.appendChild(grid);
}

function renderGrid(round) {
  const status = document.createElement("div");
  status.className = "mini-status";
  status.innerHTML = `<span>Hits: <strong id="gridScore">0 / ${round.target}</strong></span>`;

  const grid = document.createElement("div");
  grid.className = "tap-grid";

  const cells = [];
  for (let i = 0; i < 8; i += 1) {
    const cell = document.createElement("button");
    cell.className = "tap-cell";
    cell.type = "button";
    cell.addEventListener("click", () => {
      if (!cell.classList.contains("active")) return;
      cell.classList.remove("active");
      state.gridCount += 1;
      document.getElementById("gridScore").textContent = `${state.gridCount} / ${round.target}`;
      if (state.gridCount >= round.target) {
        resolveRound(true, "Nice streak. The mini-game hands out fast wins to keep momentum high.");
      }
    });
    cells.push(cell);
    grid.appendChild(cell);
  }

  function activateRandomCell() {
    cells.forEach((cell) => cell.classList.remove("active"));
    cells[Math.floor(Math.random() * cells.length)].classList.add("active");
  }

  state.miniTimerId = setInterval(activateRandomCell, state.pressureMode ? 500 : 800);
  activateRandomCell();

  gameAreaEl.appendChild(status);
  gameAreaEl.appendChild(grid);
}

function applyBoosterCharge() {
  if (!state.pressureMode) return 0;
  if (!boostToggleEl.checked) return 0;
  state.score = Math.max(0, state.score - 40);
  return -40;
}

function resolveRound(success, message) {
  if (state.activeRoundResolved) return;
  state.activeRoundResolved = true;
  clearInterval(state.timerId);
  clearInterval(state.miniTimerId);

  let delta = success ? 90 : 25;
  const boosterCost = applyBoosterCharge();
  state.score += delta;
  feedbackEl.textContent = `${message} +${delta} points${boosterCost ? `, ${boosterCost} booster fee` : ""}.`;
  updateHud();
  disableButtons();

  if (state.roundIndex === 2 || state.roundIndex === 5) {
    setTimeout(showInterstitial, 900);
    return;
  }

  setTimeout(nextRound, 900);
}

function disableButtons() {
  gameAreaEl.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function showInterstitial() {
  const offerData = state.roundIndex === 2
    ? {
        title: "Keep your hot streak?",
        text: "Claim instant streak protection and move into the next game right away.",
        primary: "Keep Streak",
        secondary: "Continue without extra protection"
      }
    : {
        title: "Almost at the prize tier",
        text: "One more round could unlock a better reward path. Stay in the arcade now.",
        primary: "Stay In",
        secondary: "Leave bonus lane"
      };

  modalTitleEl.textContent = offerData.title;
  modalTextEl.textContent = offerData.text;
  modalActionsEl.innerHTML = "";

  const primary = document.createElement("button");
  primary.className = "modal-btn primary";
  primary.textContent = offerData.primary;
  primary.addEventListener("click", () => {
    state.score += 20;
    interstitialModal.classList.add("hidden");
    updateHud();
    nextRound();
  });

  const secondary = document.createElement("button");
  secondary.className = "modal-btn secondary subtle-btn";
  secondary.textContent = offerData.secondary;
  secondary.addEventListener("click", () => {
    interstitialModal.classList.add("hidden");
    nextRound();
  });

  modalActionsEl.appendChild(primary);
  modalActionsEl.appendChild(secondary);
  interstitialModal.classList.remove("hidden");
}

function nextRound() {
  state.roundIndex += 1;
  loadRound();
}

function finishGame() {
  clearInterval(state.timerId);
  clearInterval(state.miniTimerId);
  finalScoreEl.textContent = state.score;
  finalRoundsEl.textContent = `${state.roundIndex} / ${rounds.length}`;
  finalSummaryEl.textContent =
    state.score >= 500
      ? "You reached the top reward tier and finished the full arcade run."
      : "Your run is over. Play again to chase a higher reward total.";
  switchScreen(finalScreen);
}

startBtn.addEventListener("click", startGame);
learnBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

switchScreen(welcomeScreen);

switchScreen(welcomeScreen);
