// DONE responsive
// DONE pull hero image and image details
// DONE pull upcoming data from api

// TODO display upcoming data in DOM
// TODO clicking next goes to next mission
// TODO clicking previous goes to previous mission
// TODO countdown timer to 0 for next astronomical event
// TODO carousel should change every 10 seconds

const apodApiURL = 'https://sdg-astro-api.herokuapp.com/api/Nasa/apod'
const upcomingApiURL =
  'https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming'
// let upcomingJSON
// let upcomingIndexPointer
// let cardTimerID
// let countDownTimerID

const qs = e => document.querySelector(e)

const main = () => {
  fetchApod()
  fetchUpcoming()
  countDownTimerID = setInterval(startCountDownTimer, 1000)
  cardTimerID = setInterval(displayNextMission, 10000)
}

const mod = (n, m) => {
  return ((n % m) + m) % m
}

const isDefinedAndAssigned = data => {
  if (typeof data !== 'undefined') {
    if (data != null) {
      return true
    }
  }
  return false
}

const startCountDownTimer = () => {
  console.log('Started startCountDownTimer()')
  if (!isMissionDataLoaded()) {
    console.log('Mission data not available')
    if (isDefinedAndAssigned(countDownTimerID)) {
      clearInterval(countDownTimerID)
    }
    return
  }
  const deadline = upcomingJSON[upcomingIndexPointer].launch_date_unix * 1000
  console.log('Deadline: ' + deadline)
  if (typeof deadline === 'undefined' || deadline == null) {
    return
  }
  const now = new Date().getTime()
  const t = deadline - now
  console.log('Time left: ' + t)
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((t % (1000 * 60)) / 1000)
  qs('.launch-timer').textContent =
    days +
    ' day' +
    PluralS(days) +
    ', ' +
    hours +
    ' hour' +
    PluralS(hours) +
    ', ' +
    minutes +
    ' minute' +
    PluralS(minutes) +
    ', ' +
    seconds +
    ' second' +
    PluralS(seconds)
  if (t < 0) {
    clearInterval(countDownTimerID)
    qs('.launch-timer').textContent = 'Launched!'
  }
}

const PluralS = number => {
  return number === 1 ? '' : 's'
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

const fetchApod = async () => {
  const resp = await fetch(apodApiURL)
  if (resp.status != 200) {
    console.log('An error occurred fetching data from ' + apodApiURL)
    return
  }
  const apod = await resp.json()
  qs('.daily-picture').style.backgroundImage = 'url("' + apod.url + '")'
  qs('.copyright').textContent =
    'copyright: ' + apod.copyright + ' | title: ' + apod.title
}

const fetchUpcoming = async () => {
  const resp = await fetch(upcomingApiURL)
  if (resp.status != 200) {
    return
  }
  upcomingJSON = await resp.json()
  removePastMissions()
  upcomingJSON.sort(
    (a, b) => parseInt(a.launch_date_unix) - parseInt(b.launch_date_unix)
  )
  upcomingIndexPointer = 0
  populateMissionData()
}

// Remove past missions from global array
const removePastMissions = () => {
  const now = new Date() // get now in UNIX epoch unit
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

const isMissionDataLoaded = () => {
  return typeof upcomingIndexPointer !== 'undefined'
}

// Display mission with index number saved in upcomingIndexPointer on card
const populateMissionData = () => {
  if (!isMissionDataLoaded()) {
    console.log('Mission data not available')
    return
  }

  const missionName =
    upcomingJSON[upcomingIndexPointer].mission_name +
    ' (' +
    (upcomingIndexPointer + 1) +
    ' of ' +
    upcomingJSON.length +
    ')'
  const missionDesc = upcomingJSON[upcomingIndexPointer].details
  let missionCountdown = upcomingJSON[upcomingIndexPointer].launch_date_unix
  const missionLaunch =
    upcomingJSON[upcomingIndexPointer].launch_site.site_name_long

  if (missionCountdown != null) {
    const LaunchDate = new Date(missionCountdown * 1000)
    missionCountdown = LaunchDate.toLocaleString()
  }

  qs('.title-of-launch').textContent =
    missionName == null ? 'No mission name available yet' : missionName
  qs('.launch-description').textContent =
    missionDesc == null ? 'No description available yet' : missionDesc
  qs('.laynch-timer').textContent =
    missionCountdown == null ? 'No launch date yet' : missionCountdown
  qs('.launch-location').textContent =
    missionLaunch == null ? 'No launch site available yet' : missionLaunch
}

document.addEventListener('DOMContentLoaded', main)
qs('.leftArrow').addEventListener('click', displayPrevMission)
qs('.rightArrow').addEventListener('click', displayNextMission)
