const farmSize = 4;
const farm = document.getElementById('farm');
const plotStates = Array(farmSize).fill().map(() => ({ state: 'empty', plantedAt: null }));

let carrots = 0;
let coins = 0;
let level = 1;
let xp = 0;
let xpToNext = 10;

function updateUI() {
  document.getElementById("carrots").innerText = carrots;
  document.getElementById("coins").innerText = coins;
  document.getElementById("level").innerText = level;
  document.getElementById("xp").innerText = xp;
  document.getElementById("xpMax").innerText = xpToNext;
}

function handleClick(index) {
  const plot = plotStates[index];

  if (plot.state === 'empty') {
    plot.state = 'planted';
    plot.plantedAt = Date.now();
  } else if (plot.state === 'ready') {
    carrots++;
    gainXP(3);
    plot.state = 'empty';
    plot.plantedAt = null;
  }

  updateUI();
  saveGame();
  renderFarm();
}

function gainXP(amount) {
  xp += amount;
  if (xp >= xpToNext) {
    level++;
    xp -= xpToNext;
    xpToNext = Math.floor(xpToNext * 1.5);
    alert("Вітаємо! Новий рівень: " + level);
  }
  updateUI();
}

function renderFarm() {
  const now = Date.now();
  farm.innerHTML = '';
  plotStates.forEach((plot, index) => {
    // Перевірка чи вже виросло
    if (plot.state === 'planted' && now - plot.plantedAt >= 8000) {
      plot.state = 'ready';
      plot.plantedAt = null;
    }

    const cell = document.createElement('div');
    cell.className = 'cell';

    if (plot.state === 'empty') {
      cell.style.backgroundImage = "url('img/soil.png')";
    } else if (plot.state === 'planted') {
      cell.style.backgroundImage = "url('img/sprout.png')";
    } else if (plot.state === 'ready') {
      cell.style.backgroundImage = "url('img/carrot.png')";
    }

    cell.onclick = () => handleClick(index);
    farm.appendChild(cell);
  });

  updateUI();
}

function openShop() {
  document.getElementById("shopModal").style.display = "block";
  updateUI();
}

function closeShop() {
  document.getElementById("shopModal").style.display = "none";
}

function sellCarrot() {
  if (carrots > 0) {
    carrots--;
    coins += 5;
    updateUI();
    renderFarm();
  } else {
    alert('Немає моркви для продажу!');
  }
}

function saveGame() {
  const gameData = {
    carrots,
    coins,
    level,
    xp,
    xpToNext,
    plotStates
  };
  localStorage.setItem("minifarm-save", JSON.stringify(gameData));
}

function loadGame() {
  const saved = localStorage.getItem("minifarm-save");
  if (saved) {
    const data = JSON.parse(saved);
    carrots = data.carrots;
    coins = data.coins;
    level = data.level;
    xp = data.xp;
    xpToNext = data.xpToNext;

    for (let i = 0; i < farmSize; i++) {
      if (data.plotStates[i]) {
        plotStates[i] = data.plotStates[i];
      }
    }
  }
}

loadGame();
renderFarm();
updateUI();

setInterval(() => {
  renderFarm();
}, 1000);  // Перевірка стану грядок щосекунди