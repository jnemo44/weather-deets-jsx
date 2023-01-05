export default function handler(req, res) {
    const state = req.query.state
    const code = req.query.code
    const scope = req.query.scope
    console.log(state)
    console.log(code)
    console.log(scope)
    if (req.query?.error) {
      // Process a POST request
      console.log("Error")
    } else {
      //Take the code and do a POST request. Store in DB.
    }

    // Store Code in DB and set a flag or something that lets the app know I'm connected for this user!

    res.writeHead(302, { Location: '/' });
    res.end();
  }