'use client'
import { ReactElement } from 'react'
import { Translation } from '../translation'
import TypingText from '../typingText'

const Introduce: React.FC = () => {
  return (
    <>
      <section id='introduce' className='gradient-y-gray position-relative'>
        <div className='container d-lg-flex align-items-lg-center content-space-t-3 content-space-lg-0 min-vh-lg-100 introduce'>
          <div className='row'>
            <div className='col-lg-6 order-lg-first order-last mb-5'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className='mb-5'>
                    <h1 className='display-4 mb-3'>
                      <Translation tid='welcometo_title' /> <br></br>
                      <span className='text-primary text-highlight-warning'>
                        <TypingText />
                      </span>
                    </h1>

                    <p className='lead'>
                      <Translation tid='welcometo_desc' />
                    </p>
                  </div>

                  <div className='d-grid d-flex gap-3 '>
                    <a
                      className='btn btn-primary-special btn-transition btn-introduce  '
                      style={{ width: '165px' }}
                      href='#about'
                    >
                      <Translation tid='welcometo_aboutme' />
                    </a>
                    <a
                      className='btn-transition'
                      target='_blank'
                      href='https://www.facebook.com/NaAndStories'
                    >
                      <i
                        className='bi bi-facebook'
                        style={{ fontSize: '28px' }}
                      ></i>
                    </a>
                    <a
                      className='btn-transition'
                      target='_blank'
                      href='https://www.linkedin.com/in/vanthikimchi/'
                    >
                      <i
                        className='bi bi-linkedin text-info'
                        style={{ fontSize: '28px' }}
                      ></i>
                    </a>
                    <a
                      className='btn-transition'
                      target='_blank'
                      href='https://www.youtube.com/@nastories'
                    >
                      <i
                        className='bi bi-youtube text-danger'
                        style={{ fontSize: '28px' }}
                      ></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6 introduce-image'>
              <img
                style={{ width: '100%' }}
                src='./assets/images/ChiVan.png'
                alt='DragonSeeker'
              />
              <span className='introduce-services private-talk bubble '>
                <img
                  className='anim_moveBottom'
                  src='./assets/images/private-talk.png'
                  alt='Private Talk'
                />
              </span>
              <span className='introduce-services mock-interview bubble '>
                <img
                  className='anim_moveBottom'
                  src='./assets/images/mock-interview.png'
                  alt='Mock Interview'
                />
              </span>
              <span className='introduce-services sharing bubble '>
                <img
                  className='anim_moveBottom'
                  src='./assets/images/sharing.png'
                  alt='Sharing'
                />
              </span>
            </div>
          </div>
          <div
            className='shape shape-bottom zi-1'
            style={{ marginBottom: '-.125rem' }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              viewBox='0 0 1920 100.1'
            >
              <path
                fill='#fff'
                d='M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z'
              ></path>
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}

export default Introduce
