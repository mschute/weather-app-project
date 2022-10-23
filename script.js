// Display current date and time
let now = new Date();

day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentDay = now.getDay();
let currentHour = now.getHours();
let currentMinute = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

function updateDayAndTime() {
  let dayTime = document.querySelector("#day-time");
  dayTime.innerHTML = `${day[currentDay]} ${currentHour}:${currentMinute}`;
}

updateDayAndTime();

// Toggle Celsius and Fahrenheit
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let rawCelsius = "";
let rawKilometers = "";
let rawCelsiusLowForecast = ["", "", "", "", ""];
let rawCelsiusHighForecast = ["", "", "", "", ""];

function convertCelsius() {
  let temperature = document.querySelector("#current-temp");
  if (rawCelsius != "") {
    temperature.innerHTML = rawCelsius;
  }
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  convertKilometers();
  convertForecastLowCelsius();
  convertForecastHighCelsius();
}

function convertKilometers() {
  if (rawKilometers != "") {
    wind.innerHTML = rawKilometers;
  }
  speed.innerHTML = "kph";
}

function convertForecastLowCelsius() {
  for (let i = 0; i < 5; i++) {
    let forecastLowTemp = document.querySelector(`#forecast-day-${[i]}-low`);
    if (rawCelsiusLowForecast[i] != "") {
      forecastLowTemp.innerHTML = rawCelsiusLowForecast[i];
    }
  }
}

function convertForecastHighCelsius() {
  for (let i = 0; i < 5; i++) {
    let forecastHighTemp = document.querySelector(`#forecast-day-${[i]}-high`);
    if (rawCelsiusHighForecast[i] != "") {
      forecastHighTemp.innerHTML = rawCelsiusHighForecast[i];
    }
  }
}

function convertFahrenheit() {
  let temperature = document.querySelector("#current-temp");
  if (rawCelsius != "") {
    temperature.innerHTML = Math.round(rawCelsius * (9 / 5) + 32);
  }
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  convertMiles();
  convertForecastLowFahrenheit();
  convertForecastHighFahrenheit();
}

function convertMiles() {
  if (rawKilometers != "") {
    wind.innerHTML = Math.round(rawKilometers / 1.609344);
  }
  speed.innerHTML = "mph";
}

function convertForecastLowFahrenheit() {
  for (let i = 0; i < 5; i++) {
    let forecastLowTemp = document.querySelector(`#forecast-day-${[i]}-low`);
    if (rawCelsiusLowForecast[i] != "") {
      forecastLowTemp.innerHTML = Math.round(
        rawCelsiusLowForecast[i] * (9 / 5) + 32
      );
    }
  }
}

function convertForecastHighFahrenheit() {
  for (let i = 0; i < 5; i++) {
    let forecastHighTemp = document.querySelector(`#forecast-day-${[i]}-high`);
    if (rawCelsiusHighForecast[i] != "") {
      forecastHighTemp.innerHTML = Math.round(
        rawCelsiusHighForecast[i] * (9 / 5) + 32
      );
    }
  }
}

celsiusLink.addEventListener("click", convertCelsius);
fahrenheitLink.addEventListener("click", convertFahrenheit);

// Get city with form
let newCity = "";
let searchForm = document.querySelector("#search-field");
let searchButton = document.querySelector(".search-button");

function onSearchCity(event) {
  event.preventDefault();
  newCity = `${city.value.trim()}`;
  searchForm.city.value = "";
  setWeatherApi();
  setWeatherForecastApi();
}

searchForm.addEventListener("submit", onSearchCity);

// Set values for weather API
let currentWeatherApiEndpoint = "https://api.shecodes.io/weather/v1/current?";
let forecastWeatherApiEndpoint = "https://api.shecodes.io/weather/v1/forecast?";
let apiKey = "f4ff5751e00t63c15a8eb8eo1612abfe";
let unit = "metric";

// API for current weather city search
function setWeatherApi() {
  disableButtons(true);
  if (newCity === undefined || newCity.length < 1) {
    alert("Error, please enter a city to continue");
    disableButtons(false);
  } else {
    let apiUrl = `${currentWeatherApiEndpoint}query=${newCity}&key=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then((response) => {
      updateDisplays(response);
      disableButtons(false);
    });
  }
}

// API for forecast city search
function setWeatherForecastApi() {
  let apiUrl = `${forecastWeatherApiEndpoint}query=${newCity}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then((response) => {
    updateForecastDisplays(response);
  });
}

// Get Geolocation position with button
let lat = "";
let lon = "";
let currentLocationButton = document.querySelector("#current-location-button");

function onGeolocationButton() {
  disableButtons(true);
  setPlaceholderText("Searching...");
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  setGeoWeatherApi();
  setGeoWeatherForecastApi();
  disableButtons(false);
}

currentLocationButton.addEventListener("click", onGeolocationButton);

// Supplementary actions during search
function setPlaceholderText(text) {
  document.getElementById("city").setAttribute("placeholder", text);
}

function disableButtons(disable) {
  searchButton.disabled = disable;
  currentLocationButton.disabled = disable;
}

// API for current weather geolocation
function setGeoWeatherApi() {
  let apiUrl = `${currentWeatherApiEndpoint}lon=${lon}&lat=${lat}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(updateDisplays);
  setPlaceholderText("Enter a city...");
}

// API for forecast geolocation
function setGeoWeatherForecastApi() {
  let apiUrl = `${forecastWeatherApiEndpoint}lon=${lon}&lat=${lat}&key=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then((response) => {
    updateForecastDisplays(response);
  });
}

// Update visible data
function updateDisplays(response) {
  updateCity(response);
  updateDesc(response);
  updateHumidity(response);
  updateTemperature(response);
  updateWind(response);
  updateIcon(response);
}

// Update city name
function updateCity(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML =
    `${response.data.city}, ` + `${response.data.country}`;
}

// Update description
function updateDesc(response) {
  let weatherDesc = `${response.data.condition.description}`;
  let currentWeatherDesc = document.querySelector("#current-weather-desc");
  currentWeatherDesc.innerHTML = weatherDesc;
}

// Update humidity
function updateHumidity(response) {
  let humidity = Math.round(`${response.data.temperature.humidity}`);
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = humidity;
}

// Update temperature
function updateTemperature(response) {
  let currentTemp = document.querySelector("#current-temp");
  rawCelsius = Math.round(`${response.data.temperature.current}`);
  if (celsiusLink.classList.value === "active") {
    currentTemp.innerHTML = rawCelsius;
  } else {
    convertFahrenheit();
  }
}

// Update wind
function updateWind(response) {
  let currentWind = document.querySelector("#wind");
  rawKilometers = Math.round(`${response.data.wind.speed}` * 3.6);
  if (celsiusLink.classList.value === "active") {
    currentWind.innerHTML = rawKilometers;
  } else {
    convertMiles();
  }
}

// Update icon
function updateIcon(response) {
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute("src", `${response.data.condition.icon_url}`);
}

// Add 5 day forecast
function displayForecast() {
  let forecastContainer = document.querySelector("#forecast");
  let forecastHtml = ``;

  for (let i = 1; i <= 5; i++) {
    let forecastClass = i % 2 === 0 ? "even" : "odd";

    forecastHtml += `<div class="col forecast-day ${forecastClass}">
      <div class="day">${day[(currentDay + i) % 7]}</div>
      <div class="icon" id="forecast-day-${[i] - 1}-icon">–</div>
      <div class="temp">
        <span class="low" id="forecast-day-${[i] - 1}-low">
        –</span><span class="low">°</span>
        </span>
        /
        <span class="high" id="forecast-day-${[i] - 1}-high">
        –</span><span class="high">°</span>
        </span>
      </div>
    </div>`;

    forecastContainer.innerHTML = forecastHtml;
  }
}

displayForecast();

//Update visible forecast data
function updateForecastDisplays(response) {
  updateForecastIcons(response);
  updateForecastLowTemp(response);
  updateForecastHighTemp(response);
}

//Update forecast icons
function updateForecastIcons(response) {
  for (let i = 0; i < 5; i++) {
    let forecastIcon = document.querySelector(`#forecast-day-${[i]}-icon`);
    forecastIcon.innerHTML = "";
    forecastIcon.innerHTML += `<img src="${response.data.daily[i].condition.icon_url}" />`;
  }
}

//Update forecast low temperature
function updateForecastLowTemp(response) {
  for (let i = 0; i < 5; i++) {
    let forecastLowTemp = document.querySelector(`#forecast-day-${[i]}-low`);
    rawCelsiusLowForecast[i] = Math.round(
      `${response.data.daily[i].temperature.minimum}`
    );
    if (celsiusLink.classList.value === "active") {
      forecastLowTemp.innerHTML = rawCelsiusLowForecast[i];
    } else {
      convertForecastLowFahrenheit();
    }
  }
}

//Update forecast high temperature
function updateForecastHighTemp(response) {
  for (let i = 0; i < 5; i++) {
    let forecastHighTemp = document.querySelector(`#forecast-day-${[i]}-high`);
    rawCelsiusHighForecast[i] = Math.round(
      `${response.data.daily[i].temperature.maximum}`
    );
    if (celsiusLink.classList.value === "active") {
      forecastHighTemp.innerHTML = rawCelsiusHighForecast[i];
    } else {
      convertForecastHighFahrenheit();
    }
  }
}
