'use client'
import React, { ReactElement } from 'react'

type Props = {
  isPublic?: boolean
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ children }): ReactElement => {
  return (
    <>
      <main
        id='content'
        role='main'
        className='bg-white flex-grow-1 d-flex align-items-center min-h-100 min-vh-lg-100 min-vh-md-100 min-vh-sm-100'
      >
        <div className='container-fluid'>
          <div className='row'>
            <div
              className='col-lg-5 col-xl-4 d-none d-lg-flex justify-content-center align-items-center min-vh-lg-100 position-relative bg-dark'
              style={{
                backgroundImage: 'url(./assets/svg/wave-pattern-light.svg)',
              }}
            >
              <div className='flex-grow-1 p-5'>
                <figure className='text-center'>
                  <blockquote className='blockquote blockquote-light'>
                    “Welcome to Dragon V Studio”
                  </blockquote>

                  <figcaption className='blockquote-footer blockquote-light'>
                    <div className='mb-3'>
                      <img
                        className='avatar avatar-xxl avatar-circle'
                        src='./assets/images/Logo.png'
                        alt='DragonSeeker'
                      />
                    </div>
                    DragonSeeker
                    <span className='blockquote-footer-source'>
                      Team Lead | Dragon V Studio
                    </span>
                  </figcaption>
                </figure>
              </div>
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}

export default AuthLayout
