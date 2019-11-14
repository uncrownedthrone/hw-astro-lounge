const qs = e => document.querySelector(e)

const apiUrl = "https://sdg-astro-api.herokuapp.com/api/Nasa/apod"
const upcomingApiUrl =
  "https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming"

const getApiData = async () => {
  const resp = await fetch(apiUrl)
  const apiData = await resp.json()
  qs(".copyright").textContent =
    "copyright: " + apiData.copyright + " | title: " + apiData.title
  qs(".heroImage").src = apiData.url
}

const main = () => {
  getApiData()
}

document.addEventListener("DOMContentLoaded", main)
