// DOM Elements
const body = document.querySelector("body");
const startBtn = document.getElementById("btn-main");
const overlayDiv = document.getElementById("overlay");
const characterSetupScreen = document.getElementById("character-setup-screen");
const mainMenu = document.getElementById("main-menu");
const fightingScreen = document.getElementById("fighting-screen");
const beginBtn = document.getElementById("start-button");
const player1PointsSpan = document.getElementById("points-player-1");
const player2PointsSpan = document.getElementById("points-player-2");
const nameInput1 = document.getElementById("input-name-player1");
const nameInput2 = document.getElementById("input-name-player2");
const nextActionButton = document.getElementById("next-action");
const action = document.getElementById("action");
const player1HealthBar = document.getElementById("health-bar-1");
const player2HealthBar = document.getElementById("health-bar-2");
const player1Model = document.getElementById("char1");
const player2Model = document.getElementById("char2");
const playAgainBtn = document.getElementById("play-again");
const endScreen = document.getElementById("end-screen");
const modal = document.getElementById("modal");
const showActionsBtn = document.getElementById("show-actions");
const closeModalBtn = document.getElementById("modal-close");
const modalList = document.getElementById("modal-list");
const endScreenWinner = document.getElementById("end-screen-winner");

// State
let isGameOver = false;
const actions = [];

// Constants for base stats
const BASE_HEALTH = 100;
const BASE_STRENGTH = 7;
const BASE_AGILITY = 0.05; // 5%
const BASE_LUCK = 0.05; // 5%
const BASE_DEFENSE = 0.05; // 5%
const HEALTH_PER_POINT = 10;
const STRENGTH_PER_POINT = 3;
const AGILITY_PER_POINT = 0.05;
const LUCK_PER_POINT = 0.05;
const DEFENSE_PER_POINT = 0.05;

// Player Statistics
const player1Stats = {
  name: "",
  maxHealth: 100,
  health: 0,
  strength: 0,
  agility: 0,
  luck: 0,
  defense: 0,
  points: 10,
};
const player2Stats = {
  name: "",
  maxHealth: 100,
  health: 0,
  strength: 0,
  agility: 0,
  luck: 0,
  defense: 0,
  points: 10,
};

// Event Listeners
startBtn.addEventListener("click", () => {
  showSetupScreen();
});

beginBtn.addEventListener("click", () => {
  showFightingScreen();
});

nextActionButton.addEventListener("click", () => {
  calculateMove();
});

playAgainBtn.addEventListener("click", () => {
  location.reload();
});

showActionsBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Utility functions
function hideElement(el) {
  el.classList.add("hidden");
}

function showElement(el) {
  el.classList.remove("hidden");
}
function setAction(text) {
  action.innerText = text;
  actions.push(text);
}
function calculatePercentage(part, whole) {
  const percentage = (part / whole) * 100;
  return percentage + "%";
}

// Character Setup Functions
function updatePoints(player) {
  const pointsSpan =
    player === "player1" ? player1PointsSpan : player2PointsSpan;
  pointsSpan.textContent =
    player === "player1" ? player1Stats.points : player2Stats.points;
}

function updateStat(player, stat, increment) {
  const stats = player === "player1" ? player1Stats : player2Stats;

  if (!increment && stats[stat] <= 0) {
    return;
  }

  if (increment && stats.points > 0) {
    stats[stat]++;
    stats.points--;
  } else if (!increment && stats.points < 10) {
    stats[stat]--;
    stats.points++;
  }
  updatePoints(player);
  const statNumberSpan = event.target
    .closest(".stat-wrapper")
    .querySelector(".stat-number");
  statNumberSpan.textContent = stats[stat];
}

// Character Setup Event Listeners
const buttons = document.querySelectorAll(
  ".stat-button-increment, .stat-button-decrement"
);

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const player = event.target
      .closest(".character-setup__box")
      .querySelector(".character-setup__title")
      .textContent.trim();
    const statName = event.target
      .closest(".stat-wrapper")
      .querySelector(".stat-name")
      .textContent.replace(/\d+/g, "")
      .trim();
    const playerName = player === "Гладиатор 1" ? "player1" : "player2";
    const increment = event.target.classList.contains("stat-button-increment");
    switch (statName) {
      case "Здоровье":
        updateStat(playerName, "health", increment);
        break;
      case "Сила":
        updateStat(playerName, "strength", increment);
        break;
      case "Ловкость":
        updateStat(playerName, "agility", increment);
        break;
      case "Удача":
        updateStat(playerName, "luck", increment);
        break;
      case "Защита":
        updateStat(playerName, "defense", increment);
        break;
    }
  });
});

// Character Name Functions
function updateNames() {
  if (nameInput1.value.trim() === "" || nameInput2.value.trim() === "") {
    return false;
  } else {
    player1Stats.name = nameInput1.value.trim();
    player2Stats.name = nameInput2.value.trim();
    document.getElementById("player1-name").innerText = player1Stats.name;
    document.getElementById("player2-name").innerText = player2Stats.name;
    return true;
  }
}

// Fighting functionality
let player1 = {};

let player2 = {};

let currentPlayer;

function calculateMove() {
  if (isGameOver) {
    return;
  }
  const defender = currentPlayer === player1 ? player2 : player1;
  // Check if defender dodged the attack
  const dodgeChance = Math.random();
  if (dodgeChance <= defender.agility) {
    setAction(
      `${
        currentPlayer === player1 ? player2Stats.name : player1Stats.name
      } увернулся от атаки!`
    );
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    return;
  } else {
    // Calculate critical hit chance
    const criticalChance = Math.random();
    let damage = currentPlayer.strength;

    if (criticalChance < currentPlayer.luck) {
      damage *= 2.5;
      setAction(
        `${
          currentPlayer === player1 ? player1Stats.name : player2Stats.name
        } наносит критический удар!`
      );
    }
    damage *= 1 - defender.defense;
    if (currentPlayer === player1) {
      player2.health -= damage;
      document.getElementById("fastpunch").play();
      if (player2.health <= 0) {
        player2.health = 0; // Ensure health does not go below 0
      }
      setAction(
        `${player1Stats.name} нанес ${damage.toFixed(2)} урона ${
          player2Stats.name
        }!`
      );
      player2HealthBar.style.width = calculatePercentage(
        player2.health,
        player2Stats.maxHealth
      );
      player1Model.classList.add("move-right");
      setTimeout(() => {
        player1Model.classList.remove("move-right");
      }, 500);
    } else if (currentPlayer === player2) {
      player1.health -= damage;
      document.getElementById("quickhit").play();
      if (player1.health <= 0) {
        player1.health = 0; // Ensure health does not go below 0
      }
      setAction(
        `${player2Stats.name} нанес ${damage.toFixed(2)} урона ${
          player1Stats.name
        }!`
      );
      player1HealthBar.style.width = calculatePercentage(
        player1.health,
        player1Stats.maxHealth
      );
      player2Model.classList.add("move-left");
      setTimeout(() => {
        player2Model.classList.remove("move-left");
      }, 500);
    }
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    if (player1.health <= 0 || player2.health <= 0) {
      const winner =
        player1.health <= 0 ? player2Stats.name : player1Stats.name;
      setAction(`${winner} побеждает!`);
      endScreenWinner.innerText = `${winner} побеждает!`;
      isGameOver = true;
      document.getElementById("victory").play();
      setTimeout(() => {
        showEndScreen();
        showActionsInModal();
      }, 2500);
    }
  }
}

function showActionsInModal() {
  actions.forEach((action) => {
    const listItem = document.createElement("li");
    listItem.innerText = action;
    modalList.appendChild(listItem);
  });
}

// Screen Display Functions
function showSetupScreen() {
  body.classList.remove("center");
  showElement(overlayDiv);
  showElement(characterSetupScreen);
  hideElement(mainMenu);
  hideElement(fightingScreen);
  hideElement(endScreen);
}

function showFightingScreen() {
  player1 = {
    health: BASE_HEALTH + player1Stats.health * HEALTH_PER_POINT,
    strength: BASE_STRENGTH + player1Stats.strength * STRENGTH_PER_POINT,
    agility: BASE_AGILITY + player1Stats.agility * AGILITY_PER_POINT,
    luck: BASE_LUCK + player1Stats.luck * LUCK_PER_POINT,
    defense: BASE_DEFENSE + player1Stats.defense * DEFENSE_PER_POINT,
  };
  player2 = {
    health: BASE_HEALTH + player2Stats.health * HEALTH_PER_POINT,
    strength: BASE_STRENGTH + player2Stats.strength * STRENGTH_PER_POINT,
    agility: BASE_AGILITY + player2Stats.agility * AGILITY_PER_POINT,
    luck: BASE_LUCK + player2Stats.luck * LUCK_PER_POINT,
    defense: BASE_DEFENSE + player2Stats.defense * DEFENSE_PER_POINT,
  };
  currentPlayer = player1;
  player1Stats.maxHealth = player1.health;
  player2Stats.maxHealth = player2.health;
  if (!updateNames()) {
    alert("Введите имена гладиаторов.");
    return;
  }
  body.classList.remove("center");
  hideElement(overlayDiv);
  hideElement(characterSetupScreen);
  hideElement(mainMenu);
  showElement(fightingScreen);
  hideElement(endScreen);
}

function showEndScreen() {
  body.classList.remove("center");
  showElement(overlayDiv);
  hideElement(characterSetupScreen);
  hideElement(mainMenu);
  hideElement(fightingScreen);
  showElement(endScreen);
}
