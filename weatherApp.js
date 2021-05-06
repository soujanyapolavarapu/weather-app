"use strict";

//This is for before page is loading it should wait for 2 seconds.

let load_screen = document.getElementById("load_screen");

function loadingText() {
  setTimeout(function () {
    load_screen.parentElement.removeChild(load_screen);
  }, 2000);
}
window.addEventListener("load", loadingText);

const userInput = document.getElementById("userInput");
const userButton = document.getElementById("userButton");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather_icon");
const wind = document.getElementById("wind");
const cloudy = document.getElementById("cloudy");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const h2 = document.getElementById("h2");
const locationButton = document.getElementById("locationButton");
const co_ordinates = document.getElementById("co-ordinates");
const locationMap = document.getElementById("map");
let weatherUrl;
let cityName;
let lat;
let lon;
let map;

function getWeather() {
  //  console.log('weatherUrl ' + weatherUrl);
  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      h2.textContent = "";
      if (data.cod === "404") {
        //weatherinfo will hidden,If any previous info exist(hiding the information).
        city.style.visibility = "hidden";
        temperature.style.visibility = "hidden";
        weatherIcon.style.visibility = "hidden";
        wind.style.visibility = "hidden";
        cloudy.style.visibility = "hidden";
        sunrise.style.visibility = "hidden";
        sunset.style.visibility = "hidden";
        co_ordinates.style.visibility = "hidden";
        h2.textContent = `Entered '${userInput.value}' ${data.message}`;
      } else {
        //weatherinfo will visible without loading the page after hidden
        city.style.visibility = "visible";
        temperature.style.visibility = "visible";
        weatherIcon.style.visibility = "visible";
        wind.style.visibility = "visible";
        cloudy.style.visibility = "visible";
        sunrise.style.visibility = "visible";
        sunset.style.visibility = "visible";
        co_ordinates.style.visibility = "visible";
        city.textContent = data.name;
        const actualTemp = data.main.temp - 273.15;
        //  console.log(actuaTemp);
        temperature.textContent = `Temperature: ${actualTemp.toFixed(0)}°C`;
        cloudy.textContent = `${data.weather[0].description}`;
        wind.textContent = `Wind speed:${data.wind.speed}m/s`;
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIcon.style.height = "100px";
        const sunriseInSeconds = data.sys.sunrise * 1000;
        const sunsetInSeconds = data.sys.sunset * 1000;
        const sunriseDate = new Date(sunriseInSeconds);
        const sunsetDate = new Date(sunsetInSeconds);
        sunrise.textContent = `SunRise:${sunriseDate.toLocaleTimeString()}`;
        sunset.textContent = `SunSet:${sunsetDate.toLocaleTimeString()}`;
        //for map
        co_ordinates.textContent =
          "Latitude: " + data.coord.lat + " , Longitude: " + data.coord.lon;
      }
    })
    .catch((err) => {
      console.log("srr" + err);
    });
}

function getCurrentWeatherByCityName() {
  h2.textContent = "";
  const cityName = userInput.value;
  localStorage.setItem("storedCityName", cityName);
  //  console.log('storedCityName: ' + storedCityName);
  if (cityName === "") {
    h2.textContent = "Please enter city Name";
  } else {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=a475908923b60eeeafd3fd4ce054d90e`;
    getWeather();
  }
}

function currentPositionWeatherByLocation() {
  let latitude;
  let longitude;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function showPosition(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      co_ordinates.innerHTML =
        "Latitude: " +
        position.coords.latitude +
        "<br>Longitude: " +
        position.coords.longitude;
      map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: 8,
        /*const map = new google.maps.Map(document.getElementById("map")), {
            center: { lat: position.coords.latitude, lon: position.coords.longitude   },
            zoom: 8,*/
      });
      weatherUrl = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=1&appid=a475908923b60eeeafd3fd4ce054d90e`;

      fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          city.textContent = data.list[0].name;
          const actualTemp1 = data.list[0].main.temp - 273.15;
          temperature.textContent = `Temperature: ${actualTemp1.toFixed(0)}°C`;
          cloudy.textContent = `${data.list[0].weather[0].description}`;
          wind.textContent = `Wind speed:${data.list[0].wind.speed}m/s`;
          // locationMap.setCenter(center);
          weatherIcon.setAttribute =
            ("src",
            `http://openweathermap.org/img/wn/${data.list[0].wind.icon}@2x.png`);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    h2.textContent = "cannot access your location";
  }
}

function storageData() {
  let storedData = localStorage.getItem("storedCityName");
  if (storedData) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${storedData}&appid=a475908923b60eeeafd3fd4ce054d90e`;
    getWeather();
  }
}

userButton.addEventListener("click", getCurrentWeatherByCityName);
locationButton.addEventListener("click", currentPositionWeatherByLocation);
window.addEventListener("load", storageData);
