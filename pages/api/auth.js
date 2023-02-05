import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { exchangeAuthCode } from "../../lib/stravaUtils"

// This is the API triggered when someone connects to Strava
export default async function handler(req, res) {
  const state = req.query.state
  const code = req.query.code
  const scope = req.query.scope

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res })
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    })

  //If you have a code do the post request to strava for keys
  let stravaData = await exchangeAuthCode(code)

  if (req.query?.error) {
    // Process a POST request
    console.log("Error")
  } else {
    // Update user profile with code,state,scope from query 
    const error = await supabase
      .from('profiles')
      .update({ code, state, scope, 'strava_owner_id': stravaData.athlete.id, 'strava_access_token': stravaData.accessToken, 'strava_refresh_token': stravaData.refreshToken })
      .eq('id', session.user.id)

    console.log(error)
  }

  // Store Code in DB and set a flag or something that lets the app know I'm connected for this user!
  res.writeHead(302, { Location: '/' });
  res.end();

}