// DONE responsive
// DONE pull hero image and image details
// DONE pull upcoming data from api

// TODO display upcoming data in DOM
// TODO clicking next goes to next mission
// TODO clicking previous goes to previous mission
// TODO countdown timer to 0 for next astronomical event
// TODO carousel should change every 10 seconds

const qs = e => document.querySelector(e)

const apiUrl = 'https://sdg-astro-api.herokuapp.com/api/Nasa/apod'
const upcomingApiUrl =
  'https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming'

const getHeroImage = async () => {
  const response = await fetch(apiUrl)
  const json = await response.json()
  if (json.copyright === 'null') {
    qs('.daily-picture').style.backgroundImage = `url(${json.hdUrl})`
    qs('.copyright').textContent = 'copyright: ' + json.copyright
    qs('.title').textContent = ' | title: ' + json.title
  } else {
    qs('.copyright').textContent = 'copyright: Not Available'
    qs('.daily-picture').style.backgroundImage = `url(${json.hdUrl})`
    qs('.title').textContent = ' | title: ' + json.title
  }
}

const getUpcomingData = async () => {
  const response = await fetch(upcomingApiUrl)
  const json = await response.json()
  console.log(json)
  qs('.title-of-launch').textContent = json[0].mission_name
  qs('.describe-launch').textContent = json[0].details
  qs('.launch-location').textContent = json[0].launch_site.site_name_long
  qs('.launch-timer').textContent = json[0].launch_date_unix
}
// index of upcoming launch will change so that needs to be a function that counts towards the full index of launches

// const information = {
//   misson_name: rocketInfo[i].mission_name,
//   details: rocketInfo[i].details,
//   launch_date_unix: rocketInfo[i].launch_date_unix,
//   launch_site: rocketInfo[i].launch_site.site_name_long
//   }
//   missionData.push(information)
//   i++;

const previousMission = () => {}

const nextMission = () => {}

const start = () => {
  getHeroImage()
  getUpcomingData()
}

document.addEventListener('DOMContentLoaded', start)
qs('.leftArrow').addEventListener('click', previousMission)
qs('.rightArrow').addEventListener('click', nextMission)
