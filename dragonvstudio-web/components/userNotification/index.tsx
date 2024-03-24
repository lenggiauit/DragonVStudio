'use client'
import React, { ReactElement, useState } from 'react'
import {
  useGetNotificationQuery,
  useRemoveAllMutation,
} from '../../services/notification'
import { ResultCode } from '../../utils/enums'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import NotificationItem from './item'
import { v4 } from 'uuid'
import PageLoading from '../pageLoading'

const NotificationList: React.FC = (): ReactElement => {
  const getNotificationQueryStatus = useGetNotificationQuery({ payload: {} })
  const [removeAllNotify, removeAllNotifyStatus] = useRemoveAllMutation()
  const [isRemoveAll, setIsRemoveAll] = useState(false)
  return (
    <>
      {getNotificationQueryStatus.isLoading && (
        <>
          <PageLoading />
        </>
      )}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <h4 className='card-header-title text-dark'>
              <Translation tid='header_notification_title' />
            </h4>
          </div>
          <div className='card-body'>
            {isRemoveAll ||
              (getNotificationQueryStatus.data &&
                getNotificationQueryStatus.data.resultCode ==
                  ResultCode.Success &&
                getNotificationQueryStatus.data.resource.length > 0 && (
                  <a
                    href='#'
                    className='btn btn-link'
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      zIndex: 10,
                    }}
                    onClick={(e) => {
                      removeAllNotify({ payload: {} })
                      setIsRemoveAll(true)
                    }}
                  >
                    Remove all
                  </a>
                ))}
            <div className='row'>
              {!isRemoveAll &&
                getNotificationQueryStatus.data &&
                getNotificationQueryStatus.data.resultCode ==
                  ResultCode.Success &&
                getNotificationQueryStatus.data.resource.map((notify) => (
                  <NotificationItem
                    key={v4()}
                    dataItem={notify}
                    onDelete={() => {
                      getNotificationQueryStatus.refetch()
                    }}
                  />
                ))}
              {getNotificationQueryStatus.data &&
                getNotificationQueryStatus.data.resultCode ==
                  ResultCode.Success &&
                getNotificationQueryStatus.data.resource.length == 0 && (
                  <>
                    <div className='col text-center'>
                      <small>
                        <Translation tid='notification_notfound' />
                      </small>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationList
