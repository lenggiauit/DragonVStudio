import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { auth } from '../auth'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './globals.css'
import './style.css'
import './global_icons.css'
import './custom.scss'
import { AppProvider } from '@/contexts/appContext'
export const metadata: Metadata = {
  title: 'Dragon V Studio',
  description:
    'Dragon V Studio - Game Mode Servers. Discord: https://discord.gg/dragonvstudio |  Youtube: https://www.youtube.com/@DragonVStudio',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/assets/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap'
          rel='stylesheet'
        ></link>
      </head>
      <body className='dark-scheme'>
        <GoogleOAuthProvider clientId='1009275167759-a0hqdnlf9isv1qe2b1h48iioeaomiud9.apps.googleusercontent.com'>
          <AppProvider session={session}>{children}</AppProvider>
        </GoogleOAuthProvider>
        <ToastContainer
          newestOnTop
          hideProgressBar
          position='bottom-right'
          autoClose={2000}
        />
      </body>
    </html>
  )
}
