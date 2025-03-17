import './App.css';
import { useState, useEffect } from 'react';
import { fetchWeather, fetchCoord } from "./components/api";

const DEFAULT_CITIES = [
  {name: "Austin", latitude: 30.2672, longitude: -97.7431},
  {name: "Dallas", latitude: 32.7831, longitude: -96.8067},
  {name: "Houston", latitude: 29.7633, longitude: -95.3633}
]

const App = () => {
  const [allCities, setAllCities] = useState([...DEFAULT_CITIES]);
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");

  const loadWeather = async (city) => {
    const data = await fetchWeather(city.latitude, city.longitude);
    if (data) {
      setWeather({ city: city.name, data, currTemp: data.current_weather?.temperature })
    }
  };

  const handleAddCity = async () => {
    setError("");
    const newCity = await fetchCoord(searchCity);
    if (newCity && !allCities.includes(newCity)) {
      setAllCities([...allCities, newCity]);
      loadWeather(newCity);
    } else {
      setError(`Could not find weather for "${searchCity}"`);
    }
    // Now clear things
    setSearchCity(""); 
  };


  // Load Austin's weather for app default
  useEffect(() => {
    loadWeather(DEFAULT_CITIES[0]);
  }, []);

  const getNext10 = () => {
    if (!weather || !weather.data || !weather.data.hourly) return [];
    
    // Making API times to JS Date
    const times = weather.data.hourly.time.map(t => new Date(t));
    const temperatures = weather.data.hourly.temperature_2m;
    
    const now = new Date();
    const curri = times.findIndex(time => time.getHours() === now.getHours());
    if (curri === -1) return [];

    return times.slice(curri, curri + 10).map((time, index) => ({
      time: time.toLocaleTimeString([], { hour:'2-digit', minute: '2-digit' }),
      temperature: temperatures[curri + index]
    }));
  };

  return (
    <div className="container">
      <img src={`${process.env.PUBLIC_URL}/logo_weather.png`}></img>
      <h1>How's the weather today?</h1>
      <div className="city-buttons">
        {/*Iterate through city list and make city buttons*/}
        {allCities.map((city) => (
          <button key={city.name} onClick={() => loadWeather(city)} style={{ margin: "5px" }}>
            {city.name}
          </button>
        ))}
      </div>

      {/*Search function*/}
      <div className="search-container">
        <input
          type = "text"
          placeholder="Enter city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleAddCity}>+</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weather && weather.data && (
        <div className="weather-box">
          <h1>{weather.city}</h1>
          <span className="curr-temp">Current Temperature:</span>
          <h2> {weather.currTemp}°C</h2>
          <div className="weather-columns">
            <span className="column-header">Time</span>
            <span className="column-header">Temperature</span>
          </div>
          {getNext10().map((hour, index) => (
            <div key={index} className="weather-row">
              <span className="weather-row-detail">{hour.time}</span>
              <span className="weather-row-detail">{hour.temperature}°C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
