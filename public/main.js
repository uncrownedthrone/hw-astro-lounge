// DONE responsive
// DONE pull hero image and image details
// DONE pull upcoming data from api
// DONE display upcoming data in DOM
// DONE clicking next goes to next mission
// DONE clicking previous goes to previous mission
// DONE countdown timer to 0 for next astronomical event
// DONE carousel should change every 10 seconds

const apiUrl = 'https://sdg-astro-api.herokuapp.com/api/Nasa/apod'
const upcomingApiURL =
  'https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming'
let upcomingJSON
let upcomingIndexPointer
let cardTimerID
let countDownTimerID

const qs = e => document.querySelector(e)

const start = () => {
  getImage()
  fetchUpcoming()
  countDownTimerID = setInterval(startCountDownTimer, 1000)
  cardTimerID = setInterval(displayNextMission, 10000)
}

// get main image
const getImage = async () => {
  const resp = await fetch(apiUrl)
  const apod = await resp.json()
  qs('.daily-picture').style.backgroundImage = 'url("' + apod.url + '")'
  qs('.copyright').textContent =
    'copyright: ' + apod.copyright + ' | title: ' + apod.title
  if (apod.copyright === 'null') {
    qs('.daily-picture').style.backgroundImage = `url(${apod.hdUrl})`
    qs('.copyright').textContent = 'copyright: ' + apod.copyright
    qs('.title').textContent = ' | title: ' + apod.title
  } else {
    qs('.copyright').textContent = 'copyright: no copyright'
    qs('.daily-picture').style.backgroundImage = `url(${apod.hdUrl})`
    qs('.title').textContent = ' | title: ' + apod.title
  }
}

// get upcoming launch data
const fetchUpcoming = async () => {
  const resp = await fetch(upcomingApiURL)
  upcomingJSON = await resp.json()
  removePastMissions()
  upcomingJSON.sort(
    (a, b) => parseInt(a.launch_date_unix) - parseInt(b.launch_date_unix)
  )
  upcomingIndexPointer = 0
  populateMissionData()
}

// starts 10 second countdown timer
const startCountDownTimer = () => {
  const deadline = upcomingJSON[upcomingIndexPointer].launch_date_unix * 1000
  if (typeof deadline === 'undefined' || deadline == null) {
    return
  }
  const now = new Date().getTime()
  const t = deadline - now
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((t % (1000 * 60)) / 1000)
  qs('.launch-timer').textContent =
    days +
    ' days' +
    ', ' +
    hours +
    ' hours' +
    ', ' +
    minutes +
    ' minutes' +
    ', ' +
    seconds +
    ' seconds'
  if (t < 0) {
    clearInterval(countDownTimerID)
    qs('.launch-timer').textContent = 'Launched!'
  }
}

const advanceCardDelayed = () => {
  if (typeof cardTimerID === 'undefined' || cardTimerID == null) {
    cardTimerID = setTimeout(displayNextMissionCycling, 10000)
  } else {
    clearTimeout(cardTimerID)
  }
}

const stopCountDownTimer = () => {
  if (typeof countDownTimerID !== 'undefined') {
    if (countDownTimerID != null) {
      clearTimeout(countDownTimerID)
    }
  }
}

const displayNextMissionCycling = () => {
  displayNextMission()
  cardTimerID = null
  advanceCardDelayed()
}

// Remove past missions
const removePastMissions = () => {
  const now = new Date()
  for (let i = 0; i < upcomingJSON.length; i++) {
    if (
      parseInt(upcomingJSON[i].launch_date_unix) <
      parseInt(now.getTime() / 1000)
    ) {
      upcomingJSON.splice(i, 1)
    } else {
    }
  }
}

// Display next mission in array on card
const displayNextMission = () => {
  stopCountDownTimer()
  qs('.launch-timer').textContent = ''
  upcomingIndexPointer = (upcomingIndexPointer + 1) % upcomingJSON.length
  populateMissionData()
  countDownTimerID = setInterval(startCountDownTimer, 1000)
}

// Display previous mission in array on card
const displayPrevMission = () => {
  stopCountDownTimer()
  qs('.launch-timer').textContent = ''
  upcomingIndexPointer = mod(upcomingIndexPointer - 1, upcomingJSON.length)
  populateMissionData()
  countDownTimerID = setInterval(startCountDownTimer, 1000)
}

// Display mission with index number saved in upcomingIndexPointer on card
const populateMissionData = () => {
  const missionName = upcomingJSON[upcomingIndexPointer].mission_name
  const missionDesc = upcomingJSON[upcomingIndexPointer].details
  const missionCountdown = upcomingJSON[upcomingIndexPointer].launch_date_unix
  const missionLaunch =
    upcomingJSON[upcomingIndexPointer].launch_site.site_name_long
  qs('.title-of-launch').textContent =
    missionName == null ? 'No mission name available' : missionName
  qs('.describe-launch').textContent =
    missionDesc == null ? 'No description available' : missionDesc
  qs('.launch-timer').textContent =
    missionCountdown == null ? 'No launch date' : missionCountdown
  qs('.launch-area').textContent =
    missionLaunch == null ? 'No launch site available' : missionLaunch
}

document.addEventListener('DOMContentLoaded', start)
qs('.leftArrow').addEventListener('click', displayPrevMission)
qs('.rightArrow').addEventListener('click', displayNextMission)
