'use client'
import React from 'react'
import './loading.css'
const PageLoading: React.FC = () => {
  return (
    <div className='page-loading-logo'>
      <div className='logo'>
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

export default PageLoading
