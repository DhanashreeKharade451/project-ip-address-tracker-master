import { key } from "./secret.js";

const from = document.getElementById("form");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const submit = document.getElementById("submit");
const searchInputError = document.getElementById("searchInputError")

const ipAddressSpan = document.getElementById("ip-address");
const locationSpan = document.getElementById("location");
const timezoneSpan = document.getElementById("timezone");
const ispSpan = document.getElementById("isp");

function validateSearchInput(){
    const regex =
    /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
    if(searchInput.validity.valueMissing){
        searchInput.setCustomValidity("Input is required");
     }else if(!regex.test(searchInput.value)){
        searchInput.setCustomValidity("Enter Valid IP Address.");
     }else{
        searchInput.setCustomValidity("");
     }
     searchInputError.textContent = searchInput.validationMessage;
     return searchInput.checkValidity();

}

searchForm.addEventListener("submit", function(event){
    event.preventDefault();
    const  validate = validateSearchInput();
    if(!validate){
        return;
    }
    fetchData(searchInput.value);

});

async function fetchData(ipAddress) {
  try {
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey= ${key} & ipAddress= ${ipAddress} `);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
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
}



// fetch("https://jsonplaceholder.typicode.com/posts/1")
//   .then(response => response.json())
//   .then(data => console.log("Fetched data:", data))
//   .catch(error => console.error("Fetch error:", error));

let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([51.5, -0.09])
  .addTo(map)
  .bindPopup("A pretty CSS popup.<br> Easily customizable.")
  .openPopup();
