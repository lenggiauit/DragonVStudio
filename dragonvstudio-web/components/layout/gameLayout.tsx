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
          <div className='container content-space-t-2 overflow-hidden content-space-t-lg-3 content-space-b-2 position-relative '>
            <div className='row align-items-center'>
              <div className='col'>
                <div className='d-none d-lg-block'>
                  <h1 className='h2 text-white'>
                    <ENTranslation> Game Server Info</ENTranslation>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className=' px-10 content-space-1 content-space-t-lg-0 content-space-b-lg-2 mt-lg-n10'
          style={{ zIndex: 99 }}
        >
          <div className='row'>
            <div className='col-md-2'>
              <AdminGameNav />
            </div>
            <div className='col-md-10'>{children}</div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}

export default AdminGameLayout
