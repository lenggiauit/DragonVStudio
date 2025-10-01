import { auth } from '../auth'
import type { NextPage } from 'next'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { AppProvider } from '@/contexts/appContext'

import HomeVideo from '@/components/homeVideo'

import ServerLocations from '@/components/serverLocation'
import ScrollToTop from '@/components/scrollToTop'

const Home: NextPage = async () => {
  const session = await auth()
  if (session?.user) {
    console.log(session?.user.role)
  } else {
  }

  return (
    <AppProvider session={session}>
      <div className='homepage-container'>
        <img
          className='homepage-logo'
          src='assets\images\Dragon V Logo.png'
          alt='Dragon V Studio'
        />
        <a
          className='btn-main'
          target='_blank'
          href='https://discord.gg/tGyd6GSR'
        >
          Join Our Discord
        </a>
      </div>
      {/* <Navigation />
      <section className='no-padding'>
        <HomeVideo />
      </section>
      <section className='mt-10'>
        <ServerLocations />
      </section>
      <Footer />
      <ScrollToTop /> */}
    </AppProvider>
  )
}

export default Home
