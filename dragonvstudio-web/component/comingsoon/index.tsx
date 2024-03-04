'use client'
const ComingSoon: React.FC = () => {
  return (
    <>
      <section className='xl:h-screen flex justify-center items-center relative py-10'>
        <div className='overflow-hidden'>
          <img
            className='absolute inset-0 h-full w-full object-cover'
            src='assets/images/4.jpg'
            alt='Dragon V Studio'
          />
          <div className='absolute inset-0 w-full h-full bg-gradient-to-r from-neutral-950/90 to-orange-500/50'></div>
        </div>
        <div className='relative'>
          <div>
            <div className='text-center mt-12'>
              <a href='#' className='flex justify-center mx-auto mb-12'>
                <img
                  src='assets/images/logo.png'
                  alt='logo'
                  style={{ width: 125 }}
                />
              </a>
              <h3 className='text-xl mb-5 font-medium text-gray-200'>
                Our Dragon V Studio Site is
              </h3>
              <h2 className='text-5xl uppercase mb-5 text-white'>
                Coming Soon
              </h2>
              <h3 className='text-xl font-medium text-gray-200'>Stay Tuned</h3>
            </div>

            <div className='flex items-center justify-center mt-24 mb-20'>
              <div className='text-white'>
                <div className='flex flex-wrap items-center justify-center gap-10'>
                  <div className='text-center w-40 h-40 rounded-full bg-neutral-900/30 flex items-center justify-center'>
                    <div>
                      <span id='days' className='text-3xl lg:text-5xl'></span>
                      <p className='mt-2 text-base'>days</p>
                    </div>
                  </div>

                  <div className='text-center w-40 h-40 rounded-full bg-neutral-900/30 flex items-center justify-center'>
                    <div>
                      <span id='hours' className='text-3xl lg:text-5xl'></span>
                      <p className='mt-2 text-base'>Hours</p>
                    </div>
                  </div>

                  <div className='text-center w-40 h-40 rounded-full bg-neutral-900/30 flex items-center justify-center'>
                    <div>
                      <span
                        id='minutes'
                        className='text-3xl lg:text-5xl'
                      ></span>
                      <p className='mt-2 text-base'>Minutes</p>
                    </div>
                  </div>

                  <div className='text-center w-40 h-40 rounded-full bg-neutral-900/30 flex items-center justify-center'>
                    <div>
                      <span
                        id='seconds'
                        className='text-3xl lg:text-5xl'
                      ></span>
                      <p className='mt-2 text-base'>Seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='text-center'>
              <i className='fa-solid fa-arrow-down-long text-2xl text-white'></i>

              <div className='mt-14'>
                <a
                  target='_blank'
                  href='https://discord.com/invite/YajZK2Tk'
                  className='py-3 px-6 text-xl font-semibold rounded-full text-orange-500 bg-white uppercase'
                >
                  Join Discord
                </a>
              </div>
            </div>

            <p className='opacity-75 text-white text-center pt-20'>
              ©2024 Design with
              <i className='fa-solid fa-heart text-red-500'></i>
              <a href='#'> by lenggiauit@gmail.com.</a>
            </p>
          </div>
        </div>
        <div className='absolute end-0 top-1/2 md:block hidden me-2'>
          <div className='flex items-center justify-center gap-5 rotate-90'>
            <a
              target='_blank'
              href='https://discord.com/invite/YajZK2Tk'
              className='-rotate-90 text-xl text-white hover:text-blue-600 transition-all'
            >
              <i className='fa-brands fa-discord'></i>
            </a>
            <a
              target='_blank'
              href='https://www.youtube.com/@DragonVStudio'
              className='-rotate-90 text-xl text-white hover:text-blue-600 transition-all'
            >
              <i className='fa-brands fa-youtube'></i>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default ComingSoon
