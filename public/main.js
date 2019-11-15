// DONE responsive
// DONE pull hero image and image details

// TODO pull upcoming data from api
// TODO countdown timer to 0 for next astronomical event
// TODO carousel should change every 10 seconds

const qs = e => document.querySelector(e)

const apiUrl = "https://sdg-astro-api.herokuapp.com/api/Nasa/apod"
const upcomingApiUrl =
  "https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming"

const start = () => {
  getHeroImage()
  getUpcomingData()
}

const getHeroImage = async () => {
  const response = await fetch(apiUrl)
  const json = await response.json()
  qs(".heroImage").style.backgroundImage = `url(${json.hdUrl})`
  qs(".copyright").textContent =
    "copyright: " + json.copyright + " | title: " + json.title
}

const getUpcomingData = async () => {
  const response = await fetch(upcomingApiUrl)
  const json = await response.json()
  console.log(json)
}

document.addEventListener("DOMContentLoaded", start)
