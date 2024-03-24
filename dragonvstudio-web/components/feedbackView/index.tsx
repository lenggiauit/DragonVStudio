'use client'
import Slider from 'react-slick'
import { v4 } from 'uuid'
import {
  useGetFeedbackListQuery,
  useGetYoutubevideosQuery,
} from '../../services/home'
import { GlobalKeys } from '../../utils/constants'
import { ResultCode } from '../../utils/enums'
import LocalSpinner from '../localSpinner'
import PageLoading from '../pageLoading'
import { ENTranslation, Translation, VNTranslation } from '../translation'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import React, { useState } from 'react'

const FeedbackView: React.FC = () => {
  const getFeedbackListQueryStatus = useGetFeedbackListQuery(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider({
    slideChanged(slider) {
      const relativeSlide = slider.track.details.rel
      console.log({ relativeSlide })
      setCurrentSlide(relativeSlide)
    },
    created() {
      setLoaded(true)
    },
    breakpoints: {
      '(min-width: 1024px)': {
        slides: { perView: 2, spacing: 15 },
      },
      '(min-width: 1400px)': {
        slides: { perView: 3, spacing: 15 },
      },
    },
    slides: { perView: 1 },
  })

  return (
    <>
      <section className='section feedback position-relative'>
        <div className='container'>
          <div className='row text-center position-relative '>
            <h2 className='title display-5 text-center'>
              <ENTranslation>What My Clients Say</ENTranslation>
              <VNTranslation>Những gì Khách hàng của Tôi Nói</VNTranslation>
            </h2>

            <div className='row gap-y text-center'>
              {getFeedbackListQueryStatus.isLoading && <LocalSpinner />}
              {getFeedbackListQueryStatus.data &&
                getFeedbackListQueryStatus.data.resultCode ==
                  ResultCode.Success && (
                  <>
                    <div className='navigation-wrapper'>
                      <div ref={sliderRef} className='keen-slider'>
                        {getFeedbackListQueryStatus.data.resource.map((c) => (
                          <div key={v4()} className='keen-slider__slide'>
                            <div className='feedback-item'>
                              <div className='feedback-image'>
                                <img
                                  className='main avatar rounded-circle'
                                  src={c.user.avatar}
                                />
                              </div>
                              <div className='feedback-rating'>
                                {Array.from(
                                  Array(Math.ceil(c.rating)),
                                  (e, i) => (
                                    <span
                                      key={v4()}
                                      className='iconbox rating-color iconbox-sm mr-1'
                                    >
                                      <i
                                        className='bi bi-star-fill'
                                        style={{ fontSize: 14 }}
                                      ></i>
                                    </span>
                                  )
                                )}
                              </div>
                              <div className='feedback-comment'>
                                <p>{c.comment}</p>
                              </div>
                              <div className='feedback-username'>
                                {c.user.fullName
                                  ? c.user.fullName
                                  : c.user.email
                                      .toString()
                                      .substring(
                                        0,
                                        c.user.email.toString().indexOf('@')
                                      )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {loaded && instanceRef.current && (
                      <div className='dots'>
                        {[
                          ...Array(
                            instanceRef.current.track.details.slides.length
                          ).keys(),
                        ].map((idx) => {
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                instanceRef.current?.moveToIdx(idx)
                              }}
                              className={
                                'dot' + (currentSlide === idx ? ' active' : '')
                              }
                            ></button>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
        <div className='left_details'>
          <div
            className='det_image one wow fadeIn'
            data-wow-duration='1s'
            style={{
              backgroundImage: 'url("/assets/images/user-1.jpg")',
              visibility: 'visible',
              animationDuration: '1s',
            }}
          ></div>
          <div
            className='det_image two wow fadeIn'
            style={{
              backgroundImage: 'url("/assets/images/user-8.jpg")',
              visibility: 'visible',
              animationDuration: '1s',
            }}
          ></div>

          <span className='circle green animPulse'></span>
          <span className='circle yellow animPulse'></span>
          <span className='circle border animPulse'></span>
        </div>
        <div className='right_details'>
          <div
            className='det_image one wow fadeIn'
            style={{
              backgroundImage: 'url("/assets/images/user-3.jpg")',
              visibility: 'visible',
              animationDuration: '1s',
            }}
          ></div>

          <div
            className='det_image three wow fadeIn'
            style={{
              backgroundImage: 'url("/assets/images/user-4.jpg")',
              visibility: 'visible',
              animationDuration: '1s',
            }}
          ></div>

          <span className='circle yellow animPulse'></span>
          <span className='circle purple animPulse'></span>
          <span className='circle border animPulse'></span>
        </div>
      </section>
    </>
  )
}

export default FeedbackView
