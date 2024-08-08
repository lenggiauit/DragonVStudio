'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignItemToPlayerMutation,
  useAssignPlayerToPrisonMutation,
  useDeletePLayerGameItemMutation,
  useGetPersonalPropertyMutation,
  useGetPlayerListMutation,
  useGetPlayersHasItemMutation,
} from '@/services/mountAndBladeGameService'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import { Player, UserGameItems } from '@/services/models/adminGame/player'
let appSetting: AppSetting = require('../../../appSetting.json')
import DataTable, { TableColumn } from 'react-data-table-component'
import * as Yup from 'yup'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import PageLoading from '@/components/pageLoading'
import BanPlayerModal from '../banPlayerModal'
import showConfirmModal from '@/components/modal'
import { ResultCode } from '@/utils/enums'
import showDialogModal from '@/components/modal/showModal'
import { toast } from 'react-toastify'
import { useQuery } from '@/utils/functions'
import { GameItem } from '@/services/models/adminGame/gameItem'
import { GlobalKeys } from '@/utils/constants'
import dayjs from 'dayjs'
import { PersonalProperty } from '@/services/models/adminGame/personalProperty'
import UpdatePersonalPropertyModal from '../updatePersonalProperty'

const AdminPersonalProperty: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()

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
  const [getList, getListStatus] = useGetPersonalPropertyMutation()

  const [selectedPP, setSelectedPP] = useState<PersonalProperty | null>(null)

  const [listpp, setListPP] = useState<PersonalProperty[]>([])

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [isShowModal, setIsShowModal] = useState<boolean>(false)

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
    getList({
      payload: {},
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords])

  useEffect(() => {
    if (getListStatus.isSuccess && getListStatus.data.resource != null) {
      let data = getListStatus.data.resource
      setTotalRows(getListStatus.data.total)
      setListPP(data)
    }
  }, [getListStatus])

  // Data grid columns
  const columns: TableColumn<PersonalProperty>[] = [
    {
      id: 'id',
      name: 'id',
      selector: (row: any) => row.id,
      sortable: true,
    },
    {
      id: 'propertyIndex',
      name: 'Property Index',
      selector: (row: any) => row.propertyIndex,
      sortable: true,
    },
    {
      id: 'PropertyName',
      name: 'Property Name',
      selector: (row) => row.propertyName,
      sortable: true,
    },
    {
      id: 'PropertyBanner',
      name: 'Property Banner',
      selector: (row) => row.propertyBanner,
      sortable: true,
    },
    {
      id: 'OwnerId',
      name: 'OwnerId',
      selector: (row) => row.ownerId,
      sortable: true,
    },
    {
      id: 'actions',
      name: 'Actions',
      width: '180px',
      cell: (row) => (
        <div className='align-items-center'>
          <a
            href='#'
            className='btn btn-warning btn-sm ms-2'
            onClick={() => {
              setSelectedPP(row)
              setIsShowModal(true)
            }}
          >
            Update
          </a>
        </div>
      ),
      sortable: false,
    },
  ]

  return (
    <>
      <UpdatePersonalPropertyModal
        isShow={isShowModal}
        currentPP={selectedPP!}
        onSubmit={(result) => {
          if (result) {
            toast.success('Updated!')
            getList({
              payload: {},
              metaData: metaData,
              gameUrl: gameUrl,
            })
            setIsShowModal(false)
          } else {
            toast.error('Error, please try again!')
          }
        }}
        onClose={() => {
          setIsShowModal(false)
        }}
      />
      {getListStatus.isLoading && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-12'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Personal Property</VNTranslation>
                  <ENTranslation>Personal Property</ENTranslation>
                </h4>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <DataTable
              title={'Personal Property '}
              columns={columns}
              data={listpp}
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

export default AdminPersonalProperty
