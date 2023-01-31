import { getWeather, geocodingAPI } from './model.js'
import { loadDataOnPage, toggle } from './view.js'

const searchButton = document.querySelector('.search__submit')
const searchInput = document.querySelector('.search__input')
const isFullScreen = document.querySelector('.full-screen')
const theme_toggler = document.querySelector('.theme-toggler__icon');
const prev = document.querySelector('.weather-hour__prev')
const next = document.querySelector('.weather-hour__next')
theme_toggler.addEventListener('click', toggle);

window.addEventListener('DOMContentLoaded', () => {
    const location = localStorage.getItem('location')

    if (location) {
        getWeather(JSON.parse(location))
            .then(
                data => {
                    loadDataOnPage(data)
                    removeFullScreen()
                },
                error => alert(error))
    } else {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

        function error(message) {
            alert('Проблема с сетью! Проверьте подключение или повторите попытку позже.')
        }

        function success(pos) {
            const coord = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            }
            getWeather(coord)
                .then(
                    data => {
                        loadDataOnPage(data)
                        removeFullScreen()
                        chache(coord)
                    },
                    error => alert(error))
        }

        navigator.geolocation.getCurrentPosition(success, error, options)
    }
})

searchButton.addEventListener('click', (event) => {
    event.preventDefault()
    if (searchInput.value) {
        getForecast(searchInput.value)
    } else {
        openFullSrceen()
    }
})

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (searchInput.value) {
            getForecast(searchInput.value)
        } else {
            openFullSrceen()
        }
    }
})

prev.addEventListener('click', (event) => {
    const slider = document.querySelector('.hourly-forecast')
    const sliderElement = slider.querySelector(`.hourly-forecast__item`)
    slider.scrollLeft -= sliderElement.clientWidth * 2
})

next.addEventListener('click', (event) => {
    const slider = document.querySelector('.hourly-forecast')
    const sliderElement = slider.querySelector(`.hourly-forecast__item`)
    slider.scrollLeft += sliderElement.clientWidth * 2
})  

function getForecast(location) {
    geocodingAPI(location)
        .then(
            response => getWeather(response)
                            .then(
                                data => {
                                    loadDataOnPage(data)
                                    removeFullScreen()
                                    chache(response)
                                },
                                error => alert(error)),
            error => alert(error))
}

function removeFullScreen() {
    isFullScreen && isFullScreen.classList.remove('full-screen')
}

function openFullSrceen() {
    localStorage.removeItem('location')
    !isFullScreen.classList.contains('fullscreen') && isFullScreen.classList.add('full-screen')
}

function chache(data) {
    localStorage.setItem('location', JSON.stringify(data))
}