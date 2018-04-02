function attachEvents() {
    const baseUrl = 'https://judgetests.firebaseio.com';

    $('#submit').click(loadForecast);

    function request(endpoint) {
        return $.ajax({
            method: 'GET',
            url: baseUrl + endpoint
        })
    }

    function loadForecast() {

        request('/locations.json')
            .then(displayLocations)
            .catch(handleError);

    }

    //Ajax  get all locations 
    function displayLocations(data) {
        let inputLocation = $('#location').val();
        let code = data.filter(loc => loc['name'] === inputLocation)
            .map(loc => loc['code'])[0];
        if (!code) {

            handleError();
        }

        let forecastToday = request(`/forecast/today/${code}.json `);
        let upcomingForecast = request(`/forecast/upcoming/${code}.json`);
        Promise.all([forecastToday, upcomingForecast])
            .then(displayAllForecastInfo)
            .catch(handleError)
    }


    function displayAllForecastInfo([weatherToday, upcomingWeather]) {


        let weatherSymbols = {
            'Sunny': '&#x2600;',// ☀
            'Partly sunny': '&#x26C5;',// ⛅
            'Overcast': '&#x2601;', // ☁
            'Rain': '&#x2614;',// ☂
            'Degrees': '&#176;'   // °
        };

        let forecast = $('#forecast');
        forecast.css('display', 'block');

        displayToCurrent(weatherToday, weatherSymbols);
        displayToUpcoming(upcomingWeather, weatherSymbols);
    }

    function displayToCurrent(weatherToday, weatherSymbols) {

        let current = $('#current');
        current.empty();
        current.append($(' <div class="label">Current conditions</div>'))
            .append($(`<span class="condition symbol">${weatherSymbols[weatherToday['forecast']['condition']]}</span>`))
            .append($('<span class="condition">')
                .append($(`<span class="forecast-data">${weatherToday['name']}</span>`))
                .append($(`<span class="forecast-data">${weatherToday['forecast']['low']}${weatherSymbols['Degrees']}/${weatherToday['forecast']['high']}${weatherSymbols['Degrees']}</span>`))
                .append($(`<span class="forecast-data">${weatherToday['forecast']['condition']}</span>`)))
    }

    function displayToUpcoming(upcomingWeather, weatherSymbols) {

        let upcoming = $('#upcoming');
        upcoming.empty();
        let data = upcomingWeather['forecast'];
        upcoming.append($(' <div class="label">Three-day forecast</div>'));
        for (let datum of data) {
                upcoming.append($('<span class="upcoming"></span>')
                    .append($(`<span class="symbol">${weatherSymbols[datum['condition']]}</span>`))
                    .append($(`<span class="forecast-data">${datum['low']}${weatherSymbols['Degrees']}/${datum['high']}${weatherSymbols['Degrees']}</span>`))
                    .append($(`<span class="forecast-data">${datum['condition']}</span>`)))

}


    }

    //display error if shit hits the fan 
    function handleError() {
        $('#forecast').css('display','block').text('Error')
    }
}