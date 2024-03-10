const apiKey = '3440f614ff85e77674c9bf2020c169af'; // Replace with your actual API key
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/';
const units = 'imperial'; // Use 'imperial' for Fahrenheit

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');

cityForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const cityName = cityInput.value.trim();
  getWeatherData(cityName);
  cityInput.value = '';
});

function getWeatherData(cityName) {
  // Use the OpenWeatherMap API to fetch weather data
  fetch(`${weatherApiUrl}weather?q=${cityName}&units=${units}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addCityToSearchHistory(cityName);
      return fetch(`${weatherApiUrl}forecast?q=${cityName}&units=${units}&appid=${apiKey}`);
    })
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.error('Error fetching weather data:', error));
};

function displayCurrentWeather(data) {
  // Display current weather information in the specified container

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  currentWeatherContainer.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p> ${new Date(data.dt * 1000).toLocaleDateString()}</p>
    <img src="${iconUrl}" alt="Weather Icon"> <!-- Display weather icon -->
    <p>Temperature: ${data.main.temp} °F</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
};


function displayForecast(data) {
    const uniqueDates = [...new Set(data.list.map(item => new Date(item.dt * 1000).toLocaleDateString()))];
  
    // Display 5-day forecast information in the specified container
    const forecastItems = uniqueDates.slice(0, 5).map(date => {
      const dayForecasts = data.list.filter(item => new Date(item.dt * 1000).toLocaleDateString() === date);
      const dayForecast = dayForecasts[0]; // Use the first entry of the day
  
      // Get the first weather condition icon code
      const iconCode = dayForecast.weather[0].icon;
  
      return `
        <div class="forecast-item">
          <p> ${date}</p>
          <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
          <div class="forecast-info">
            <p>Temperature: ${dayForecast.main.temp} °F</p>
            <p>Humidity: ${dayForecast.main.humidity}%</p>
            <p>Wind Speed: ${dayForecast.wind.speed} m/s</p>
          </div>
        </div>
      `;
    }).join('');
  
    forecastContainer.innerHTML = forecastItems;
  }


function addCityToSearchHistory(cityName) {
  // Add the city to the search history container
  const historyItem = document.createElement('div');
  historyItem.classList.add('history-item');
  historyItem.textContent = cityName;
  historyItem.addEventListener('click', () => getWeatherData(cityName));

  searchHistoryContainer.appendChild(historyItem);
};
