import React, { useState } from "react";

const api = {
  key: "ef7bfe0a865c8f9b13aa0c8fe29d4510",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});

  // When enter key pressed in search bar, fetch data & return in JSON
  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          // Set our state as the result of the query
          setWeather(result);
          setQuery("");
          console.log(result);
        });
    }
  };

  // Props to pass latitude and longitude from first fetch into second to get weekly weather forecast
  function Forecast(props) {
    console.log(props);
    // use fetch to return the forecast ... problems!!!!
    fetch(`${api.base}onecall?lat=${props.lat}&lon=${props.lon}&exclude=current,minutely,hourly,alerts&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setForecast(result);
        console.log(result);
      },[]);

    return (
      <div><h2>4 Day Forecast: </h2>
        {/* <div>{forecast.daily[0]}</div> */}
      </div>
      // iterate over forecast using map function
    );
  }


  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };
  return (
    // If there is no main weather results use cold background, otherwise if temp is above 16 change to warm background, less than 16 change to cold background
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 16
            ? "app-warm"
            : "app"
          : "app"
      }
    >
      <main className="layout">
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            // Set our query from the user input in the search box
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            // Once 'enter' key is pressed, run our search query
            onKeyPress={search}
          />
        </div>
        {typeof weather.main != "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>

              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-icon">
              {/* Get dynamic weather icon by using our search query */}
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt=""
              />
            </div>
            <div className="weather-box">
              <div className="temp">
                {/* Get rounded temperature in celcius, found in first result of weather array */}
                {Math.round(weather.main.temp)}°c
                <div className="weather">{weather.weather[0].main}</div>
              </div>
            </div>
            <div className="additional">
              <div className="humidity">
                Humidity: {weather.main.humidity}%{" "}
              </div>
              <div className="wind-speed">
                Wind: {Math.round(weather.wind.speed)}km/h
              </div>
              {/* Debugging latitude and longitude */}
              {/* <div>Latitude: {weather.coord.lat}</div>
              <div>Longitude: {weather.coord.lon}</div> */}
              {/* calling forecast function with lat and lon from weather object */}
              <Forecast lat={weather.coord.lat} lon={weather.coord.lon}></Forecast>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;