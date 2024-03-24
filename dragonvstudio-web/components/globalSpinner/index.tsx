'use client'
import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import Loader from 'react-loader-spinner'
import './globalSpinner.css'
const GlobalSpinner: React.FC = () => {
  const { promiseInProgress } = usePromiseTracker()
  return (
    <>
      {promiseInProgress && (
        <div className='spinner'>
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
      )}
    </>
  )
}

export default GlobalSpinner
