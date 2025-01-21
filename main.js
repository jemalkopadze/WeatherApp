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

const megapolisCities = [
  'Tokyo',
  'New York',
  'London',
  'Paris',
  'Dubai',
  'Singapore',
  'Los Angeles',
  'Berlin',
  'Sydney',
  'Mumbai'
];

//Get weather for single city
async function getWeather(city) {
  try {
    console.log("")
    const [weatherResponse, forecastResponse] = await Promise.all([fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`),  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)]);
      
   

  

    const currentData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();
    console.log(currentData);


    // Update UI
    updateCurrentWeather(currentData);
    updateForecast(forecastData)
    hideErrorPopup();

  } catch (err) {
    console.log("error")
    showErrorPopup();
    clearWeatherData();
  }
}

// Update the Megapolis section
async function updateMegapolis() {
  const megapolisContainer = document.querySelector('.megapolis__forecast');

  try {
    const weatherPromises = megapolisCities.map(city =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
    );

    const megaWeatherData = await Promise.all(weatherPromises);

    megaWeatherData.forEach(data => {

      const megapolisElement = document.createElement('div');
      megapolisElement.className = 'megapolis';


      const sectionLeft = document.createElement('div');
      sectionLeft.className = 'section section-left';

      const description = document.createElement('h6');
      description.textContent = capitalizeFirstLetter(data.weather[0].main);

      
      const icon = document.createElement('img');
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      icon.className = 'weather-icon';

      const sectionRight = document.createElement('div');
      sectionRight.className = 'section section-right ';

      
      const cityName = document.createElement('h5');
      cityName.className = 'city__name';
      cityName.textContent = data.name;

      
      const temp = document.createElement('p');
      temp.className = 'temp';
      temp.textContent = `${Math.round(data.main.temp)}°`;

      //Add the complete elemets to container 
      megapolisContainer.appendChild(megapolisElement)

      megapolisElement.appendChild(sectionLeft);
      megapolisElement.appendChild(sectionRight);      
      sectionLeft.appendChild(description);
      sectionLeft.appendChild(icon);
      sectionRight.appendChild(cityName);
      sectionRight.appendChild(temp);
    })
  } catch (err) {
    console.log('err')
  }

}

function updateForecast (data) {
  const forecastContainer = document.querySelector('.forecast-items');
  if(!forecastContainer) return;
  forecastContainer.innerHTML= '';

  try {
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    dailyForecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', {weekday: 'short'});

      const forecastElement = document.createElement('div');
      forecastElement.className = 'forecast-item';
      forecastElement.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather icon">
      <div class="forecast-temp">${Math.round(forecast.main.temp)}°</div>
      <div class="forecast-desc">${capitalizeFirstLetter(forecast.weather[0].description)}</div>
      `
      forecastContainer.appendChild(forecastElement)

    })
  }catch (err) {
    console.log('forecast notfound')
  }
  
}

function updateCurrentWeather(data) {
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  town.textContent = data.name;
  humidityIndicator.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed)} km/h`;
  sky.textContent = data.weather[0].description;

  changeBackground(data.weather[0].description)
}

function clearWeatherData() {
  temperature.textContent = '--';
  town.textContent = 'Not Found';
  humidityIndicator.textContent = '--';
  windSpeed.textContent = '--';
  sky.textContent = '--';
  clearForecast()
  
}

function clearForecast() {
  const forecastContainer = document.querySelector('.forecast-items');
  if (forecastContainer) {
    forecastContainer.innerHTML = '';
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function changeBackground(weatherCondition) {
  const backgrounIMG = document.querySelector('.bg-img');

  const condition = weatherCondition.toLowerCase();

  let backgroundPath;

  if(condition.includes('clear') || condition.includes('sunny')) {
    backgroundPath = '/assets/clear.jpg';

  }else if(condition.includes('clouds') || condition.includes('cloudy')) {
    backgroundPath = '/assets/clouds.jpg'
  }else if(condition.includes('rain') || condition.includes('light rain') || condition.includes('drizzle')) {
    backgroundPath = '/assets/rain.jpg';
  }else if(condition.includes('Snow') || condition.includes('light snow')) {
    backgroundPath = '/assets/snow.jpg'
  }else if(condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
    backgroundPath = '/assets/bg-img.jpg';
  }
  backgrounIMG.style.opacity = 1;


   setTimeout(() => {
    backgrounIMG.src = backgroundPath;
    backgrounIMG.style.opacity = '1';
  }, 500);
}

searchBtn.addEventListener('click', () => {
  const city = searchBox.value.trim();
  if (city !== '') {
    getWeather(city);
    searchBox.value = '';
  } else {
    clearWeatherData();
  }
});

searchBox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const city = searchBox.value.trim();
    if (city !== '') {
      getWeather(city);
    searchBox.value = '';
    }
  }
});

closeBtn.addEventListener('click', hideErrorPopup);

function showErrorPopup() {
  errorMessage.style.display = 'block';
}

function hideErrorPopup() {
  errorMessage.style.display = 'none';
}

window.addEventListener('load', () => {
  getWeather('Tbilisi');
  updateMegapolis();
});
