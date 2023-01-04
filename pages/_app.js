import '../styles/globals.css'
import {useState} from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <div className="mx-auto w-10/12 sm:w-8/12">
        <Component {...pageProps} />
      </div>   
    </SessionContextProvider>
  )
}
