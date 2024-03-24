import { auth } from '@/auth'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import { ENTranslation, VNTranslation } from '@/components/translation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { AppProvider } from '@/contexts/appContext'
import NotificationList from '@/components/userNotification'
import UserNav from '@/components/userNav'

let appSetting: AppSetting = require('../../../appSetting.json')

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
    description: 'User Profile - Dragon V Studio',
    openGraph: {
      images: appSetting.SiteUrl + '/assets/images/Logo.png',
      title: 'Dragon V Studio',
      description: 'User Profile - Dragon V Studio',
      url: appSetting.SiteUrl + '/user/security',
    },
  }
}
const UserNotificationPage: NextPage = async () => {
  const session = await auth()
  return (
    <>
      <AppProvider session={session}>
        <Navigation />
        <main
          id='content'
          role='main'
          className=' overflow-hidden position-relative'
        >
          <div
            className='navbar-dark bg-dark '
            style={{
              backgroundImage: 'url(/assets/svg/wave-pattern-light.svg)',
            }}
          >
            <div className='container content-space-t-2 overflow-hidden content-space-t-lg-3 content-space-b-2 position-relative zi-2'>
              <div className='row align-items-center'>
                <div className='col'>
                  <div className='d-none d-lg-block'>
                    <h1 className='h2 text-white'>
                      <VNTranslation>Thông tin cá nhân</VNTranslation>
                      <ENTranslation> Personal info</ENTranslation>
                    </h1>
                  </div>

                  <nav aria-label='breadcrumb'>
                    <ol className='breadcrumb breadcrumb-light mb-0'>
                      <li className='breadcrumb-item'>
                        <VNTranslation>Tài khoản</VNTranslation>
                        <ENTranslation>Account</ENTranslation>
                      </li>
                      <li
                        className='breadcrumb-item active'
                        aria-current='page'
                      >
                        <VNTranslation>Thông tin cá nhân</VNTranslation>
                        <ENTranslation> Personal info</ENTranslation>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className='container content-space-1 content-space-t-lg-0 content-space-b-lg-2 mt-lg-n10'>
            <div className='row'>
              <div className='col-lg-3'>
                <UserNav />
              </div>
              <div className='col-lg-9'>
                <NotificationList />
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </AppProvider>
    </>
  )
}

export default UserNotificationPage
