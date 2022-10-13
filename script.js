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
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let rawKilometers = "76";

function convertCelsius() {
  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = rawCelsius;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  convertKilometers();
}

function convertFahrenheit() {
  let temperature = document.querySelector("#current-temp");
  temperature.innerHTML = Math.round(rawCelsius * (9 / 5) + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  convertMiles();
}

function convertMiles() {
  wind.innerHTML = Math.round(rawKilometers / 1.609344);
  speed.innerHTML = "mph";
}

function convertKilometers() {
  wind.innerHTML = rawKilometers;
  speed.innerHTML = "kph";
}

celsiusLink.addEventListener("click", convertCelsius);
fahrenheitLink.addEventListener("click", convertFahrenheit);

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
  let currentWeatherDesc = document.querySelector("#current-weather-desc");
  currentWeatherDesc.innerHTML = weatherDesc;
}

// Update geolocation name
function updateGeoName(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = `${response.data.name}`;
}

// Update humidity
function updateHumidity(response) {
  let humidity = Math.round(`${response.data.main.humidity}`);
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = humidity;
}

// Update temperature
function updateTemperature(response) {
  let currentTemp = document.querySelector("#current-temp");
  rawCelsius = Math.round(`${response.data.main.temp}`);

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
  currentIcon.setAttribute(
    "src",
    `weather-icons/${response.data.weather[0].main}.png`
  );
}
