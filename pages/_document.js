import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" >
      <div className="flex flex-col justify-between h-full min-h-screen">
      <Head />
      <body className='mb-auto'>
        <Main />
        <NextScript />
      </body>
      <footer className="footer footer-center p-4 text-base-content">
        <div>
          <p>Copyright © 2023 - All rights reserved by LelliWeather</p>
        </div>
      </footer>
      </div>
    </Html>
  )
}
