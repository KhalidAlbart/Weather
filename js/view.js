const theme = document.querySelector('body')

if(localStorage.getItem('theme')) {
    theme.classList.add(localStorage.getItem('theme'))
}

export function toggle() {
    theme.classList.toggle('theme-dark')
    if (theme.classList.contains('theme-dark')) {
        localStorage.setItem('theme', theme.classList)
    } else {
        localStorage.removeItem('theme')
    }
}

export function loadDataOnPage(data) {
    const today = new Date().getDate()
    const hourlyForecast = document.querySelector('.hourly-forecast__items')
    const dailyForecast = document.querySelector('.daily-forecast__items')
    const hourlyForecastTemp = document.querySelector('.hourly-forecast-template')
    const dailyForecastTemp = document.querySelector('.daily-forecast-template')
    const separator = document.querySelector('.separator-template')
    const numberWithSymbol = (number) => number > 0 ? '+' + number : number
    
    document.querySelector('.current-location__item').innerHTML = data.city.name
    document.querySelector('.current-weather__temp').innerHTML = numberWithSymbol(data.list[0].main.temp.toFixed(1)) + '&#176;'
    document.querySelector('.current-weather__icon').src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`
    document.querySelector('.current-weather__feels').innerHTML = `${data.list[0].weather[0].description}<br><span class="current-weather__feels_font-weight">ощущается как </span>${numberWithSymbol(data.list[0].main.feels_like.toFixed(1))}&#176;`
    document.querySelector('.wind').innerHTML = data.list[0].wind.speed.toFixed(1) + ' м/с'
    document.querySelector('.humidity').innerHTML = data.list[0].main.humidity + '%'
    document.querySelector('.pressure').innerHTML = data.list[0].main.pressure + ' мм рт. ст.'
    
    let previusDay = undefined
    hourlyForecast.innerHTML = ''
    dailyForecast.innerHTML = ''

    data.list.forEach(item => {
        const currentDay = new Date(item.dt_txt).getDate()
        
        if (currentDay != previusDay) {
            if (previusDay != undefined) {
                hourlyForecast.appendChild(separator.content.cloneNode(true));
            }

            const cloneDFTemp = dailyForecastTemp.content.cloneNode(true)
            const weekday = currentDay == today ? 'Сегодня' : new Intl.DateTimeFormat('ru', {weekday: 'short'}).format(new Date(item.dt_txt))
            
            cloneDFTemp.querySelector('.forecast-item__day').innerHTML = weekday
            cloneDFTemp.querySelector('.forecast-item__date').innerHTML = currentDay + ' ' + new Intl.DateTimeFormat('ru', {month: 'short'}).format(new Date(item.dt_txt))
            cloneDFTemp.querySelector('.forecast-item__icon').src = 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '@2x.png'
            cloneDFTemp.querySelectorAll('.forecast-item__temp')[0].innerHTML = numberWithSymbol(Math.floor(item.main.temp_min)) + '&#176;'
            cloneDFTemp.querySelectorAll('.forecast-item__temp')[1].innerHTML = numberWithSymbol(Math.floor(item.main.temp_max)) + '&#176;'
            cloneDFTemp.querySelector('.forecast-item__description').innerHTML = item.weather[0].description
            
            dailyForecast.appendChild(cloneDFTemp)
        } else {
            const cloneHFTemp = hourlyForecastTemp.content.cloneNode(true)

            cloneHFTemp.querySelector('.hourly-forecast__time').innerHTML = new Intl.DateTimeFormat("ru", {hour: "2-digit", minute: "2-digit"}).format(new Date(item.dt_txt))
            cloneHFTemp.querySelector('.hourly-forecast__icon').src = 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '@2x.png'
            cloneHFTemp.querySelector('.hourly-forecast__temperature').innerHTML = numberWithSymbol(Math.floor(item.main.temp)) + '&#176;'

            hourlyForecast.appendChild(cloneHFTemp)
        }
        previusDay = currentDay
    })
}