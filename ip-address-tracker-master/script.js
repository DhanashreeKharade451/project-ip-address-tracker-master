// import { key } from "./secret.js";

const from = document.getElementById("form");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const submit = document.getElementById("submit");
const searchInputError = document.getElementById("searchInputError");

const ipAddressSpan = document.getElementById("ip-address");
const locationSpan = document.getElementById("location");
const timezoneSpan = document.getElementById("timezone");
const ispSpan = document.getElementById("isp");

let initialized = false;

// window.onload = () => {
//     const savedTasks = localStorage.getItem("data");
//     if (savedTasks) {
//         tasks = JSON.parse(savedTasks);
//         displayTasks();
//     }
// };

//function to track own IP address on initial page load
document.addEventListener("DOMContentLoaded", async () => {
  if (initialized) return;
  initialized = true;
  const res = await fetch("https://ipinfo.io/json");
  const data = await res.json();
  fetchData(data.ip);
});

function validateSearchInput() {
  const regex =
    /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
  if (searchInput.validity.valueMissing) {
    searchInput.setCustomValidity("Input is required");
  } else if (!regex.test(searchInput.value)) {
    searchInput.setCustomValidity("Enter Valid IP Address.");
  } else {
    searchInput.setCustomValidity("");
  }
  searchInputError.textContent = searchInput.validationMessage;
  return searchInput.checkValidity();
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const validate = validateSearchInput();
  if (!validate) {
    return;
  }
  fetchData(searchInput.value);
});

const key = "at_JRU4SsXqx6Kuf3txHZffrDCoIBaDM";
async function fetchData(ipAddress) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey= ${key} & ipAddress= ${ipAddress} `,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    localStorage.setItem("Fetched API Data", JSON.stringify(data));
    renderAPIData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function renderAPIData(data) {
  ipAddressSpan.textContent = data.ip;
  locationSpan.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  timezoneSpan.textContent = `UTC ${data.location.timezone}`;
  ispSpan.textContent = data.isp;
  showCity(locationSpan.textContent);
}

// fetch("https://jsonplaceholder.typicode.com/posts/1")
//   .then(response => response.json())
//   .then(data => console.log("Fetched data:", data))
//   .catch(error => console.error("Fetch error:", error));
const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function showCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${city}`,
  );

  const data = await res.json();
  const lat = data[0].lat;
  const lon = data[0].lon;
  map.setView([lat, lon], 12);
  L.marker([lat, lon]).addTo(map);
}
