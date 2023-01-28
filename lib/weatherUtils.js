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

    // Calculate Dewpoint
    //const temp_c = (weatherInfo.main.temp-32)*(5/9)
    //let dewPoint = 243.04*(Math.log(weatherInfo.main.humidity/100)+((17.625*temp_c)/(243.04+temp_c)))/(17.625-Math.log(weatherInfo.main.humidity/100)-((17.625*temp_c)/(243.04+temp_c)))
    //dewPoint = Math.round(dewPoint*(9/5))+32

    // Need to do a push to Strava to update the Description with this info
    //async function updateWeather() {
    // const token = await db.collection('access_tokens')
    // .doc('W50yW2KWMFL2U0XJGbru')
    // .get()
    // const id = await db.collection('strava_data')
    // .doc('hP8d1Y61Id6uQ5B7DgEW')
    // .get()
    // const requestOptions = {
    //     method: 'PUT',
    //     headers: { 
    //         'Content-Type': 'application/json', 
    //         Authorization: `Bearer ${token.data().access_token}`},
    //         body: JSON.stringify({ description: dewPoint })
    // };
    //const response = await fetch(`https://www.strava.com/api/v3/activities/{${id.data().object_id}}`, requestOptions);
    //const data = await response.json();
    //}

    // Write weather data to database
    // db.collection('weather_data')
    //   .doc('YhFGHjZz9Yo331xr0ru4')
    //   .update({
    //     temp: weatherInfo.main.temp,
    //     feels_like: weatherInfo.main.feels_like,
    //     pressure: weatherInfo.main.pressure,
    //     humidity: weatherInfo.main.humidity,
    //     wind_speed: weatherInfo.main.wind.speed,
    //     wind_direction: weatherInfo.main.wind.deg,
    //     dew_point: dewPoint,
    // })
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