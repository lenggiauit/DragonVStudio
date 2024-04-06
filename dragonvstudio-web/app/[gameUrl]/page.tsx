import { auth } from '@/auth'
import RegisterForm from '@/components/registerForm'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import LoginForm from '@/components/loginForm'
import { AnimationLogo } from '@/components/animationLogo'
import Wave from 'react-wavify'
import AuthLayout from '@/components/layout/authLayout'
import { Translation } from '@/components/translation'
import { AppProvider } from '@/contexts/appContext'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scrollToTop'
let appSetting: AppSetting = require('../../appSetting.json')

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Dragon V Studio',
    description: 'Dragon V Studio',
    openGraph: {
      //images: appSetting.SiteUrl + '/images/photos/all_albums.jpg',
      title: 'Dragon V Studio',
      description: 'Dragon V Studio',
      url: appSetting.SiteUrl + '/' + params,
    },
  }
}
const GameServerPage: NextPage = async () => {
  const session = await auth()
  if (session?.user) {
    console.log(session?.user.role)
  } else {
  }
  return (
    <>
      <AppProvider session={session}>
        <Navigation />

        <div className='container mt-10'>
          <div className='row mt-10'>
            <div className='col-lg-12 mt-10 text-center'>
              <h1>Coming soon</h1>
            </div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </AppProvider>
    </>
  )
}

export default GameServerPage
