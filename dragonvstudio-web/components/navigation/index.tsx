'use client'
import React, { useEffect, useState } from 'react'
import { Translation } from '../../components/translation/'
import { LanguageSelector } from '../languageSelector'
import { AppProvider } from '../../contexts/appContext'
import { hasPermissions, logout } from '../../utils/functions'
import { AnimationLogo } from '../animationLogo'
import { PermissionKeys } from '../../utils/constants'
// import {
//   getSignalRHubConnection,
//   StartSignalRHubConnection,
//   StopSignalRHubConnection,
// } from '../../services/chat'
import { useGetNotificationCountQuery } from '../../services/notification'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

type Props = {
  navCssClass?: string
}

const Navigation: React.FC<Props> = ({ navCssClass }) => {
  const pathName = usePathname()
  const { data: session, status } = useSession()
  const signalRHubConnection = null
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [messageCount, setMessageCount] = useState<Number>(0)
  const getNotificationCountStatus = useGetNotificationCountQuery({
    payload: {},
  })

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY)
    // clean up code
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // Start onload
  // useEffect(() => {
  //   if (session?.user != null) {
  //     StartSignalRHubConnection()
  //   }
  //   return () => {
  //     StopSignalRHubConnection()
  //   }
  // }, [])
  // useEffect(() => {
  //   setTimeout(() => {
  //     const signalRHubConnection = getSignalRHubConnection()
  //     if (signalRHubConnection.state === 'Connected') {
  //       if (session?.user != null) {
  //         signalRHubConnection.send('checkNewMessages', session?.user.id)
  //         //console.log("checkNewMessages");
  //       }
  //       signalRHubConnection.on('onHaveNewMessages', (count) => {
  //         setMessageCount(count)
  //         //console.log(count);
  //       })
  //     }
  //   }, 5000)
  // }, [signalRHubConnection])
  return (
    <>
      <header
        id='header'
        className={`navbar navbar-expand-lg navbar-end navbar-absolute-top 
         ${offset > 10 ? 'navbar-dark navbar-scrolled' : 'navbar-dark  '} 
        
        
        navbar-show-hide `}
      >
        <nav className='navbar navbar-dark'>
          <div className='container'>
            <a className='navbar-brand' href='/'>
              <AnimationLogo width={48} height={48} />
            </a>
            <button
              className='navbar-toggler collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarSupportedContent'
              aria-controls='navbarSupportedContent'
              aria-expanded='true'
              aria-label='Toggle navigation'
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <span className='navbar-toggler-icon'></span>
            </button>
            <div
              className={`collapse navbar-collapse ${
                showMobileMenu ? 'show' : ''
              }`}
              id='navbarSupportedContent'
            >
              <span className='navbar-divider d-mobile-none'></span>

              <ul className='nav nav-navbar nav-text-normal mr-auto'>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${pathName == '/' ? 'active' : ''}`}
                    href='/'
                  >
                    <Translation tid='nav_home' />
                  </a>
                </li>

                <li className='nav-item dropdown '>
                  <a
                    className='nav-link dropdown-toggle'
                    href='/game-server'
                    role='button'
                    data-bs-toggle='dropdown'
                    data-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <Translation tid='nav_games_server' />
                  </a>
                  <ul className='dropdown-menu ' style={{ width: 280 }}>
                    <li className='dropdown-submenu'>
                      <a
                        className={`dropdown-item`}
                        href='/mount-blade-bannerlord'
                      >
                        <span className='rounded-circle border me-1'>
                          <img
                            style={{ width: 48 }}
                            src='/static/images/mount_blade_ii_bannerlord_icon.png'
                          />
                        </span>
                        <Translation tid='nav_mount_blade_bannerlord' />
                      </a>
                    </li>

                    {/* <li className='dropdown-submenu'>
                      <a className={`dropdown-item`} href='/gtav'>
                        <span className='rounded-circle border me-1'>
                          <img
                            style={{ width: 48 }}
                            src='static/images/gta_v.png'
                          />
                        </span>
                        <Translation tid='nav_gtav' />
                      </a>
                    </li> */}
                  </ul>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName == '/gallery' ? 'active' : ''
                    }`}
                    href='/gallery'
                  >
                    <Translation tid='nav_gallery' />
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName == '/contact' ? 'active' : ''
                    }`}
                    href='/contact'
                  >
                    <Translation tid='nav_contact' />
                  </a>
                </li>
              </ul>

              <ul className='nav nav-navbar nav-text-normal ms-auto'>
                {session?.user != null &&
                  hasPermissions(session, [PermissionKeys.Admin]) && (
                    <>
                      <li className='nav-item dropdown'>
                        <a
                          className={`nav-link ${
                            pathName.indexOf('admin') != -1 ? 'active' : ''
                          }`}
                          role='button'
                          data-bs-toggle='dropdown'
                          data-toggle='dropdown'
                          aria-expanded='false'
                          href='#'
                        >
                          <i
                            className='bi bi-gear-fill'
                            style={{ fontSize: 18 }}
                          ></i>
                        </a>
                        <ul className='dropdown-menu'>
                          <li className='dropdown-submenu'>
                            <i
                              className='bi bi-calendar-week'
                              style={{ fontSize: 18 }}
                            ></i>
                            <b>
                              <span className='ms-2'>Management games</span>
                            </b>
                            <ul>
                              <li>
                                <a
                                  className='dropdown-item'
                                  href='/admin/mount-blade-bannerlord'
                                >
                                  <Translation tid='nav_mount_blade_bannerlord' />
                                </a>
                              </li>
                            </ul>
                          </li>

                          <li>
                            <hr className='dropdown-divider' />
                          </li>
                          <li className='dropdown-submenu'>
                            <a className='dropdown-item' href='/admin/users'>
                              <i
                                className='bi bi-people-fill'
                                style={{ fontSize: 18 }}
                              ></i>
                              <span className='ms-2'>
                                <Translation tid='nav_admin_manageUser' />
                              </span>
                            </a>
                          </li>
                          <li>
                            <hr className='dropdown-divider' />
                          </li>
                          <li className='dropdown-submenu'>
                            <a
                              className='dropdown-item'
                              href='/admin/manageFeedback'
                            >
                              <i
                                className='bi bi-hand-thumbs-up'
                                style={{ fontSize: 18 }}
                              ></i>
                              <span className='ms-2'>
                                <Translation tid='nav_admin_manageFeedback' />
                              </span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}
                {session?.user != null && (
                  <>
                    <li className='nav-item'>
                      <a
                        className={`nav-link ${
                          pathName.indexOf('user/notifications') != -1
                            ? 'active'
                            : ''
                        }`}
                        href='/user/notifications'
                      >
                        <i className='bi bi-bell' style={{ fontSize: 18 }}></i>
                        <span className='badge badge-number badge-danger'>
                          {getNotificationCountStatus.isSuccess &&
                            getNotificationCountStatus.data.resource && (
                              <>{getNotificationCountStatus.data.resource}</>
                            )}
                        </span>
                      </a>
                    </li>

                    <li className='nav-item dropdown'>
                      <a
                        className={`nav-link ${
                          pathName.indexOf('profile') != -1 ||
                          pathName.indexOf('propertylist') != -1 ||
                          pathName.indexOf('profile') != -1
                            ? 'active'
                            : ''
                        }`}
                        role='button'
                        data-bs-toggle='dropdown'
                        data-toggle='dropdown'
                        aria-expanded='false'
                        href='#'
                      >
                        <i
                          className='bi bi-person-circle'
                          style={{ fontSize: 18 }}
                        ></i>
                      </a>
                      <ul className='dropdown-menu'>
                        <li>
                          <h4 className='dropdown-item-text'>
                            {session?.user.email}
                          </h4>
                        </li>
                        <li>
                          <hr className='dropdown-divider' />
                        </li>
                        <li>
                          <a className='dropdown-item' href='/user/profile'>
                            <i
                              className='bi bi-person-circle'
                              style={{ fontSize: 18 }}
                            ></i>
                            <span className='ms-2'>
                              <Translation tid='nav_profile' />
                            </span>
                          </a>
                        </li>
                        <li>
                          <a
                            className='dropdown-item'
                            href='/user/mount-blade-bannerlord'
                          >
                            <span className='rounded-circle border me-1'>
                              <img
                                style={{ width: '18px' }}
                                src='/static/images/mount_blade_ii_bannerlord_icon.png'
                              />
                            </span>
                            <span className='ms-2'>
                              <Translation tid='nav_mount_blade_bannerlord' />
                            </span>
                          </a>
                        </li>

                        <li>
                          <hr className='dropdown-divider' />
                        </li>
                        <li>
                          <a
                            className='dropdown-item'
                            href='#'
                            onClick={() => logout()}
                          >
                            <i
                              className='bi bi-box-arrow-right'
                              style={{ fontSize: 18 }}
                            ></i>
                            <span className='ms-2'>
                              <Translation tid='nav_logout' />
                            </span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                {session?.user == null && (
                  <>
                    <li className='nav-item'>
                      <a
                        className='btn btn-sm btn-round btn-success'
                        href='/login'
                      >
                        <Translation tid='nav_login' />
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a
                        className='btn btn-sm btn-round btn-primary ml-1'
                        href='/register'
                      >
                        <Translation tid='nav_register' />
                      </a>
                    </li>
                  </>
                )}
                <LanguageSelector />
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navigation
