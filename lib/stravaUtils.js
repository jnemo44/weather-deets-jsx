//import db from '../lib/db'
import {supabase} from "../lib/supabasedb";

export async function fetchStravaActivity(objectID, accessToken) {
    const response = await fetch(
        `https://www.strava.com/api/v3/activities/${objectID}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    )
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const stravaActivity = await response.json()

    return stravaActivity
}

export async function fetchStravaAthlete( accessToken) {
    const response = await fetch(
        `https://www.strava.com/api/v3/athlete`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    )
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const stravaAthlete = await response.json()

    return stravaAthlete
}


export async function deauthorizeAthlete ( accessToken, stravaOwnerID) {
    const response = await fetch(
        `https://www.strava.com/oauth/deauthorize?access_token=${accessToken}`,
        {
            method: 'POST',
            headers: {
                'Content_Type':'application/json',
            }
        },
    )

    if (!response.ok) {
        const message = `An error has occured when trying to Deauthorize: ${response.status}`;
        throw new Error(message);
    }

    // Delete strava owner id since that's what I'm using as the flag for connection
    const { error } = await supabase
        .from('profiles')
        .update({'strava_owner_id': null})
        .eq('strava_owner_id', stravaOwnerID)

    if (error) {
        const message = `An error has occured when trying to Deauthorize user from server`;
        throw new Error(message);
    }


}


export async function updateStravaTokens( stravaOwnerID ) {
    // Fetch Refresh Token
    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('strava_owner_id', stravaOwnerID)
    
    let refresh_token = data.data.code

    const response = await fetch(
        `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.CLIENT_ID_STRAVA}&client_secret=${process.env.CLIENT_SECRET_STRAVA}&grant_type=refresh_token&refresh_token=${refresh_token}`,
        {
            method: 'POST',
            headers: {
                'Content_Type':'application/json'
            }
        },
    )

    if (!response.ok) {
        const message = `An error has occured trying to update Strava Token: ${response.status}`;
        throw new Error(message);
    }
    const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
    } = await response.json()

    // Put the new tokens into the db
    const { error2 } = await supabase
        .from('profiles')
        .update({ strava_refresh_token: newRefreshToken, strava_access_token: newToken })
        .eq('strava_owner_id', stravaOwnerID)

    return newAccessToken
}

export async function exchangeAuthCode(code) {
    const response = await fetch(
        `https://www.strava.com/oauth/token?client_id=${process.env.CLIENT_ID_STRAVA}&client_secret=${process.env.CLIENT_SECRET_STRAVA}&code=${code}&grant_type=authorization_code`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }
        },
    )

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const {
        athlete: athlete,
        refresh_token: refreshToken,
        access_token: accessToken
    } = await response.json()

    return {athlete, refreshToken, accessToken}
}

