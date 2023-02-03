import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

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

  console.log(session)

  if (!session)
    return res.status(401).json({
      error: 'not_authenticated',
      description: 'The user does not have an active session or is not authenticated',
    })

  // Run queries with RLS on the server
  const { data } = await supabase
    .from('profiles')
    .select('strava_owner_id')
    .eq('id', session.user.id)
  //res.json(data)
  

  console.log(data[0].strava_owner_id)

  console.log(state)
  console.log(code)
  console.log(scope)
  if (req.query?.error) {
    // Process a POST request
    console.log("Error")
  } else {
    //Take the code and do a POST request. Store in DB.
    // const error = await supabase
    //   .from('profiles')
    //   .update({ code })
    //   .eq('strava_owner_id', stravaOwnerID)

    // console.log(error)
  }

  // Store Code in DB and set a flag or something that lets the app know I'm connected for this user!
  res.writeHead(302, { Location: '/' });
  res.end();
  
}