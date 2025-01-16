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
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    if (!weatherResponse.ok) {
      throw new Error('City not found');
    }

    const currentData = await weatherResponse.json()
    console.log(currentData)

    // Update UI
    updateCurrentWeather(currentData);
    hideErrorPopup();

  } catch (err) {
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
      description.textContent = capitalizeFirstLetter(data.weather[0].description);

      
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

searchBtn.addEventListener('click', () => {
  const city = searchBox.value.trim();
  if (city !== '') {
    getWeather(city);
  } else {
    clearWeatherData();
  }
});

searchBox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const city = searchBox.value.trim();
    if (city !== '') {
      getWeather(city);
    }
  }
});

function showErrorPopup() {
  errorMessage.style.display = 'block';
}

function hideErrorPopup() {
  errorMessage.style.display = 'none';
}

closeBtn.addEventListener('click', hideErrorPopup);

window.addEventListener('load', () => {
  getWeather('Tbilisi');
  updateMegapolis();
  setInterval(updateMegapolis, 300000);  // Update every 5 minutes
});
