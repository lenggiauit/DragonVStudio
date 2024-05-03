import React from 'react'
import Image from 'next/image'

// import worldMap from 'static/images/world-map.webp'

const ServerLocations = () => {
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 offset-lg-3 text-center'>
            <div className='subtitle fadeInUp mb-3'>Server locations</div>
          </div>
          <div className='col-lg-6 offset-lg-3 text-center'>
            <h2 className='fadeInUp1 mb20'>03 servers worldwide.</h2>
          </div>

          <div className='spacer-10'></div>

          <div className='col-lg-12 fadeInUp'>
            <div className='p-sm-30 pb-sm-0 mb-sm-0'>
              <div className='de-map-hotspot'>
                <div
                  className='de-spot fadeIn'
                  style={{ top: '23%', left: '18%' }}
                >
                  <span>Canada</span>
                  <div className='de-circle-1'></div>
                  <div className='de-circle-2'></div>
                </div>

                <div
                  className='de-spot fadeIn'
                  style={{ top: '35%', left: '50%' }}
                >
                  <span>Europe</span>
                  <div className='de-circle-1'></div>
                  <div className='de-circle-2'></div>
                </div>

                <div
                  className='de-spot fadeIn'
                  style={{ top: '62%', left: '78%' }}
                >
                  <span>Singapore</span>
                  <div className='de-circle-1'></div>
                  <div className='de-circle-2'></div>
                </div>

                <img
                  src='static/images/world-map.webp'
                  className='img-fluid'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServerLocations
