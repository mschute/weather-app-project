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
let rawCelsius = "20";

function convertCelsius() {
  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = rawCelsius;
  convertCelsiusStyle();
}

function convertCelsiusStyle() {
  let celsius = document.querySelector("#celsius-link");
  let fahrenheit = document.querySelector("#fahrenheit-link");
  celsius.style.fontWeight = "600";
  fahrenheit.style.fontWeight = "300";
}

function convertFahrenheit() {
  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = Math.round(rawCelsius * (9 / 5) + 32);
  convertFahrenheitStyle();
}

function convertFahrenheitStyle() {
  let celsius = document.querySelector("#celsius-link");
  let fahrenheit = document.querySelector("#fahrenheit-link");
  celsius.style.fontWeight = "300";
  fahrenheit.style.fontWeight = "600";
}

document
  .querySelector("#celsius-link")
  .addEventListener("click", convertCelsius);
document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", convertFahrenheit);

// Get city with form
let newCity = "";
let searchButton = document.querySelector(".search");

function onSearchCity(event) {
  event.preventDefault();
  newCity = `${city.value.trim()}`;
  setWeatherApi();
}

searchButton.addEventListener("submit", onSearchCity);

// Get Geolocation position
let lat = "";
let lon = "";
let currentLocationButton = document.querySelector("#current-location-button");

function onGeolocationButton() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  setGeoWeatherApi();
}

currentLocationButton.addEventListener("click", onGeolocationButton);

// Set values for API
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
let apiKey = "894a2e7aa7f46eeca5d8778f6faa5a5b";
let limit = 1;
let unit = "metric";

// API for city
function setWeatherApi() {
  if (newCity === undefined || newCity.length < 1) {
    alert("Error, please enter a city to continue");
  } else {
    let apiUrl = `${apiEndpoint}q=${newCity}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(updateDisplays);
  }
}

// API for geolocation
function setGeoWeatherApi() {
  let apiUrl = `${apiEndpoint}lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(updateDisplays);
}

// Update visible data
function updateDisplays(response) {
  updateCity();
  updateDesc(response);
  updateGeoName(response);
  updateHumidity(response);
  updateTemperature(response);
  updateWind(response);
  updateIcon(response);
}

// Update city name
function updateCity() {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = `${city.value.trim()}`;
}

// Update description
function updateDesc(response) {
  let weatherDesc = `${response.data.weather[0].description}`;
  let nowWeatherDesc = document.querySelector("#current-weather-desc");
  nowWeatherDesc.innerHTML = weatherDesc;
}

// Update geolocation name
function updateGeoName(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = `${response.data.name}`;
}

// Update humidity
function updateHumidity(response) {
  let humidity = Math.round(`${response.data.main.humidity}`);
  let nowHumidity = document.querySelector("#humidity");
  nowHumidity.innerHTML = humidity;
}

// Update temperature
function updateTemperature(response) {
  let temp = Math.round(`${response.data.main.temp}`);
  let nowTemp = document.querySelector("#current-temp");
  nowTemp.innerHTML = temp;
}

// Update wind
function updateWind(response) {
  let wind = Math.round((`${response.data.wind.speed}` * 3600) / 1000);
  let nowWind = document.querySelector("#wind");
  nowWind.innerHTML = wind;
}

// Update icon
function updateIcon(response) {
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute(
    "src",
    `weather-icons/${response.data.weather[0].main}.png`
  );
}
