export function convertWindDirection(degrees) {
    if (degrees >= 338 && degrees <= 22) {
        //North
        return 'N'
    }
    else if (degrees >= 23 && degrees <= 67) {
        //North East
        return 'NE'
    }
    else if (degrees >= 68 && degrees <= 112) {
        //East
        return 'E'
    }
    else if (degrees >= 113 && degrees <= 158) {
        //South East
        return 'SE'
    }
    else if (degrees >= 159 && degrees <= 203) {
        //South
        return 'S'
    }
    else if (degrees >= 204 && degrees <= 248) {
        //South West
        return 'SW'
    }
    else if (degrees >= 249 && degrees <= 293) {
        //West
        return 'W'
    }
    else {
        //North West
        return 'NW'
    }
}

export function convertWeatherDescription(str) {
    const arr = str.split(" ");
    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }
    const description = arr.join(" ");
    console.log(description);

    return description
}

export async function getWeather(lat, lon, time) {
    const units = 'imperial'

    // Fetch Weather
    const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${process.env.WEATHER_KEY}&units=${units}`,
        {
            method: 'GET',
        }
    );
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const weatherInfo = await response.json()
    return weatherInfo
}

export function getWeatherIcon(code) {
    if (code >= 200 && code < 299) {
        //Thunderstorms
        return '⛈️'
    }
    else if (code >= 300 && code < 599 && code !== 511) {
        //Drizzle and Rain
        return '🌧️'
    }
    else if (code == 511 || (code >= 600 && code <= 699)) {
        //Snow
        return '❄️'
    }
    else if (code >= 701 && code < 800) {
        //Atmosphere fog/hale/mist etc
        return '🌫️'
    }
    else if (code == 800) {
        //Clear
        return '☀️'
    }
    else if (code == 801) {
        //Few Clouds
        return '🌤️'
    }
    else if (code > 801) {
        //Clouds
        return '☁️'
    }
    else {
        //Edge Case
        return ''
    }
}