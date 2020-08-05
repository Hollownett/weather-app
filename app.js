const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const weekList = document.querySelector(".week-list");
const currentDate = document.querySelector(".current-date");
const weather = {};

weather.temperature = {
  unit: "celsius",
};
weather.days = [
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
  {
    date: "",
    temperature: "",
    description: "",
    iconId: "",
  },
];
//Date optopns
const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
// for convert to celsius
const KELVIN = 273;
//app key
const key = "a35ddb4c8b62f4433d306bafcbd751d1";

//Check if browser supprts gelocaton
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser dosen`t support Geolocation </p>";
}

//set user`s position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

//Show error when there is an issue with geolocation
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

//get weather
function getWeather(latitude, longitude) {
  let apiCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  let apiDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
  exclude={part}&appid=${key}
  `;
  //get cuurrent Weather
  fetch(apiCurrent)
    .then((response) => {
      let data = response.json();
      console.log(data);
      return data;
    })
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.date = new Date(data.dt * 1000).toLocaleString("en-En", options);
    })
    .then(() => {
      displayToDayWeather();
    });

  //get 7 days forecast
  fetch(apiDaily)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      for (let i = 0; i < data.daily.length; i++) {
        weather.days[i].temperature = Math.floor(
          data.daily[i].temp.eve - KELVIN
        );
        weather.days[i].description = data.daily[i].weather[0].description;
        weather.days[i].iconId = data.daily[i].weather[0].icon;
        weather.days[i].date = new Date(data.daily[i].dt * 1000).toLocaleString(
          "en-En",
          options
        );
      }
      console.log(weather.days);
    })
    .then(() => {
      displayDailyForecastWeather();
    });
}

//Display weatger to UI

function displayToDayWeather() {
  currentDate.innerHTML = `${weather.date}`;
  descElement.innerHTML = `${weather.description}`;
  locationElement.innerHTML = `${weather.city},  ${weather.country}`;
  tempElement.innerHTML = ` <p>${weather.temperature.value}<span>℃</span></p>`;
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="weather-icon" />`;
}
//Dixplay 5 dayis forecast

function displayDailyForecastWeather() {
  weather.days.forEach((day) => {
    const position = "beforeend";
    let weekDay = `<li class="flex-item">
    <div class="daily-date"> ${day.date}</div>
         <div class="weather-icon">
           <img src="icons/${day.iconId}.png" alt="weather-icon" />
         </div>
         <div class="temperature-value">
           <p>
             ${day.temperature}
             <span>℃</span>
           </p>
         </div>
         <div class="temperature-description"><p>${day.description}</p></div>
       </li>`;
    weekList.insertAdjacentHTML(position, weekDay);
  });
}
//C to F convetion

function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

//Convert temperature by click elem
tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit === "celsius") {
    let farenheit = Math.floor(celsiusToFahrenheit(weather.temperature.value));
    tempElement.innerHTML = ` <p>${farenheit}<span>°F</span></p>`;
    weather.temperature.unit = "farenheit";
  } else {
    tempElement.innerHTML = ` <p>${weather.temperature.value}<span>°C</span></p>`;
    weather.temperature.unit = "celsius";
  }
});
