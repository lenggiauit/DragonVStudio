'use client'
import React, { ReactElement } from 'react'
import { Redirect } from 'react-router-dom'
import Navigation from '../../components/navigation/'
import { AppProvider } from '../../contexts/appContext'

type Props = {
  isPublic?: boolean
  navCssClass?: string
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ navCssClass, children }): ReactElement => {
  return (
    <>
      <AppProvider>
        <div id='top' className='container nav-container'>
          <div className='row'>
            <Navigation navCssClass={navCssClass} />
          </div>
        </div>
        {children}
      </AppProvider>
    </>
  )
}

export default Layout
