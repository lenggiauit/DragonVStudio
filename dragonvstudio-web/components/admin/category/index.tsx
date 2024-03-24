'use client'
import React, { useEffect, useState } from 'react'
import { Translation } from '../../translation'
import { AppSetting, MetaData, Paging } from '../../../types/type'
import Pagination from '../../pagination'
import { v4 } from 'uuid'
import PageLoading from '../../pageLoading'
import LocalSpinner from '../../localSpinner'
import { hasPermission } from '../../../utils/functions'
import { PermissionKeys } from '../../../utils/constants'
import AddEditCategoryModal from './modal/'
import { Category } from '../../../services/models/admin/category'
import { useGetCategoryMutation } from '../../../services/admin'
import CategoryItem from './item'
import AddCategoryButton from './addButton'
import { useSession } from 'next-auth/react'
const appSetting: AppSetting = require('../../../appSetting.json')

const CategorysList: React.FC = () => {
  const { data: session, status } = useSession()
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  // get list
  const [getCategoryList, getCategoryStatus] = useGetCategoryMutation()
  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)
  const [isArchived, setIsArchived] = useState<boolean>(false)
  const [categoryList, setCategoryList] = useState<Category[]>([])

  const [selecttedCategory, setSelecttedCategory] = useState<Category>()
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
    getCategoryList({ payload: { isArchived: isArchived }, metaData: metaData })
  }, [metaData, isArchived])

  useEffect(() => {
    if (
      getCategoryStatus.isSuccess &&
      getCategoryStatus.data.resource != null
    ) {
      let data = getCategoryStatus.data.resource
      if (data.length > 0) {
        setTotalRows(data[0].totalRows)
      } else {
        setTotalRows(0)
      }
      setCategoryList(data)
    }
  }, [getCategoryStatus])

  const onEditHandler = (tempType: Category) => {
    setSelecttedCategory(tempType)
    setIsShowModal(true)
  }

  const onCloseHandler = (tempType?: Category) => {
    setIsShowModal(false)
    getCategoryList({ payload: { isArchived: isArchived }, metaData: metaData })
  }

  return (
    <>
      {getCategoryStatus.isLoading && <PageLoading />}
      {isShowModal && (
        <AddEditCategoryModal
          dataModel={selecttedCategory}
          onClose={onCloseHandler}
        />
      )}
      <section className='section overflow-hidden bg-gray'>
        <div className='container'>
          <header className='section-header mb-0'>
            <h2>
              <Translation tid='heading_categoryList' />
            </h2>
            <hr />
          </header>

          <div data-provide='shuffle'>
            <ul
              className='nav nav-center nav-bold nav-uppercase nav-pills mb-7 mt-0'
              data-shuffle='filter'
            >
              <li className='nav-item'>
                <a
                  className={'nav-link ' + (!isArchived ? 'active' : '')}
                  href='#'
                  data-shuffle='button'
                  onClick={() => {
                    setIsArchived(false)
                  }}
                >
                  <Translation tid='all' />
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={'nav-link ' + (isArchived ? 'active' : '')}
                  href='#'
                  data-shuffle='button'
                  onClick={() => {
                    setIsArchived(true)
                  }}
                  data-group='bag'
                >
                  <Translation tid='archived' />
                </a>
              </li>
            </ul>
            <div className='row gap-y gap-2' data-shuffle='list'>
              {session?.user != null &&
                hasPermission(session, PermissionKeys.CreateEditCategory) &&
                !isArchived && <AddCategoryButton onAdded={onCloseHandler} />}
              {categoryList.map((p) => (
                <CategoryItem
                  key={v4().toString()}
                  dataItem={p}
                  onSelected={onEditHandler}
                />
              ))}
            </div>

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

export default CategorysList
