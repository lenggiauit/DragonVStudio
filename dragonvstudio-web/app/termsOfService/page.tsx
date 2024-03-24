import React, { ReactElement } from 'react'
import Footer from '../../components/footer'
import Layout from '../../components/layout'
import { Metadata, ResolvingMetadata } from 'next'
import { AppSetting } from '@/types/type'
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
    description: 'Terms of service - Dragon V Studio',
    openGraph: {
      images: appSetting.SiteUrl + '/assets/images/Logo.png',
      title: 'Dragon V Studio',
      description: 'Terms of service - Dragon V Studio',
      url: appSetting.SiteUrl + '/termsOfService',
    },
  }
}
const TermOfServicePage: React.FC = (): ReactElement => {
  return (
    <>
      <Layout isPublic={true}>
        <section className='section'>
          <div className='container'>
            <header className='section-header'>
              <h2>Terms of Service</h2>
              <hr />
            </header>
            <div className='row gap-y text-center'>
              <p className='lead'>
                Terms of service are the legal agreements between a service
                provider and a person who wants to use that service. The person
                must agree to abide by the terms of service in order to use the
                offered service. Terms of service can also be merely a
                disclaimer, especially regarding the use of websites
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </Layout>
    </>
  )
}

export default TermOfServicePage
