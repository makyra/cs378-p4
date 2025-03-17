const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// async not strictly needed, but helps ensuring everything to happen in order
export const fetchCoord = async (city) => {
  try {
    const response = await fetch(
      `${GEO_URL}?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { latitude, longitude, name } = data.results[0];
      return { name, latitude, longitude};
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

// async so that JavaScript waits for that data before continuing and not move on
// even before data arrives
// So fetchWeather needs async so that it makes an API request and waits for data
export const fetchWeather = async (latitude, longitude) => {
  try {
    const response = await fetch (
      `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&timezone=auto`
    )
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:" , error);
    return null;
  }
};