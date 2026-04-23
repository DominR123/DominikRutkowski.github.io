document.getElementById('weather-btn').addEventListener('click', () => {
  const addressInput = document.getElementById('address-input');
  const adress = addressInput.value.trim();
  if (adress == '')
  {
    alert('Pole adresu nie może być puste!');
    return;
  }
  const apiKey = "fde0592b747288a0493daf47c4bf287e";
  const url =`http://api.openweathermap.org/geo/1.0/direct?q=${adress}&limit=1&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert('Nie znaleziono miasta!');
        return;
      }

      const {lat, lon} = data[0];
      console.log(`Miasto: ${data[0].name}, Szerokość: ${lat}, Długość: ${lon}`);
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;

      return fetch(weatherUrl);
    })
    .then(response => response.json())
    .then(weather => {
      const result = `
      <h2>${weather.name}</h2>
      <p>Temperatura: ${weather.main.temp} °C</p>
      <p>Odczuwalna temperatura: ${weather.main.feels_like} °C</p>
      <p>Wilgotność: ${weather.main.humidity} %</p>
      <p>Szybkość wiatru ${weather.wind.speed} m/s</p>
      <p>Opis ${weather.weather[0].description}</p>`;
      document.getElementById('weather').innerHTML = result;
  })


})
