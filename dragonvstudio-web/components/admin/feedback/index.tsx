'use client'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { useAppContext } from '../../../contexts/appContext'
import { dictionaryList } from '../../../locales'
import {
  useDeleteFeedbackMutation,
  useGetFeedbackListMutation,
  useGetUserListMutation,
  useUpdateFeedbackStatusMutation,
} from '../../../services/admin'
import { useGetEventBookingAvaiableDateQuery } from '../../../services/event'
import { User } from '../../../services/models/user'
import { FeedbackResource } from '../../../services/resources/feedbackResource'

import { UserResource } from '../../../services/resources/userResource'
import { AppSetting, MetaData, Paging } from '../../../types/type'
import { ResultCode } from '../../../utils/enums'
import showConfirmModal from '../../modal'
import showDialogModal from '../../modal/showModal'
import Pagination from '../../pagination'
import { Translation } from '../../translation'

const appSetting: AppSetting = require('../../../appSetting.json')

const AdminFeedbackList: React.FC = (): ReactElement => {
  const { locale } = useAppContext()
  // get list
  const [getFeedbackList, getFeedbackListStatus] = useGetFeedbackListMutation()
  const [updateFeedbackStatus, updateFeedbackStatus_Status] =
    useUpdateFeedbackStatusMutation()
  const [deleteFeedback, deleteFeedbackStatus] = useDeleteFeedbackMutation()
  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [FeedbackList, setFeedbackList] = useState<FeedbackResource[]>([])

  const pagingChangeEvent: any = (p: Paging) => {
    let mp: Paging = {
      index: p.index,
      size: p.size,
    }
    setPagingData(mp)
  }
  useEffect(() => {
    let md: MetaData = {
      paging: pagingData,
    }
    setMetaData(md)
  }, [pagingData])

  useEffect(() => {
    getFeedbackList({ payload: { keywords: '' }, metaData: metaData })
  }, [metaData])

  useEffect(() => {
    if (
      getFeedbackListStatus.isSuccess &&
      getFeedbackListStatus.data.resource != null
    ) {
      let data = getFeedbackListStatus.data.resource
      if (data.length > 0) {
        setTotalRows(data[0].totalRows)
      } else {
        setTotalRows(0)
      }
      setFeedbackList(data)
    }
  }, [getFeedbackListStatus])

  const onSelectedHandler = useCallback((dataDetail: FeedbackResource) => {
    showDialogModal({ message: 'Cập nhật thành công' })
  }, [])

  useEffect(() => {
    if (
      deleteFeedbackStatus.isSuccess &&
      deleteFeedbackStatus.data.resultCode != null
    ) {
      getFeedbackList({ payload: { keywords: '' }, metaData: metaData })
    }
  }, [deleteFeedbackStatus])

  useEffect(() => {
    if (
      updateFeedbackStatus_Status.isSuccess &&
      updateFeedbackStatus_Status.data.resultCode != null
    ) {
      getFeedbackList({ payload: { keywords: '' }, metaData: metaData })
    }
  }, [updateFeedbackStatus_Status])

  return (
    <>
      <section className='section'>
        <div className='container'>
          <header className='section-header'>
            <h2>Manage Feedback</h2>
            <hr />
          </header>
          <div data-provide='shuffle'>
            <div className='row gap-y gap-2' data-shuffle='list'>
              <div className='col-md-12'>
                <div className='row admin-post-header'>
                  <div className='col-2 text-left'>User</div>
                  <div className='col-1 text-left'>Rating</div>
                  <div className='col-5 text-left'>User feedback</div>
                  <div className='col-2 text-center'>Status</div>
                  <div className='col-2 text-center'>Action</div>
                </div>
              </div>
            </div>
            {FeedbackList.length > 0 &&
              FeedbackList.map((p) => (
                <div key={v4()} className='col-md-12'>
                  <div className='row admin-post-item border border-white'>
                    <div className='col-2 text-left'>{p.user.email}</div>
                    <div className='col-1 text-left'>{p.rating}</div>
                    <div className='col-5 text-left'>{p.comment}</div>
                    <div className='col-2 text-center'>
                      <button
                        className='btn btn-xs btn-round btn-primary'
                        onClick={() => {
                          updateFeedbackStatus({ payload: p.id })
                        }}
                      >
                        {p.isPulished ? 'Pulished' : 'Unpulished'}
                      </button>
                    </div>
                    <div className='col-2 text-center'>
                      <button
                        className='btn btn-xs btn-round btn-primary'
                        onClick={() => {
                          showConfirmModal({
                            message: dictionaryList[locale]['delete_msg'],
                            onConfirm: () => {
                              deleteFeedback({ payload: p.id })
                            },
                          })
                        }}
                      >
                        <Translation tid='btnDelete' />{' '}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            <div className='mt-7'>
              <Pagination
                totalRows={totalRows}
                pagingData={pagingData}
                pageChangeEvent={pagingChangeEvent}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminFeedbackList
