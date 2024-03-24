import { auth } from '@/auth'
import RegisterForm from '@/components/registerForm'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import AuthLayout from '@/components/layout/authLayout'
import { AnimationLogo } from '@/components/animationLogo'
import {
  ENTranslation,
  Translation,
  VNTranslation,
} from '@/components/translation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { ContactForm } from '@/components/contactForm'
import { AppProvider } from '@/contexts/appContext'
import Resources from '@/components/resources'
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
    description: 'Resources - Dragon V Studio',
    openGraph: {
      images: appSetting.SiteUrl + '/assets/images/Logo.png',
      title: 'Dragon V Studio',
      description: 'Resources - Dragon V Studio',
      url: appSetting.SiteUrl + '/resources',
    },
  }
}
const ResourcesPage: NextPage = async () => {
  const session = await auth()
  return (
    <>
      <AppProvider session={session}>
        <Navigation />
        <main
          id='content'
          role='main'
          className='resources overflow-hidden bg-img-start'
          style={{
            backgroundImage: 'url("/assets/svg/card-11.svg")',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className='container content-space-t-3 overflow-hidden content-space-t-lg-5 content-space-b-2 position-relative zi-2'>
            <div className='w-md-75 w-lg-50 text-center mx-md-auto mb-5 mb-md-9'>
              <h1>
                <ENTranslation>Resources</ENTranslation>
                <VNTranslation>Tài liệu</VNTranslation>
              </h1>
              {/* <p>
                <ENTranslation>
                  You can contact Dragon V Studio via the form below.
                </ENTranslation>
                <VNTranslation>
                  Các bạn có thể liên hệ với Dragon V Studio qua form bên dưới nha.
                </VNTranslation>
              </p> */}
            </div>
            <div className='row justify-content-center'>
              <div className='col-lg-12 '>
                <Resources />
              </div>
            </div>
          </div>
          <div
            className='brush_1 fadeInLeft'
            style={{ display: 'block', animationDuration: '1s' }}
          >
            <img src='/assets/images/brushes/resources/1.png' alt='resources' />
          </div>
          <div
            className='brush_2 fadeInRight'
            style={{ display: 'block', animationDuration: '1s' }}
          >
            <img src='/assets/images/brushes/resources/2.png' alt='resources' />
          </div>
          <Footer />
        </main>
      </AppProvider>
    </>
  )
}

export default ResourcesPage
