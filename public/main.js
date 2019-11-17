// DONE responsive
// DONE pull hero image and image details
// DONE pull upcoming data from api

// TODO display upcoming data in DOM
// TODO clicking next goes to next mission
// TODO clicking previous goes to previous mission
// TODO countdown timer to 0 for next astronomical event
// TODO carousel should change every 10 seconds

let rocketInfo
const missionData = []
let interval
let interval2
let i = 0
const y = 0
const x = 0

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

const advanceCard = () => {
  interval2 = setTimeout(displayNextMissionCycling, 10000)
}

const displayNextMissionCycling = () => {
  rightButton()
  interval2 = null
  advanceCard()
}

// const information = {
//   misson_name: rocketInfo[i].mission_name,
//   details: rocketInfo[i].details,
//   launch_date_unix: rocketInfo[i].launch_date_unix,
//   launch_site: rocketInfo[i].launch_site.site_name_long
//   }
//   missionData.push(information)
//   i++;

const beginCountDown = () => {
  const unixConversion = rocketInfo[i].launch_date_unix * 1000
  const now = new Date().getTime()
  const t = unixConversion - now
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((t % (1000 * 60)) / 1000)
  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    qs('.days').textContent = 'Launched.'
    qs('.group').classList.add('hide')
  } else {
    qs('.group').classList.remove('hide')
    qs('.days').textContent = days
    qs('.hours').textContent = hours
    qs('.minutes').textContent = minutes
    qs('.seconds').textContent = seconds
  }
}

const leftButton = () => {
  if (i === 0) {
    i = rocketInfo.length - 1
    displayRocketInfo()
  }
}

const rightButton = () => {
  i = (i + 1) % rocketInfo.length
  displayRocketInfo()
}

const displayRocketInfo = () => {
  qs('.title').textContent = rocketInfo[i].mission_name

  if (rocketInfo[i].details == null) {
    qs('.details').textContent = 'No description available yet.'
  } else {
    qs('.details').textContent = rocketInfo[i].details
  }
  qs('.map').textContent = rocketInfo[i].launch_site.site_name_long
}

const start = () => {
  getHeroImage()
  getUpcomingData()
}

document.addEventListener('DOMContentLoaded', start)
qs('.leftArrow').addEventListener('click', leftButton)
qs('.rightArrow').addEventListener('click', rightButton)
