const API_KEY = "d1b268b3ec0ab5153665dd631815d58a"; 

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const logBox = document.getElementById("log");
const historyBox = document.getElementById("history");

function log(msg) {
  logBox.textContent += msg + "\n";
}

function formatCity(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function saveHistory(city) {
  let arr = JSON.parse(localStorage.getItem("cities")) || [];
  city = formatCity(city);

  if (!arr.includes(city)) arr.push(city);
  localStorage.setItem("cities", JSON.stringify(arr));
  renderHistory();
}

function renderHistory() {
  historyBox.innerHTML = "";
  let arr = JSON.parse(localStorage.getItem("cities")) || [];

  arr.forEach(c => {
    let div = document.createElement("div");
    div.textContent = c;
    div.className = "historyItem";
    div.onclick = () => fetchWeather(c);
    historyBox.appendChild(div);
  });
}

async function fetchWeather(city) {
  log("1 Sync Start");

  // async start
  log("3 [ASYNC] Start fetching");

  // microtask
  Promise.resolve().then(() => {
    log("4 Promise.then (Microtask)");
  });

  // macrotask
  setTimeout(() => {
    log("5 setTimeout (Macrotask)");
  }, 0);

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    weatherResult.innerHTML = `
      <div class="weatherRow">
        <span class="weatherLabel">City</span>
        <span class="weatherValue">${data.name}, ${data.sys.country}</span>
      </div>
      <div class="weatherRow">
        <span class="weatherLabel">Temp</span>
        <span class="weatherValue" id="wTemp">${data.main.temp} °C</span>
      </div>
      <div class="weatherRow">
        <span class="weatherLabel">Weather</span>
        <span class="weatherValue">${data.weather[0].main}</span>
      </div>
      <div class="weatherRow">
        <span class="weatherLabel">Humidity</span>
        <span class="weatherValue">${data.main.humidity}%</span>
      </div>
      <div class="weatherRow">
        <span class="weatherLabel">Wind</span>
        <span class="weatherValue">${data.wind.speed} m/s</span>
      </div>
    `;

    saveHistory(city);
  } catch (err) {
    weatherResult.innerHTML = `<strong><p style="color:red">City not found 😓</p></strong`;
    log("[Error] " + err.message);
  }

  log("2 Sync End");
}

searchBtn.onclick = () => {
  logBox.textContent = "";
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
};

renderHistory();