'use client'
import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import './spinner.css'
const LocalSpinner: React.FC = () => {
  return (
    <div className='local-spinner'>
      <div>
        <div className='lds-roller'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default LocalSpinner
