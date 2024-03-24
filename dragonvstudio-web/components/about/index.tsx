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
                src='./assets/images/NaStories-about.png'
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
                <div className='desc'>
                  <ENTranslation>
                    <p>
                      Because Na's expertise is in IT Business Analyst and
                      Product Owner, you will see a lot of content revolving
                      around these two career fields. If you are also in the
                      industry or are looking for related opportunities, I hope
                      Na has can accompany you.
                    </p>
                    <p>
                      Currently, Na is studying abroad in Canada to pursue new
                      experiences in a foreign country, so there will be many
                      things Na wants to tell you from the perspective of an
                      "older" international student, if you are also curious.
                      Remember to visit Na often.
                    </p>
                    <p>
                      Now, we invite you to take a tour to explore the useful
                      content that Na sends you!
                    </p>
                  </ENTranslation>
                  <VNTranslation>
                    <p>
                      Vì chuyên môn của Na là về IT Business Analyst và Product
                      Owner, nên bạn sẽ thấy khá nhiều nội dung xoay quanh hai
                      mảng nghề nghiệp này, nếu bạn cũng là dân trong ngành hoặc
                      đang tìm kiếm cơ hội liên quan thì mong là Na có thể đồng
                      hành cùng bạn nhé.
                    </p>
                    <p>
                      Hiện tại, Na đang du học tại Canada để theo đuổi những
                      trải nghiệm mới nơi xứ người, nên sẽ có rất nhiều điều Na
                      muốn kể cho bạn nghe dưới góc nhìn của một du học sinh
                      “nhiều tuổi”, nếu bạn cũng tò mò thì nhớ ghé thăm Na
                      thường xuyên nha.
                    </p>
                    <p>
                      Còn bây giờ thì mời bạn tham quan một vòng để khám phá
                      những nội dung hữu ích mà Na gửi đến bạn nhé!
                    </p>
                  </VNTranslation>
                </div>
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
