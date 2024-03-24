import { auth } from '@/auth'
import RegisterForm from '@/components/registerForm'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import LoginForm from '@/components/loginForm'
import { AnimationLogo } from '@/components/animationLogo'
import Wave from 'react-wavify'
import AuthLayout from '@/components/layout/authLayout'
import { Translation } from '@/components/translation'
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
    description: 'Login - Dragon V Studio',
    openGraph: {
      //images: appSetting.SiteUrl + '/images/photos/all_albums.jpg',
      title: 'Dragon V Studio',
      description: 'Login - Dragon V Studio',
      url: appSetting.SiteUrl + '/register',
    },
  }
}
const Login: NextPage = async () => {
  return (
    <>
      <AuthLayout>
        {/* Login form */}
        <div className='col-lg-7 col-xl-8 d-flex justify-content-center align-items-center min-vh-lg-100 min-vh-md-100 min-vh-sm-100'>
          <div className='flex-grow-1 mx-auto' style={{ maxWidth: '28rem' }}>
            <div className='text-center mb-5 mb-md-7'>
              <h1 className='h2'>
                <Translation tid='login_title' />
              </h1>
              <p>
                <Translation tid='login_des' />
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
        {/* end Login form */}
      </AuthLayout>
    </>
  )
}

export default Login
