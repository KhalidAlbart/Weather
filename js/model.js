const apiKey = '5703e5cb782c148e2045e6559bb38e93'

function request(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.timeout = 5000
        xhr.responseType = 'json'
        xhr.open('GET', url, true)
        xhr.send();
        xhr.onload = () => {
            resolve(xhr.response);
        }
        xhr.ontimeout = () => {
            reject(new Error('По данному регионы ничего не найдено. Проверьте корректность введеных данных.'))
        }
        xhr.onerror = () => {
            console.log('error')
            reject(new Error('По данному регионы ничего не найдено. Проверьте корректность введеных данных.'))
        }
    })
}

export function getWeather(address) {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${address.lat}&lon=${address.lon}&appid=${apiKey}&units=metric&lang=ru`;
        
        request(url)
            .then(
                response => resolve(response),
                error => reject(error))
    })
    
}

export function geocodingAPI(address) {
    return new Promise((resolve, reject) => {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${address}&limit=1&appid=${apiKey}`

        request(url)
            .then(
                response => resolve({lat: response[0].lat, lon: response[0].lon}),
                error => reject(error))
    })
}