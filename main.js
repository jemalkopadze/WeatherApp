const apiKey = '2c76ffd31d591683507cc09111115297';
const searchBox = document.getElementById('searchbox');
const searchBtn = document.getElementById('searchbtn');
const temperature = document.querySelector('.celcius');
const town = document.querySelector('.city');
const details = document.querySelector('.details');
const humidityIndicator = document.querySelector('.humidity__indicator');
const windSpeed = document.querySelector('.wind__speed');
const sky = document.querySelector('.sky');
const errorMessage = document.getElementById('error-message');
const closeBtn = document.getElementById('close-popup');



async function getWeather(city) {
  try {
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    
    if (!weatherResponse.ok) {
      throw new Error('City not found');
    }

    const currentData = await weatherResponse.json()
    console.log(currentData)

    //Update UI 
    updateCurrentWeather(currentData)
    hideErrorPopup();

  } catch (err) {
    showErrorPopup();
    clearWeatherData();

  }

}

function updateCurrentWeather(data) {
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  town.textContent = data.name;
  humidityIndicator.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} km/h`;
  sky.textContent = data.weather[0].description;

}

function clearWeatherData() {
  temperature.textContent = '--';
  town.textContent = 'Not Found';
  humidityIndicator.textContent = '--';
  windSpeed.textContent = '--';
  sky.textContent = '--';
}

searchBtn.addEventListener('click', () => {
  const city = searchBox.value.trim();
  if (city !== '') {
    getWeather(city)
  }else {

  }
})

searchBox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const city = searchBox.value.trim();
    if (city !== '') {
      getWeather(city)
    }
  }
});

function showErrorPopup() {
  errorMessage.style.display = 'block';
}

function hideErrorPopup () {
  errorMessage.style.display = 'none';
}

closeBtn.addEventListener('click', hideErrorPopup)


window.addEventListener('load', () => {
  getWeather('Tbilisi')
})

