'use client'
import React, { ReactElement } from 'react'
import Navigation from '../../components/navigation/'
import { AppProvider } from '../../contexts/appContext'
import { AnimationLogo } from '../animationLogo'
import { Translation } from '../translation'

const TermOfService: React.FC = (): ReactElement => {
  return (
    <>
      <section className='section'>
        <div className='container'>
          <div className='row gap-y text-center'>
            <p className='lead'>
              Terms of service are the legal agreements between a service
              provider and a person who wants to use that service. The person
              must agree to abide by the terms of service in order to use the
              offered service. Terms of service can also be merely a disclaimer,
              especially regarding the use of websites
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default TermOfService
