'use client'
import { Translation } from '../translation'

const CoverHeader: React.FC = () => {
  return (
    <>
      <header
        className='header text-white'
        data-overlay='7'
        style={{
          backgroundImage: `url(../../assets/images/NaStories_cover.jpg)`,
        }}
      >
        <div className='container text-center'>
          <div className='row '>
            <div className='col-lg-8 mx-auto py-7'>
              <h1 className='display-3 fw-500'>
                <Translation tid='header_cover_title' />
              </h1>
              <p className='lead-2 mt-6'>
                <Translation tid='header_cover_description' />
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default CoverHeader
