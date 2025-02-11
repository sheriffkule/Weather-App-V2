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
    alert('There was a problem fetching data: ' + error.message);
  }
}

const apiKey = '4ca3da810ec7ce129a86d9a6a7b0d706';

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
    })
    .catch(() => {
      //   alert('There was a problem with your request! Try again or check back later.');
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
  todaysDate.text = dateStatement;

  locationHeading.innerHTML = `${data.name}, ${data.sys.country}`;
  currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
  highTemp.innerHTML = `${Math.round(data.main.temp_max)}`;
  lowTemp.innerHTML = `${Math.round(data.main.temp_min)}`;
  feelsLikeTemp.innerHTML = `${Math.round(data.main.feels_like)}`;
  tempDescription.innerHTML = `${data.weather[0].description}`;
}
