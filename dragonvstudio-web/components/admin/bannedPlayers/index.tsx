'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useGetBannedPlayersMutation,
  useUnbanPlayerMutation,
} from '@/services/mountAndBladeGameService'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import { Player } from '@/services/models/adminGame/player'
let appSetting: AppSetting = require('../../../appSetting.json')
import DataTable, { TableColumn } from 'react-data-table-component'
import * as Yup from 'yup'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import PageLoading from '@/components/pageLoading'
import { BannedPlayer } from '@/services/models/adminGame/bannedPlayer'
import showDialogModal from '@/components/modal/showModal'
import dayjs from 'dayjs'
import showConfirmModal from '@/components/modal'
import { ResultCode } from '@/utils/enums'
import { toast } from 'react-toastify'
const AdminBannedPlayer: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()

  const [getBannedPlayer, getBannedPlayerStatus] = useGetBannedPlayersMutation()
  const [UnbanPlayer, UnbanPlayerStatus] = useUnbanPlayerMutation()

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

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [BannedPlayerList, setBannedPlayer] = useState<BannedPlayer[]>([])

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
    getBannedPlayer({
      payload: { keywords: keyWords },
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords, UnbanPlayerStatus])

  useEffect(() => {
    if (
      getBannedPlayerStatus.isSuccess &&
      getBannedPlayerStatus.data.resource != null
    ) {
      let data = getBannedPlayerStatus.data.resource
      setTotalRows(getBannedPlayerStatus.data.total)
      setBannedPlayer(data)
    }
  }, [getBannedPlayerStatus])

  useEffect(() => {
    if (
      UnbanPlayerStatus.data &&
      UnbanPlayerStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Unbanned!')
    } else if (
      UnbanPlayerStatus.isError ||
      UnbanPlayerStatus.data?.resultCode == ResultCode.Error ||
      UnbanPlayerStatus.data?.resultCode == ResultCode.Invalid ||
      UnbanPlayerStatus.data?.resultCode == ResultCode.Unknown ||
      UnbanPlayerStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.success('Error, Please try again!')
    }
  }, [UnbanPlayerStatus])

  // Data grid columns
  const columns: TableColumn<BannedPlayer>[] = [
    {
      id: 'playerId',
      name: 'PlayerId',
      width: '200px',
      selector: (row: any) => row.playerId,
      sortable: true,
    },
    {
      id: 'name',
      name: 'Name',
      width: '165px',
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      id: 'discordId',
      name: 'Discord Id',
      width: '200px',
      selector: (row) => row.discordId,
      sortable: true,
    },
    {
      id: 'punishmentTime',
      name: 'Punishment Time (UTC)',
      width: '200px',
      selector: (row) =>
        dayjs(row.punishmentTime).format('DD/MM/YYYY - hh:mm:ss A'),
      sortable: true,
    },
    {
      id: 'reason',
      name: 'Reason',
      cell: (row) => (
        <>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              showDialogModal({
                title: 'Reason',
                message: row.reason,
                size: 'modal-lg',
                onClose: () => {},
              })
            }}
          >
            {row.reason}
          </a>
        </>
      ),
      selector: (row) => row.reason,
      sortable: true,
    },

    {
      id: 'actions',
      name: 'Actions',
      width: '150px',
      cell: (row) => (
        <div className='align-items-center'>
          <button
            type='button'
            className='btn btn-danger btn-sm ms-2'
            onClick={() => {
              showConfirmModal({
                message: `Confirm unban player: ${row.name}`,
                onConfirm: () => {
                  UnbanPlayer({
                    payload: { playerId: row.playerId, userId: row.userId },
                    gameUrl: gameUrl,
                  })
                },
              })
            }}
          >
            Unban
          </button>
        </div>
      ),
      sortable: false,
    },
  ]

  return (
    <>
      {(getBannedPlayerStatus.isLoading || UnbanPlayerStatus.isLoading) && (
        <PageLoading />
      )}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-8'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Banned Player</VNTranslation>
                  <ENTranslation>Banned Player</ENTranslation>
                </h4>
              </div>
              <div className='col-lg-4'>
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
                          placeholder='Player name'
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
              title='Banned Player List'
              columns={columns}
              data={BannedPlayerList}
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

export default AdminBannedPlayer
