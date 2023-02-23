import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'
import Image from 'next/image'
import logo from '../public/logo.png'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className="flex-col space-y-4 pb-10">
      <div className="flex justify-center">
        <Image
          className="mt-4 rounded-lg shadow-xl"
          src={logo}
          alt="LelliWeather">
        </Image>
      </div>
      {/* style={{ padding: '50px 0 100px 0' }} */}
      <div className="container">
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              // variables: {
              //   default: {
              //     colors: {
              //       brand: '#FFFFFF',
              //       brandAccent: '#C189B8',
              //       brandButtonText: 'black',
              //       // defaultButtonBackground: '#2e2e2e',
              //       // defaultButtonBackgroundHover: '#3e3e3e',
              //     }
              //   }
              // }
            }}
            // appearance={{
            //   style: {
            //     button: { background: '#694263', color: '#F17ED7', border:'#694263'}
            //   }
            // }}
          />
        ) : (
          <Account session={session} />
        )}
      </div>
    </div>
  )
}

export default Home
