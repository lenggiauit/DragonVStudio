'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import DataTable, { TableColumn } from 'react-data-table-component'
import { GameItem } from '@/services/models/adminGame/gameItem'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import * as Yup from 'yup'
import {
  useDeleteGameItemMutation,
  useGetGameItemsMutation,
} from '@/services/mountAndBladeGameService'
import AddEditGameItemModal from '../addEditGameItem'
import { DiscordRole, GlobalKeys } from '@/utils/constants'
import { dictionaryList } from '@/locales'
import { useAppContext } from '@/contexts/appContext'
import { toast } from 'react-toastify'
import showConfirmModal from '@/components/modal'
import { ResultCode } from '@/utils/enums'
import PageLoading from '@/components/pageLoading'

let appSetting: AppSetting = require('../../../appSetting.json')

const AdminGameItems: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  const { locale, setLocale } = useAppContext()

  const [keyWords, setKeyWords] = useState<string | null>('')
  let initialFormKeyword: FormKeyword = {
    keywords: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      keywords: Yup.string().max(20),
    })
  }

  const handleOnSubmit = (
    values: FormKeyword,
    actions: FormikHelpers<FormKeyword>
  ) => {
    setKeyWords(values.keywords)
  }

  // get list
  const [getItemList, getItemListStatus] = useGetGameItemsMutation()
  //
  const [DeleteItem, DeleteItemStatus] = useDeleteGameItemMutation()

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [ItemList, setItemList] = useState<GameItem[]>([])

  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null)

  const [isShowEditModal, setIsShowEditModal] = useState<boolean>(false)

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
    getItemList({
      payload: { keywords: keyWords },
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords])

  useEffect(() => {
    if (
      getItemListStatus.isSuccess &&
      getItemListStatus.data.resource != null
    ) {
      let data = getItemListStatus.data.resource
      setTotalRows(getItemListStatus.data.total)
      setItemList(data)
    }
  }, [getItemListStatus])

  useEffect(() => {
    if (
      DeleteItemStatus.data &&
      DeleteItemStatus.data.resultCode == ResultCode.Success
    ) {
      getItemList({
        payload: { keywords: keyWords },
        metaData: metaData,
        gameUrl: gameUrl,
      })
      toast.success(dictionaryList[locale]['DeletedSuccessfully'])
    } else if (
      DeleteItemStatus.isError ||
      DeleteItemStatus.data?.resultCode == ResultCode.Error ||
      DeleteItemStatus.data?.resultCode == ResultCode.Invalid ||
      DeleteItemStatus.data?.resultCode == ResultCode.Unknown ||
      DeleteItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error(dictionaryList[locale]['Error'])
    }
  }, [DeleteItemStatus])

  // Data grid columns
  const columns: TableColumn<GameItem>[] = [
    {
      id: 'name',
      name: 'Name',
      width: '150px',
      selector: (row: any) => row.name,
      sortable: true,
    },

    {
      id: 'class',
      name: 'Class',

      selector: (row: any) => row.class,
      sortable: true,
    },
    {
      id: 'type',
      name: 'Type',

      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      id: 'images',
      name: 'Image',
      cell: (row: any) => (
        <img
          className='avatar'
          src={row.images == null ? GlobalKeys.NoImageUrl : row.images}
          alt='image'
        />
      ),
      sortable: true,
    },
    {
      id: 'stock',
      name: 'Stock',

      selector: (row: any) => row.stock,
      sortable: true,
    },
    {
      id: 'price',
      name: 'price',

      selector: (row: any) => row.price,
      sortable: true,
    },
    {
      id: 'duration',
      name: 'Duration',

      selector: (row: any) => row.duration + ' days',
      sortable: true,
    },
    {
      id: 'discordrole',
      name: 'Discord Role',
      width: '125px',
      cell: (row: any) => (
        <>
          {
            Object.keys(DiscordRole)[
              Object.values(DiscordRole).indexOf(row.discordRole)
            ]
          }
        </>
      ),
      sortable: true,
    },
    {
      id: 'isActive',
      name: 'Active',
      cell: (row: any) => (row.isActive ? 'true' : 'false'),
      sortable: true,
    },
    {
      id: 'action',
      name: 'Action',
      width: '185px',
      cell: (row: any) => (
        <>
          <a
            className='btn btn-sm btn-danger'
            href='#'
            onClick={() => {
              setSelectedItem(row)
              setIsShowEditModal(true)
            }}
          >
            Edit
          </a>
          <a
            className='btn btn-sm btn-danger ms-2'
            href='#'
            onClick={() => {
              showConfirmModal({
                message: `Confirm, Delete item: ${row.name}`,
                onConfirm: () => {
                  DeleteItem({ payload: { id: row.id }, gameUrl: gameUrl })
                },
              })
            }}
          >
            Delete
          </a>
        </>
      ),
      sortable: true,
    },
  ]

  return (
    <>
      {(getItemListStatus.isLoading || DeleteItemStatus.isLoading) && (
        <PageLoading />
      )}
      <AddEditGameItemModal
        isShow={isShowEditModal}
        onClose={() => {
          setSelectedItem(null)
          setIsShowEditModal(false)
        }}
        onSubmit={(result) => {
          if (result) {
            setSelectedItem(null)

            getItemList({
              payload: { keywords: keyWords },
              metaData: metaData,
              gameUrl: gameUrl,
            })
            setIsShowEditModal(false)
            toast.success(dictionaryList[locale]['AddedSuccessfully'])
          } else {
            toast.error(dictionaryList[locale]['Error'])
          }
        }}
        currentItem={selectedItem}
      />
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-6 text-start'>
                <button
                  className='btn btn-primary'
                  type='button'
                  onClick={() => {
                    setIsShowEditModal(true)
                  }}
                >
                  Add new item
                </button>
              </div>
              <div className='col-lg-6 text-end'>
                <Formik
                  initialValues={initialFormKeyword}
                  onSubmit={handleOnSubmit}
                  validationSchema={validationSchema}
                  validateOnChange={false}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form autoComplete='off'>
                      <div className='input-group mb-3'>
                        <Field
                          type='text'
                          className='form-control form-control-sm'
                          name='keywords'
                          placeholder='item name'
                          maxLength='50'
                        />
                        <button
                          className='btn btn-outline-secondary'
                          type='submit'
                        >
                          Search
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <DataTable
              title='Item List'
              columns={columns}
              data={ItemList}
              paginationTotalRows={totalRows}
              onChangePage={(index) => {
                setPagingData((prevState) => ({
                  ...prevState,
                  index: index,
                }))
              }}
              onChangeRowsPerPage={(count) => {
                setPagingData((prevState) => ({
                  ...prevState,
                  size: count,
                }))
              }}
              paginationServer
              pagination
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGameItems
