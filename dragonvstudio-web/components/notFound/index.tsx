'use client'
import { type } from 'os'
import { ReactElement, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { PostDataItem } from '../../services/models/postDataItem'
import { Translation } from '../translation'

const NotFound: React.FC = ({}): ReactElement => {
  return (
    <>
      <div className='container'>
        <div className='row '>
          <div className='col-md-12'>
            <p className='lead text-center'>
              <small>
                <Translation tid='result_notfound' />
              </small>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
