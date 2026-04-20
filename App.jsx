import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "2f9eddaa3b55a7f7a0bd48d005a875f4";

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      setForecast([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      setWeather(weatherRes.data);
      setForecast(forecastRes.data.list.slice(0, 5));
    } catch (err) {
      setError("City not found or weather data unavailable");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return "🌍";
    const main = weather.weather[0].main;

    if (main === "Clear") return "☀️";
    if (main === "Clouds") return "☁️";
    if (main === "Rain") return "🌧️";
    if (main === "Snow") return "❄️";
    if (main === "Thunderstorm") return "⛈️";
    if (main === "Drizzle") return "🌦️";
    if (main === "Mist" || main === "Haze" || main === "Fog") return "🌫️";

    return "🌍";
  };

  return (
    <div className="app">
      <div className="weather-container">
        <h1 className="app-title">Weather App</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {loading && <p className="message">Fetching weather...</p>}

        {error && !loading && <p className="message">{error}</p>}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-icon">{getWeatherIcon()}</div>

            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <h3>{weather.weather[0].main}</h3>

            <p className="temperature">{Math.round(weather.main.temp)}°C</p>
            <p className="description">{weather.weather[0].description}</p>

            <div className="weather-details">
              <div className="detail-box">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>

              <div className="detail-box">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.wind.speed} m/s</span>
              </div>

              <div className="detail-box">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">
                  {Math.round(weather.main.feels_like)}°C
                </span>
              </div>

              <div className="detail-box">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && !loading && (
          <div className="forecast-section">
            <h2 className="forecast-title">Forecast</h2>
            <div className="forecast-list">
              {forecast.map((item, index) => (
                <div className="forecast-card" key={index}>
                  <p>{new Date(item.dt_txt).getHours()}:00</p>
                  <p>{Math.round(item.main.temp)}°C</p>
                  <p>{item.weather[0].main}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;