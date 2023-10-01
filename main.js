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
const player1HealthPar = document.getElementById("health-bar-1");
const player2HealthPar = document.getElementById("health-bar-2");

// State
let isGameOver = false;

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
const DEFENSE_PER_POINT = -0.05;

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

// Utility functions
function hideElement(el) {
  el.classList.add("hidden");
}

function showElement(el) {
  el.classList.remove("hidden");
}
function setAction(text) {
  action.innerText = text;
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
  } else if (!increment && stats.points > 0) {
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
    console.log(increment);
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
  if (dodgeChance <= currentPlayer.agility) {
    setAction(
      `${
        currentPlayer === player1 ? player2Stats.name : player1Stats.name
      } dodged the attack`
    );
  } else {
    // Calculate critical hit chance
    const criticalChance = Math.random();
    let damage = currentPlayer.strength;

    if (criticalChance < currentPlayer.luck) {
      damage *= 2.5;
    }
    damage *= 1 - defender.defense;
    if (currentPlayer === player1) {
      player2.health -= damage;
      if (player2.health <= 0) {
        player2.health = 0; // Ensure health does not go below 0
      }
      setAction(
        `${player1Stats.name} dealt ${damage.toFixed(2)} damage to ${
          player2Stats.name
        }`
      );
      player2HealthPar.style.width = calculatePercentage(
        player2.health,
        player2Stats.maxHealth
      );
    } else if (currentPlayer === player2) {
      player1.health -= damage;
      if (player1.health <= 0) {
        player1.health = 0; // Ensure health does not go below 0
      }
      setAction(
        `${player2Stats.name} dealt ${damage.toFixed(2)} damage to ${
          player1Stats.name
        }!`
      );
      player1HealthPar.style.width = calculatePercentage(
        player1.health,
        player1Stats.maxHealth
      );
    }
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    if (player1.health <= 0 || player2.health <= 0) {
      const winner =
        player1.health <= 0 ? player2Stats.name : player1Stats.name;
      setAction(`${winner} wins the game!`);
      isGameOver = true;
    }
  }
}

// Screen Display Functions
function showSetupScreen() {
  body.classList.remove("center");
  showElement(overlayDiv);
  showElement(characterSetupScreen);
  hideElement(mainMenu);
  hideElement(fightingScreen);
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
}
