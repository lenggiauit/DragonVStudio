'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { AnimationLogo } from '../animationLogo'
import { Translation } from '../translation'
import { LanguageSelector } from '../languageSelector'

const Footer: React.FC = (): ReactElement => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY)
    // clean up code
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      <footer>
        <div className='container pb-1 pb-lg-7'>
          <div className='border-top my-7'></div>
          <div className='row mb-7'>
            <div className='col-sm-1' style={{ marginTop: '-10px' }}>
              <a className='navbar-brand' href='/' aria-label='Space'>
                <AnimationLogo width={48} height={48} />
              </a>
            </div>
            <div className='col-sm mb-3 mb-sm-0'>
              <ul className='footer-menu list-inline list-separator mb-0 '>
                <li className='list-inline-item'>
                  <a className='text-body' href='/'>
                    <Translation tid='nav_home' />
                  </a>
                </li>
                {/* <li className='list-inline-item'>
                  <a className='text-body' href='/blog'>
                    <Translation tid='nav_blog' />
                  </a>
                </li> */}
                <li className='list-inline-item'>
                  <a className='text-body' href='/mount-blade-bannerlord'>
                    <Translation tid='nav_mount_blade_bannerlord' />
                  </a>
                </li>
                {/* <li className='list-inline-item'>
                  <a className='text-body' href='/gtav'>
                    <Translation tid='nav_gtav' />
                  </a>
                </li> */}

                <li className='list-inline-item'>
                  <a className='text-body' href='/gallery'>
                    <Translation tid='nav_gallery' />
                  </a>
                </li>
                <li className='list-inline-item'>
                  <a className='text-body' href='/contact'>
                    <Translation tid='nav_contact' />
                  </a>
                </li>
              </ul>
            </div>

            <div className='col-sm-auto'>
              <ul className='list-inline mb-0'>
                <li className='list-inline-item social-icons'>
                  <a
                    target='_blank'
                    className='btn btn-ghost-secondary btn-sm btn-icon rounded-circle'
                    href='https://discord.gg/dragonvstudio'
                  >
                    <i className='bi-discord'></i>
                  </a>
                </li>
                <li className='list-inline-item social-icons'>
                  <a
                    target='_blank'
                    className='btn btn-ghost-secondary btn-sm btn-icon rounded-circle'
                    href='https://www.youtube.com/@dragonvstudio'
                  >
                    <i className='bi-youtube'></i>
                  </a>
                </li>
                <li className='list-inline-item social-icons'>
                  <a
                    target='_blank'
                    className='btn btn-ghost-secondary btn-sm btn-icon rounded-circle'
                    href='https://www.facebook.com/DragonVStudio'
                  >
                    <i className='bi-facebook'></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='w-md-85 text-lg-center mx-lg-auto'>
            <p className='text-muted small'>
              © 2024 Dragon V Studio, Lenggiauit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
