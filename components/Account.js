import { useState, useEffect } from 'react'
import { fetchStravaAthlete, deauthorizeAthlete } from '../lib/stravaUtils'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [units, setUnits] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [stravaAccount, setStravaAccount] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)

      if (error && status !== 406) {
        throw error
      }
      // Put data where it belongs
      if (data[0].strava_owner_id) {
        // Get Athlete profile from Strava
        let athlete = await fetchStravaAthlete(data[0].strava_access_token)
        setUsername(data[0].username)
        setUnits(data[0].units)
        setAccessToken(data[0].strava_access_token)
        { athlete ? setStravaAccount(athlete) : setStravaAccount(null) }
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, units }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        units,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const stravaAuthHandler = () => {
    const clientId = '93865';
    const redirectUri = 'http://localhost:3006/api/auth';
    const scope = 'read,activity:read_all,activity:write'; // a space-separated list of scopes your app is requesting
    const state = 'STATE'; // a value that you generate and that will be returned to you after authorization
    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.replace(authorizationUrl);
  }

  async function stravaDeauthHandler() {
    deauthorizeAthlete(accessToken, stravaAccount.id)
    setStravaAccount(null)
  }

  return (
    <div className="flex-col space-y-4 mt-4">
      <div>
        <h1 className="text-lg font-medium">Profile</h1>
        <p className="mt-1 text-sm">
          Edit account settings below
        </p>
      </div>

      <div>
        {/* Connect Strava Account if not in DB*/}
        {stravaAccount ?
          //<div className="flex-col">
          <div className="card card-side card-compact bg-base-100 shadow-lg">
            <figure><img className="mask mask-circle" src={stravaAccount.profile} alt="Athlete" /></figure>
            <div className="card-body">
              <h2 className="card-title">Hello {stravaAccount.firstname}!</h2>
              <p>You are connected to Strava as {stravaAccount.firstname} {stravaAccount.lastname}!</p>
              <div className="card-actions justify-end">
                <button className="btn btn-error btn-sm" onClick={stravaDeauthHandler}>Disconnect</button>
              </div>
            </div>
          </div>
          //</div>
          :
          (
            <button
              onClick={stravaAuthHandler}
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Connect to Strava
            </button>
          )}
      </div>

      <div className="form-control space-y-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email Address</span>
          </label>
          <input
            value={session.user.email}
            disabled
            className="input input-bordered w-full max-w-xs" />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full max-w-xs" />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Select desired display units...</span>
            {/* <span className="label-text-alt">Alt label</span> */}
          </label>
          <select
            id="unit"
            name="unit"
            className="select select-bordered"
            value={units || ''}
            onChange={(e) => setUnits(e.target.value)}>

            <option>Fahrenheit, miles/hour</option>
            <option>Celsius, miles/hour</option>
            <option>Celsius, km/hour</option>

          </select>
          {/* <label className="label">
            <span className="label-text-alt">Alt label</span>
            <span className="label-text-alt">Alt label</span>
          </label> */}
        </div>

        <div className="flex-col pt-4">
          <label className="label">
            <span className="label-text">Preview Description</span>
          </label>
          <div>
            🌤️ Clouds 💨 Winds from NE 10{(units == 'Fahrenheit, miles/hour') || (units == 'Celsius, miles/hour') ? 'mph' : 'kph'} gusting 13{(units == 'Fahrenheit, miles/hour') || (units == 'Celsius, miles/hour') ? 'mph' : 'kph'}
          </div>
          <div>
            🌡️ Temp: 77{units == 'Fahrenheit, miles/hour' ? 'F' : 'C'}  💧 Dew Point: 55{units == 'Fahrenheit, miles/hour' ? 'F' : 'C'}  ✨ Felt Like: 75{units == 'Fahrenheit, miles/hour' ? 'F' : 'C'}
          </div>
        </div>
      </div>

      <div>

      </div>
      <div className="pt-5">
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="btn btn-ghost border-1"
          >
            Sign Out
            </button>
          <button
            className="btn btn-success"
            onClick={() => updateProfile({ username, units })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}