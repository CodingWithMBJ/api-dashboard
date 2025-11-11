// Global Variables for APP
const dogContainer = document.getElementById("dog-output");
const catContainer = document.getElementById("cat-output");
const weatherContainer = document.getElementById("weather-output");
const currencyContainer = document.getElementById("currency-output");
const movieContainer = document.getElementById("movies-output");
const githubUserContainer = document.getElementById("github-output");
const jokesContainer = document.getElementById("joke-output");
const pubicApiContainer = document.getElementById("publicapi-output");

// Dog API

async function getDogImage() {
  const url = "https://dog.ceo/api/breeds/image/random";

  dogContainer.innerHTML = "<p>Loading...</p>";
  const response = await fetch(url);
  const data = await response.json();

  dogContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = data.message;
  img.alt = "a random dog image";
  img.classList = "dog-img";

  dogContainer.appendChild(img);
}

// Cat Api

async function getCatImage() {
  const url = "https://cataas.com/cat?" + Date.now();

  catContainer.innerHTML = "<p>Loading...</p>";

  const response = await fetch(url);

  catContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = url;
  img.alt = "A random cat image";
  img.classList.add("cat-img");

  catContainer.appendChild(img);
}

// Weather Api

async function getWeather() {
  const locationInput = document
    .getElementById("getLocale")
    .value.trim()
    .replace(/\s+/g, "+");

  weatherContainer.innerHTML = `<p>Loading...</p>`;

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=1&language=en&format=json&country_code=US`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    const place = geoData?.results?.[0];
    if (!place) {
      weatherContainer.innerHTML = `<p>Location not found.</p>`;
      return;
    }

    const coords = {
      latitude: place.latitude,
      longitude: place.longitude,
    };

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const { temperature, weathercode, windspeed } = weatherData.current_weather;
    const description = getWeatherDescription(weathercode);

    weatherContainer.innerHTML = `
      <strong>${place.name}, ${place.admin1 || ""}</strong><br>
      🌡️ Temperature: ${temperature}°F<br>
      💨 Wind Speed: ${windspeed} mph<br>
      ☁️ Condition: ${description}
    `;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    weatherContainer.innerHTML = "<p>Error fetching weather data.</p>";
  }

  function getWeatherDescription(code) {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: light",
      53: "Drizzle: moderate",
      55: "Drizzle: dense",
      56: "Freezing drizzle: light",
      57: "Freezing drizzle: dense",
      61: "Rain: slight",
      63: "Rain: moderate",
      65: "Rain: heavy",
      66: "Freezing rain: light",
      67: "Freezing rain: heavy",
      71: "Snowfall: slight",
      73: "Snowfall: moderate",
      75: "Snowfall: heavy",
      77: "Snow grains",
      80: "Rain showers: slight",
      81: "Rain showers: moderate",
      82: "Rain showers: violent",
      85: "Snow showers: slight",
      86: "Snow showers: heavy",
      95: "Thunderstorm: slight or moderate",
      96: "Thunderstorm: with slight hail",
      99: "Thunderstorm: with heavy hail",
    };
    return descriptions[code] || "Unknown weather";
  }
}

// Currency API

async function getExchangeRates() {
  const fromRate = document.getElementById("fromRate").value.trim();
  const toRate = document.getElementById("toRate").value.trim();
  const rateAmount = document.getElementById("rateAmount").value.trim();

  function convert(from, to, amount) {
    currencyContainer.innerHTML = ``;
    fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
      .then((resp) => resp.json())
      .then((data) => {
        const convertedAmount = (amount * data.rates[to]).toFixed(2);
        currencyContainer.innerHTML = `<p>Loading Currency Results...</p>`;

        currencyContainer.innerHTML = `${amount} ${from} = ${convertedAmount} ${to}`;
      });
  }

  convert(fromRate, toRate, rateAmount);
}

// MOVIE API

async function getMovies() {
  const myKey = "7c00f979365cb1f51e6fbe3a4638e0c3";
  const url = "https://api.themoviedb.org/3";
  const imgUrl = "https://image.tmdb.org/t/p/w500";

  movieContainer.innerHTML = `<p>Loading Trending Movies...</p>`;

  try {
    const response = await fetch(`${url}/trending/movie/week?api_key=${myKey}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    displayMovies(data.results, imgUrl);
  } catch (error) {
    movieContainer.innerHTML = `<p>Failed to load movies 😢</p>`;
    console.error("Error fetching movies:", error);
  }
}

function displayMovies(movies, imgUrl) {
  movieContainer.innerHTML = "";

  movies.forEach((movie) => {
    const article = document.createElement("article");
    article.classList.add("movie");

    article.innerHTML = `
      <img src="${imgUrl + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average.toFixed(1)}</p>
    `;

    movieContainer.appendChild(article);
  });
}

// Github API

async function getGitHubUser() {
  const searchUser = document.getElementById("searchUser").value.trim();

  if (!searchUser) {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${searchUser}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    githubUserContainer.innerHTML = `
      <h2>${data.name || data.login}</h2>
      <img src="${data.avatar_url}" alt="Avatar" width="100">
      <p>Followers: ${data.followers}</p>
      <p>Following: ${data.following}</p>
      <p>Public Repos: ${data.public_repos}</p>
      <a href="${data.html_url}" target="_blank">View Profile</a>
    `;
  } catch (error) {
    console.error(error);
    githubUserContainer.innerText = error.message;
  }
}

// Joke API

async function getJoke() {
  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any");
    const data = await response.json();

    let jokeText = "";

    if (data.type === "single") {
      jokeText = data.joke;
    } else if (data.type === "twopart") {
      jokeText = `${data.setup} 🤔 ${data.delivery}`;
    }

    jokesContainer.textContent = jokeText;
  } catch (error) {
    jokesContainer.textContent = "Oops! Failed to fetch a joke. 😢";
    console.error(error);
  }
}

// API Search

async function getPublicApiInfo() {
  let getApis = [];

  async function loadPublicApis() {
    if (getApis.length > 0) return getApis;

    const res = await fetch(
      "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"
    );
    const markdown = await res.text();

    const rows =
      markdown.match(/\| \[.*?\]\(.*?\) \| .*? \| .*? \| .*? \| .*? \|/g) || [];

    getApis = rows.map((row) => {
      const cols = row.split("|").map((c) => c.trim());
      const [apiCell, description, auth, https, cors] = cols.slice(1, 6);
      const match = apiCell.match(/\[(.*?)\]\((.*?)\)/);
      return {
        name: match ? match[1] : "Unknown",
        link: match ? match[2] : "#",
        description,
        auth,
        https,
        cors,
      };
    });

    return getApis;
  }

  const query = document.getElementById("apiSearch").value.toLowerCase();
  pubicApiContainer.innerHTML = "Searching...";

  const apis = await loadPublicApis();

  const matches = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(query) ||
      api.description.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    pubicApiContainer.innerHTML = "⚠️ No matching APIs found.";
    return;
  }

  pubicApiContainer.innerHTML = matches
    .slice(0, 10)
    .map(
      (api) => `
        <article class='apis-container'>
          <h3><a href="${api.link}" target="_blank">${api.name}</a></h3>
          <p><strong>Description:</strong> ${api.description}</p>
          <p><strong>Auth:</strong> ${api.auth}</p>
          <p><strong>HTTPS:</strong> ${api.https}</p>
          <p><strong>CORS:</strong> ${api.cors}</p>
        </article>
      `
    )
    .join("");
}
