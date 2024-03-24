'use client'

import { ReactElement } from 'react'
import { ENTranslation, VNTranslation } from '../translation'
import Footer from '../footer'
import AdminGameNav from '../adminGameNav'

type Props = {
  children: React.ReactNode
}

const AdminGameLayout: React.FC<Props> = ({ children }): ReactElement => {
  return (
    <>
      <main
        id='content'
        role='main'
        className='overflow-hidden position-relative'
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
                    <li className='breadcrumb-item active' aria-current='page'>
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
              <AdminGameNav />
            </div>
            <div className='col-lg-9'>{children}</div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default AdminGameLayout
