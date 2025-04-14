const farmSize = 4;
const farm = document.getElementById('farm');
const plotStates = Array(farmSize).fill('empty');
const growTimers = Array(farmSize).fill(null);

let carrots = 0;
let coins = 0;

function renderFarm() {
  farm.innerHTML = '';
  plotStates.forEach((state, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (state === 'empty') {
      cell.style.backgroundImage = "url('img/soil.png')";
    } else if (state === 'planted') {
      cell.style.backgroundImage = "url('img/sprout.png')";
    } else if (state === 'ready') {
      cell.style.backgroundImage = "url('img/carrot.png')";
    }
    cell.onclick = () => handleClick(index);
    farm.appendChild(cell);
  });
  updateStatus();
}

function handleClick(index) {
  const state = plotStates[index];
  if (state === 'empty') {
    plotStates[index] = 'planted';
    growTimers[index] = setTimeout(() => {
      plotStates[index] = 'ready';
      renderFarm();
    }, 8000); // 8 секунд
  } else if (state === 'ready') {
    carrots++;
    plotStates[index] = 'empty';
  }
  renderFarm();
}

function updateStatus() {
  document.getElementById('carrots').innerText = carrots;
  document.getElementById('coins').innerText = coins;
  document.getElementById('carrotsShop').innerText = carrots;
}

function openShop() {
  document.getElementById('shopModal').style.display = 'block';
  updateStatus();
}

function closeShop() {
  document.getElementById('shopModal').style.display = 'none';
}

function sellCarrot() {
  if (carrots > 0) {
    carrots--;
    coins += 5;
    updateStatus();
    renderFarm();
  } else {
    alert('Немає моркви для продажу!');
  }
}

renderFarm();