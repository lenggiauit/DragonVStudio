'use client'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { useGetUserListMutation } from '../../../services/admin'
import { useGetEventBookingAvaiableDateQuery } from '../../../services/event'
import { User } from '../../../services/models/user'

import { UserResource } from '../../../services/resources/userResource'
import { AppSetting, MetaData, Paging } from '../../../types/type'
import { ResultCode } from '../../../utils/enums'
import Pagination from '../../pagination'
import { Translation } from '../../translation'
import AdminUserItem from './item'
const appSetting: AppSetting = require('../../../appSetting.json')

const AdminUserList: React.FC = (): ReactElement => {
  // get list
  const [getUserList, getUserStatus] = useGetUserListMutation()
  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [UserList, setUserList] = useState<UserResource[]>([])

  const [eventStatusFilter, seteventStatusFilter] = useState<string>('')

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
    getUserList({
      payload: { eventStatus: eventStatusFilter },
      metaData: metaData,
    })
  }, [metaData, eventStatusFilter])

  useEffect(() => {
    if (getUserStatus.isSuccess && getUserStatus.data.resource != null) {
      let data = getUserStatus.data.resource
      if (data.length > 0) {
        setTotalRows(data[0].totalRows)
      } else {
        setTotalRows(0)
      }
      setUserList(data)
    }
  }, [getUserStatus])

  const onSelectedHandler = useCallback((dataDetail: UserResource) => {
    // showUserModal({
    //     title: dataDetail.fullName,
    //     data: dataDetail
    // });
  }, [])

  return (
    <>
      <section className='section'>
        <div className='container'>
          <header className='section-header'>
            <h2>Manage User</h2>
            <hr />
          </header>
          <div data-provide='shuffle'>
            <div className='row gap-y gap-2' data-shuffle='list'>
              <div className='col-md-12'>
                <div className='row admin-post-header'>
                  <div className='col-3 text-left'>User name</div>
                  <div className='col-3 text-left'>Full name</div>
                  <div className='col-3 text-left'>User Email</div>
                  <div className='col-3 text-center'>Created Date</div>
                </div>
              </div>
            </div>
            {UserList.length > 0 &&
              UserList.map((p) => (
                <AdminUserItem
                  key={v4()}
                  dataItem={p}
                  onSelected={onSelectedHandler}
                />
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

export default AdminUserList
