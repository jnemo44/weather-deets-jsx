import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [units, setUnits] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, units`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setUnits(data.units)
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
    const redirectUri = 'http://localhost:3002/api/auth';
    const scope = 'read,activity:read_all,activity:write'; // a space-separated list of scopes your app is requesting
    const state = 'STATE'; // a value that you generate and that will be returned to you after authorization
    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.replace(authorizationUrl);
  }

  return (
    <div className="flex-col space-y-4 mt-4">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
        <p className="mt-1 text-sm text-gray-500">
          Edit app settings below
        </p>
      </div>

      <div>
       {/* Connect Strava Account Button */}
      <button
        onClick={stravaAuthHandler}
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Connect to Strava
      </button>
      </div>

      <div className="sm:col-span-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={session.user.email}
            disabled
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Units
        </label>
        <div className="mt-1">
          <select
            id="unit"
            name="unit"
            autoComplete="unit-name"
            value={units || ''}
            onChange={(e) => setUnits(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
          >
            <option>Imperial (Fahrenheit, miles/hour)</option>
            <option>Metric (Celsius, meters/second)</option>
            <option>Standard (Kelvin, meters/second)</option>
          </select>
        </div>
      </div>

      <div>

      </div>
      <div className="pt-5">
        <div className="flex justify-end">         
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Sign Out
            </button>
            <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
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