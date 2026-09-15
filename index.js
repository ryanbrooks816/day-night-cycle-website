const hero = document.getElementById("hero");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const stars = document.getElementById("stars");
const clouds = document.getElementById("clouds");
const speedSlider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");

const backgrounds = {
  sunrise: document.getElementById("background-sunrise"),
  day: document.getElementById("background-day"),
  sunset: document.getElementById("background-sunset"),
  nightrise: document.getElementById("background-nightrise"),
  night: document.getElementById("background-night"),
  nightset: document.getElementById("background-nightset"),
};

const random = (min, max) => Math.random() * (max - min) + min;

// Stars are generated once so the scene stays stable while the sky changes.
for (let i = 0; i < 100; i += 1) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = `${random(0, 100)}%`;
  star.style.top = `${random(0, 100)}%`;
  star.style.animationDelay = `${random(-14, 0)}s`;
  stars.appendChild(star);
}

// Keep clouds in separate cells so they are spread across the sky.
const gridColumns = 4;
const gridRows = 2;
for (let column = 0; column < gridColumns; column += 1) {
  for (let row = 0; row < gridRows; row += 1) {
    if (Math.random() >= 0.4) continue;

    const cloud = document.createElement("div");
    cloud.className = `cloud cloud${Math.floor(random(1, 6))}`;
    const cellWidth = 100 / gridColumns;
    const cellHeight = 50 / gridRows;
    cloud.style.left = `${random(cellWidth * column, cellWidth * (column + 1))}%`;
    cloud.style.top = `${random(cellHeight * row, cellHeight * (row + 1))}%`;
    clouds.appendChild(cloud);
  }
}

let angle = Math.PI;
let centerX;
let centerY;
let radiusX;
let radiusY;
let lastTimestamp = 0;
let speedMultiplier = Number(speedSlider.value);

function updateSpeed() {
    speedMultiplier = Number(speedSlider.value);
    speedValue.value = `${speedMultiplier}×`;
    speedValue.textContent = `${speedMultiplier}×`;
}

function updateOrbit() {
  const { width, height } = hero.getBoundingClientRect();
  centerX = width / 2;
  centerY = height / 2;
  radiusX = centerX * 1.1;
  radiusY = centerY * 1.1;
}

function setScene(stage) {
  Object.entries(backgrounds).forEach(([name, background]) => {
    background.style.opacity = name === stage ? "1" : "0";
  });

  const isNight = stage === "nightrise" || stage === "night" || stage === "nightset";
  stars.style.opacity = isNight ? "1" : "0";
  sun.style.opacity = isNight ? "0" : "1";
  moon.style.opacity = isNight ? "1" : "0";
}

function animate(timestamp) {
    const xSun = centerX + radiusX * Math.cos(angle);
  const ySun = centerY + radiusY * Math.sin(angle);
  const xMoon = centerX + radiusX * Math.cos(angle + Math.PI);
  const yMoon = centerY + radiusY * Math.sin(angle + Math.PI);

  sun.style.left = `${xSun}px`;
  sun.style.top = `${ySun}px`;
  moon.style.left = `${xMoon}px`;
  moon.style.top = `${yMoon}px`;

  if (angle < Math.PI / 6) {
    setScene("nightrise");
  } else if (angle < (5 * Math.PI) / 6) {
    setScene("night");
  } else if (angle < Math.PI) {
    setScene("nightset");
  } else if (angle < (7 * Math.PI) / 6) {
    setScene("sunrise");
  } else if (angle < (11 * Math.PI) / 6) {
    setScene("day");
  } else {
    setScene("sunset");
  }

    const elapsedSeconds = lastTimestamp ? Math.min((timestamp - lastTimestamp) / 1000, 0.1) : 0;
    angle = (angle + 0.06 * speedMultiplier * elapsedSeconds) % (2 * Math.PI);
    lastTimestamp = timestamp;
    requestAnimationFrame(animate);
}

updateOrbit();
updateSpeed();
speedSlider.addEventListener("input", updateSpeed);
window.addEventListener("resize", updateOrbit, { passive: true });
animate();
