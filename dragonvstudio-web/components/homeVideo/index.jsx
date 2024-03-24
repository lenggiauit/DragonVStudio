'use client'
import React from 'react'
import { Parallax } from 'react-parallax'
import YouTubePlayer from '@/components/youtubeplayer'
import Image from 'next/image'
import Link from 'next/link'

const HomeVideo = () => {
  const videoId = 'gAUZkMUrT6M' //'QB2DfxkaBeU'
  return (
    <Parallax className='home-video'>
      <div className='iframeyoutube'>
        <YouTubePlayer videoId={videoId} />
      </div>

      <div className='de-gradient-edge-top'></div>

      <div className='overlay-bg d-flex align-items-center justify-content-center vh-100 '>
        <div className='mx-auto'>
          <div className='container z-1000'>
            <div className='row align-items-center'>
              <div className='col-lg-10 offset-lg-1 text-center'>
                <div className='subtitle blink mb-4'>Games Are Available</div>
                <h1 className='mb-0 '>Mount&Blade II Bannerlord</h1>
              </div>
              <div className='col-lg-6 offset-lg-3 text-center text-white'>
                <p className=''>
                  Mount & Blade II: Bannerlord is a strategic action
                  role-playing video game, We are hosting a server game with a
                  lot of fun and we are making our special maps...
                </p>
                <a
                  className='btn-main'
                  target='_blank'
                  href='https://discord.gg/dragonvstudio'
                >
                  Join Our Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='de-gradient-edge-bottom'></div>
    </Parallax>
  )
}

export default HomeVideo
