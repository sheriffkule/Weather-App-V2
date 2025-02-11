const darkLight = document.getElementById('darkLight');
darkLight.addEventListener('click', changeTheme);

const userTheme = localStorage.getItem('theme');

if (userTheme === 'dark') {
  darkLight.click();
}

function changeTheme() {
  document.querySelector('body').classList.toggle('dark');
  if (document.querySelector('body').classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    // alert('There was a problem fetching data: ' + error.message);
  }
}

const apiKey = '666c33e9fb9d2d9a1c1f29f89d7a3722';

const apiWeather = 'https://api.openweathermap.org/data/2.5/weather';

let units = 'imperial';

const locationHeading = document.getElementById('location');

const allTemps = document.querySelectorAll('#temp-now, .temps');
const fahrenheit = document.querySelectorAll('.fahrenheit');
const celsius = document.querySelector('.celsius');
const windUnit = document.querySelector('#wind-unit');
const currentTemp = document.querySelector('#temp-now');
const highTemp = document.querySelector('#high-temp');
const lowTemp = document.querySelector('#low-temp');
const feelsLikeTemp = document.querySelector('#feels-like');
const tempDescription = document.querySelector('#description-temp');
const weatherTypeDesc = document.querySelector('#weather-type-desc');
const todaysDate = document.getElementById('today');

const visibility = document.querySelector('#visibility');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const clouds = document.querySelector('#clouds');

const userLocation = localStorage.getItem('location');

if (userLocation) {
  updateWeatherByName(userLocation);
} else {
  updateWeatherByName('CHICAGO');
}

function updateWeatherByName(location) {
  fetchData(`${apiWeather}?q=${location}&appid=${apiKey}&units=${units}`)
    .then((data) => {
      displayCurrentTemperature(data);
      getFiveDayForecast(location);
    })
    .catch(() => {
        alert('There was a problem with your request! Try again or check back later.');
    });
}

function searchCity(event) {
  event.preventDefault();
  const searchInput = document.querySelector('#search-input').value;
  if (searchInput) {
    updateWeatherByName(searchInput);
  }
}

const searchBtn = document.querySelector('.search-bar');
searchBtn.addEventListener('submit', searchCity);

function toggleTemp(event) {
  event.preventDefault();
  if (celsius.innerHTML === 'C') {
    celsius.innerHTML = 'F';
    fahrenheit.forEach((el) => (el.innerHTML = 'C'));
    allTemps.forEach(
      (el) => (el.textContent = Math.round((el.innerHTML - 32) * (5 / 9)))
    );
    windUnit.innerHTML = 'km/h';
    units = 'metric';
  } else if (celsius.innerHTML === 'F') {
    celsius.innerHTML = 'C';
    fahrenheit.forEach((el) => (el.innerHTML = 'F'));
    allTemps.forEach((el) => (el.textContent = Math.round(el.innerHTML * (9 / 5) + 32)));
    windUnit.innerHTML = 'mph';
    units = 'imperial';
  }
  updateWeatherByName(locationHeading.textContent);
}

celsius.addEventListener('click', toggleTemp);

function displayCurrentTemperature(data) {
  if (!data) return;
  const apiSunrise = data.syn.sunrise * 1000;
  const apiSunset = data.sys.sunset * 1000;

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  // sunrise.innerHTML = localDate(apiSunrise).toLocaleString([], options);
  // sunset.innerHTML = localDate(apiSunset).toLocaleString([], options);

  function localDate(unix) {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const utc = unix + offset;
    return new Date(utc + 1000 * data.timezone);
  }

  const today = new Date();
  const localToday = today.getTime();
  const dateStatement = `${localDate(localToday).toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })} at ${localDate(localToday).toLocaleString([], options)}`;
  todaysDate.innerHTML = dateStatement;

  locationHeading.innerHTML = `${data.name}, ${data.sys.country}`;
  currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
  highTemp.innerHTML = `${Math.round(data.main.temp_max)}`;
  lowTemp.innerHTML = `${Math.round(data.main.temp_min)}`;
  feelsLikeTemp.innerHTML = `${Math.round(data.main.feels_like)}`;
  tempDescription.innerHTML = `${data.weather[0].description}`;
  visibility.innerHTML = `${Math.round(data.visibility / 1000)}`;
  wind.innerHTML = `${Math.round(data.wind.speed)}`;
  humidity.innerHTML = `${Math.round(data.main.humidity)}`;
  clouds.innerHTML = `${Math.round(data.clouds.all)}`;

  updateIcon(data);

  const weatherType = data.weather[0].main;
  if (['Rain', 'Drizzle', 'Clouds'].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-umbrella"></i> Raincoats/Umbrella needed`;
  } else if (['Thunderstorm', 'Tornado'].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-cloud-bolt"></i> Stay @ home`;
  } else if (weatherType === 'Snow') {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-snowflake"></i> Wear warm clothes`;
  } else if (weatherType === 'Clear') {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-cloud-sun"></i> Enjoy the sunshine`;
  } else if (['Mist', 'Fog', 'Haze'].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Poor visibility`;
  } else {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Poor Air Quality`;
  }
  localStorage.setItem('location', '${data.name');
}

function updateIcon(data) {
  if (!data || !data.weather || !data.weather[0]) return;

  const weatherIconCode = data.weather[0].icon;

  const mainWeatherIcon = document.querySelector('.default-main-icon');

  const iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

  mainWeatherIcon.setAttribute('src', iconUrl);
  mainWeatherIcon.setAttribute('alt', data.weather[0].description);
}

function getFiveDayForecast(location) {
  const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=&{units}`;

  fetchData(forecastApi)
    .then((data) => displayFiveDaysForecast(data))
    .catch(() => {
      alert('Unable to fetch 5-days forecast.');
    });
}

function displayFiveDaysForecast(data) {
  const forecastGrid = document.querySelector('.forecast-grid');
  forecastGrid.innerHTML = '';

  const dailyForecast = [];

  data.list.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
      weekday: 'long',
    });

    if (!dailyForecast[date]) {
      dailyForecast[date] = item;
    }
  });

  Object.values(dailyForecast).forEach((forecast) => {
    const day = new Date(forecast.dt_txt).toLocaleDateString('en-US', {
        weekday: 'long',
    });

    const temp = Math.round(forecast.main.tmp);
    const description = forecast.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');

    forecastCard.innerHTML = `
    <div class="forecast-day">${day}</div>
    <img "src=${iconUrl}" alt="${description}">
    <br>
    <span class="forecast-temp temp">${temp}</span> &deg;
    <div class="forecast-desc">${description}</div>
    `;

    forecastGrid.appendChild(forecastCard);
  })
}
