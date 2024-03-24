'use client'
import dateFormat from 'dateformat'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppContext } from '../../../contexts/appContext'
import { dictionaryList } from '../../../locales'
import { useGetEventBookingAvaiableDateQuery } from '../../../services/event'
import { User } from '../../../services/models/user'
import { EventBookingDateResource } from '../../../services/resources/eventBookingDateResource'
import { UserResource } from '../../../services/resources/userResource'
import { AppSetting } from '../../../types/type'
import showConfirmModal from '../../modal'
import showDialogModal from '../../modal/showModal'
import { Translation } from '../../translation'
const appSetting: AppSetting = require('../../../appSetting.json')

type Props = {
  dataItem: UserResource
  onSelected: (dataItem: UserResource) => void
}

const AdminUserItem: React.FC<Props> = ({ dataItem, onSelected }) => {
  return (
    <>
      <div className={`col-md-12`}>
        <div className='row admin-post-item border-top border-light mt-2'>
          <div className='col-3 text-left'>
            {dataItem.name == null ? dataItem.email : dataItem.name}
          </div>
          <div className='col-3 text-left'>{dataItem.fullName}</div>
          <div className='col-3 text-left'>{dataItem.email}</div>
          <div className='col-3 text-center'>
            {dateFormat(dataItem.createdDate, 'mmm dd, yyyy - HH:MM')}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminUserItem
