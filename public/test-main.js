function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    var ownKeys = Object.keys(source)
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable
        })
      )
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key])
    })
  }
  return target
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }
  return obj
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function")
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ("value" in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}
var API_URL = "https://sdg-astro-api.herokuapp.com/api/"
var Launch = (function() {
  function Launch(item) {
    var _this = this
    _classCallCheck(this, Launch)
    this.data = _objectSpread({}, item)
    this.ICONS = {
      SHUTTLE: function SHUTTLE() {
        return _this.createIcon("space-shuttle")
      },
      DESCRIPTION: function DESCRIPTION() {
        return _this.createIcon("info-circle")
      },
      LOCATION: function LOCATION() {
        return _this.createIcon("map-marked-alt")
      },
      COUNTDOWN: function COUNTDOWN() {
        return _this.createIcon("clock")
      }
    }
  }
  _createClass(Launch, [
    {
      key: "createIcon",
      value: function createIcon(icon) {
        var _icon = document.createElement("i")
        _icon.classList.add("fas")
        _icon.classList.add("fa-".concat(icon))
        return _icon
      }
    },
    {
      key: "createHeader",
      value: function createHeader() {
        var _missionName = document.createElement("h3")
        _missionName.appendChild(this.ICONS.SHUTTLE())
        _missionName.appendChild(
          document.createTextNode(this.data.mission_name)
        )
        return _missionName
      }
    },
    {
      key: "createDescription",
      value: function createDescription() {
        var _missionMain = document.createElement("main")
        _missionMain.appendChild(this.ICONS.DESCRIPTION())
        if (this.data.details) {
          _missionMain.appendChild(document.createTextNode(this.data.details))
        } else {
          _missionMain.appendChild(
            document.createTextNode("No description available yet.")
          )
        }
        return _missionMain
      }
    },
    {
      key: "createLocation",
      value: function createLocation() {
        var _missionLocation = document.createElement("section")
        _missionLocation.classList.add("location")
        _missionLocation.appendChild(this.ICONS.LOCATION())
        _missionLocation.appendChild(
          document.createTextNode(this.data.launch_site.site_name_long)
        )
        return _missionLocation
      }
    },
    {
      key: "createCountDown",
      value: function createCountDown() {
        var _countdown = document.createElement("section")
        _countdown.classList.add("countdown")
        _countdown.appendChild(this.ICONS.COUNTDOWN())
        var now = new Date()
        var launchDate = new Date(this.data.launch_date_utc)
        var dif = launchDate.getTime() - now.getTime()
        var secondsFromT1ToT2 = dif / 1e3
        var totalSeconds = Math.abs(secondsFromT1ToT2)
        if (secondsFromT1ToT2 < 0) {
          _countdown.appendChild(document.createTextNode("Launched!"))
        } else {
          var time = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          }
          time.days = Math.floor(totalSeconds / (60 * 60 * 24))
          totalSeconds = totalSeconds - time.days * 24 * 60 * 60
          time.hours = Math.floor(totalSeconds / (60 * 60))
          totalSeconds = totalSeconds - time.hours * 60 * 60
          time.minutes = Math.floor(totalSeconds / 60)
          totalSeconds = totalSeconds - time.minutes * 60
          time.seconds = Math.floor(totalSeconds)
          _countdown.appendChild(
            document.createTextNode(
              ""
                .concat(time.days, " days, ")
                .concat(time.hours, " hours, ")
                .concat(time.minutes, " mins, ")
                .concat(time.seconds, " seconds")
            )
          )
        }
        return _countdown
      }
    },
    {
      key: "renderCard",
      value: function renderCard() {
        var _parent = document.createElement("div")
        _parent.classList.add("card-parent")
        _parent.appendChild(this.createHeader())
        _parent.appendChild(this.createDescription())
        _parent.appendChild(this.createCountDown())
        _parent.appendChild(this.createLocation())
        return _parent
      }
    }
  ])
  return Launch
})()
var Page = (function() {
  function Page() {
    _classCallCheck(this, Page)
    this.state = {
      launches: {
        upcoming: [],
        currentIndex: 0,
        countdown: null
      },
      pictureOfTheDay: {
        url: "",
        title: "loading...",
        copyright: "loading..."
      }
    }
  }
  _createClass(Page, [
    {
      key: "pageWillLoad",
      value: function pageWillLoad() {
        this.loadImageOfTheDay()
        this.loadUpcomingLaunches()
      }
    },
    {
      key: "loadUpcomingLaunches",
      value: function loadUpcomingLaunches() {
        var _this2 = this
        fetch("".concat(API_URL, "spacex/launches/upcoming"))
          .then(function(resp) {
            return resp.json()
          })
          .then(function(json) {
            _this2.updateUpcomingLaunches(json)
            _this2.renderPage()
          })
      }
    },
    {
      key: "updateUpcomingLaunches",
      value: function updateUpcomingLaunches(json) {
        this.state.launches.upcoming = json.map(function(l) {
          return new Launch(l)
        })
      }
    },
    {
      key: "loadImageOfTheDay",
      value: function loadImageOfTheDay() {
        var _this3 = this
        fetch("".concat(API_URL, "Nasa/apod"))
          .then(function(resp) {
            return resp.json()
          })
          .then(function(json) {
            console.log(json)
            _this3.updatePictureOfTheDay(json)
            _this3.renderPage()
          })
      }
    },
    {
      key: "updatePictureOfTheDay",
      value: function updatePictureOfTheDay(json) {
        this.state.pictureOfTheDay.title = json.title
        this.state.pictureOfTheDay.copyright = json.copyright
        this.state.pictureOfTheDay.url = json.url
      }
    },
    {
      key: "renderPictureOfTheDay",
      value: function renderPictureOfTheDay() {
        var hero = document.querySelector(".hero-image")
        document.querySelector(
          ".image-title"
        ).textContent = this.state.pictureOfTheDay.title
        document.querySelector(".copyright").textContent =
          this.state.pictureOfTheDay.copyright || "no copyright"
        hero.style.backgroundImage = "url(".concat(
          this.state.pictureOfTheDay.url,
          ")"
        )
      }
    },
    {
      key: "renderUpcomingLaunches",
      value: function renderUpcomingLaunches() {
        var _launch = this.state.launches.upcoming[
          this.state.launches.currentIndex
        ]
        var _parent = document.querySelector(".launch-card")
        _parent.textContent = ""
        _parent.appendChild(_launch.renderCard())
        this.startCountDown()
      }
    },
    {
      key: "startCountDown",
      value: function startCountDown() {
        var _this4 = this
        clearInterval(this.state.launches.countdown)
        this.state.launches.countdown = setTimeout(function() {
          _this4.renderUpcomingLaunches(_this4.state.launches.currentIndex)
        }, 1e3)
      }
    },
    {
      key: "goToNextLaunch",
      value: function goToNextLaunch() {
        this.state.launches.currentIndex++
        if (
          this.state.launches.currentIndex + 1 >
          this.state.launches.upcoming.length
        ) {
          this.state.launches.currentIndex = 0
        }
        this.renderUpcomingLaunches()
      }
    },
    {
      key: "goToPrevLaunch",
      value: function goToPrevLaunch() {
        this.state.launches.currentIndex--
        if (this.state.launches.currentIndex < 0) {
          this.state.launches.currentIndex =
            this.state.launches.upcoming.length - 1
        }
        this.renderUpcomingLaunches()
      }
    },
    {
      key: "renderPage",
      value: function renderPage() {
        this.renderPictureOfTheDay()
        this.renderUpcomingLaunches()
      }
    }
  ])
  return Page
})()
var page = new Page()
document.addEventListener("DOMContentLoaded", function() {
  return page.pageWillLoad()
})
document.querySelector(".left.arrow").addEventListener("click", function() {
  return page.goToPrevLaunch()
})
document.querySelector(".right.arrow").addEventListener("click", function() {
  return page.goToNextLaunch()
})
