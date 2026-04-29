document.getElementById('weather-btn').addEventListener('click', () => {
  const addressInput = document.getElementById('address-input');
  const adress = addressInput.value.trim();
  if (adress == '')
  {
    alert('Pole adresu nie może być puste!');
    return;
  }
  const apiKey = "fde0592b747288a0493daf47c4bf287e";
  const url =`https://api.openweathermap.org/data/2.5/weather?q=${adress}&appid=${apiKey}&units=metric`;
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", () => {
    this.currentWeather = JSON.parse(req.responseText);
    console.log(JSON.parse(req.responseText));
    const date = new Date(this.currentWeather.dt * 1000);
    const weather_block = document.createElement("div");
    weather_block.className = "weather-block";
    const weather_date =  document.createElement("div");
    weather_date.innerHTML = date.toLocaleString('pl-PL');
    weather_date.className = "weather-date";
    weather_block.appendChild(weather_date);


    const weather_temp = document.createElement("div");
    weather_temp.className = "weather-temperature";
    weather_block.appendChild(weather_temp);
    weather_temp.innerHTML = `Temperatura: ${this.currentWeather.main.temp} °C`;


    const weather_temp_feels = document.createElement("div");
    weather_temp_feels.className = "weather-temperature";
    weather_block.appendChild(weather_temp_feels);
    weather_temp_feels.innerHTML = `Odczucie: ${this.currentWeather.main.feels_like} °C`;

    const icon_img = document.createElement("img");
    icon_img.className = "weather-icon";
    const iconCode = this.currentWeather.weather[0].icon;
    icon_img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    weather_block.appendChild(icon_img);

    const weather_desc = document.createElement("div");
    weather_desc.className = "weather-temperature";
    weather_block.appendChild(weather_desc);
    weather_desc.innerHTML = `${this.currentWeather.weather[0].description}`;

    document.getElementById("weather").appendChild(weather_block);
    return weather_block;


  });
  req.send();

  const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${adress}&appid=${apiKey}&units=metric`
  fetch(forecast_url).then((response) => {
      return response.json();
  } )
    .then((data) => {
      this.forecast = data.list;
      console.log(data);
      for (let i =0; i< this.forecast.length; i += 10)
      {
        let weather = this.forecast[i];
        const date_forecast = new Date(weather.dt * 1000);
        const weather_block = document.createElement("div");
        weather_block.className = "weather-block";
        const forecast_date =  document.createElement("div");
        forecast_date.innerHTML = date_forecast.toLocaleString('pl-PL');
        forecast_date.className = "weather-date";
        weather_block.appendChild(forecast_date);


        const weather_temp = document.createElement("div");
        weather_temp.className = "weather-temperature";
        weather_block.appendChild(weather_temp);
        weather_temp.innerHTML = `Temperatura: ${weather.main.temp} °C`;


        const weather_temp_feels = document.createElement("div");
        weather_temp_feels.className = "weather-temperature";
        weather_block.appendChild(weather_temp_feels);
        weather_temp_feels.innerHTML = `Odczucie: ${weather.main.feels_like} °C`;

        const icon_img = document.createElement("img");
        icon_img.className = "weather-icon";
        const iconCode = weather.weather[0].icon;
        icon_img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        weather_block.appendChild(icon_img);

        const weather_desc = document.createElement("div");
        weather_desc.className = "weather-temperature";
        weather_block.appendChild(weather_desc);
        weather_desc.innerHTML = `${weather.weather[0].description}`;

        document.getElementById("weather").appendChild(weather_block);
      }
    })


})
