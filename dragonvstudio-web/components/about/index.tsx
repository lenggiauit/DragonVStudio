'use client'
import { ENTranslation, VNTranslation } from '../translation'

const About: React.FC = () => {
  return (
    <>
      <section
        id='about'
        className='about section position-relative overflow-hidden'
      >
        <div className='container'>
          <div className='row'>
            <div className='col-lg-4 position-relative'>
              <img
                style={{ width: '100%' }}
                src='./assets/images/Logo.png'
                alt='DragonSeeker'
              />
              <div className='numbers year'>
                <div className='wrapper'>
                  <h3>
                    <span className='count-text' data-from='0' data-to='18'>
                      10+
                    </span>
                  </h3>
                  <span className='name'>
                    Years of
                    <br />
                    Success
                  </span>
                </div>
              </div>
              <div className='numbers project'>
                <div className='wrapper'>
                  <h3>
                    <span className='count-text' data-from='0' data-to='9'>
                      8
                    </span>
                    K+
                  </h3>
                  <span className='name'>Subscribers</span>
                </div>
              </div>
            </div>
            <div className='col-lg-8'>
              <div className='mb-5 mb-md-10'>
                <h2 className='title display-5'>
                  <ENTranslation>About Dragon V Studio</ENTranslation>
                  <VNTranslation>Về Dragon V Studio</VNTranslation>
                </h2>
                <div className='desc'></div>
              </div>
            </div>
          </div>

          <div
            className='brush_1 wow fadeInLeft'
            data-wow-duration='1s'
            style={{
              zIndex: -99,
              visibility: 'visible',
              animationDuration: '1s',
            }}
          >
            <img src='/assets/images/brushes/about/1.png' alt='image' />
          </div>

          <div
            className='brush_2 wow fadeInRight'
            data-wow-duration='1s'
            style={{ visibility: 'visible', animationDuration: '1s' }}
          >
            <img src='/assets/images/brushes/about/2.png' alt='image' />
          </div>
        </div>
      </section>
    </>
  )
}

export default About
