'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignItemToPlayerMutation,
  useAssignPlayerToPrisonMutation,
  useDeletePLayerGameItemMutation,
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

const AdminPlayerItem: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()

  const [selectedPlayer, setSelectedPLayer] = useState<Player | null>()

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
  const [getPlayerList, getPlayerListStatus] = useGetPlayersHasItemMutation()
  const [DeletePLayerGameItem, DeletePLayerGameItemStatus] =
    useDeletePLayerGameItemMutation()
  const [AssignItemToPlayer, AssignItemToPlayerStatus] =
    useAssignItemToPlayerMutation()

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [PlayerList, setPlayerList] = useState<Player[]>([])

  const [isShowItemModal, setIsShowItemModal] = useState<boolean>(false)

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
    getPlayerList({
      payload: { keywords: keyWords },
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords])

  useEffect(() => {
    if (
      getPlayerListStatus.isSuccess &&
      getPlayerListStatus.data.resource != null
    ) {
      let data = getPlayerListStatus.data.resource
      setTotalRows(getPlayerListStatus.data.total)
      setPlayerList(data)
    }
  }, [getPlayerListStatus])

  useEffect(() => {
    if (
      DeletePLayerGameItemStatus.data &&
      DeletePLayerGameItemStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Remove player item Successfully!')
    }
    if (
      DeletePLayerGameItemStatus.isError ||
      DeletePLayerGameItemStatus.data?.resultCode == ResultCode.Error ||
      DeletePLayerGameItemStatus.data?.resultCode == ResultCode.Invalid ||
      DeletePLayerGameItemStatus.data?.resultCode == ResultCode.Unknown ||
      DeletePLayerGameItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [DeletePLayerGameItemStatus])

  useEffect(() => {
    if (
      AssignItemToPlayerStatus.data &&
      AssignItemToPlayerStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Assign item to player successfully!')
    }
    if (
      AssignItemToPlayerStatus.isError ||
      AssignItemToPlayerStatus.data?.resultCode == ResultCode.Error ||
      AssignItemToPlayerStatus.data?.resultCode == ResultCode.Invalid ||
      AssignItemToPlayerStatus.data?.resultCode == ResultCode.Unknown ||
      AssignItemToPlayerStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [AssignItemToPlayerStatus])

  // Data grid columns
  const columns: TableColumn<Player>[] = [
    {
      id: 'playerId',
      name: 'PlayerId',
      selector: (row: any) => row.playerId,
      sortable: true,
    },
    {
      id: 'name',
      name: 'Name',
      cell: (row) => (
        <div
          className='cursor-pointer'
          title={`Money: ${row.money} - BankAmount: ${row.bankAmount} - Horse: ${row.horse} - Equipment 1: ${row.equipment_0} - Equipment 2: ${row.equipment_1} - Equipment 3: ${row.equipment_2} - Equipment 4: ${row.equipment_3} - Armor Head: ${row.armor_Head} - Armor Body: ${row.armor_Body} - Armor Leg: ${row.armor_Leg} - Armor Gloves: ${row.armor_Gloves} - Armor Cape: ${row.armor_Cape} - Class: ${row.class} - Faction: ${row.faction?.name}`}
        >
          {row.name}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'discordId',
      name: 'Discord Id',
      selector: (row) => row.discordId,
      sortable: true,
    },
    {
      id: 'itemcount',
      name: 'Item Count',
      width: '200px',
      selector: (row) => row.items.length,
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
              setSelectedPLayer(row)
            }}
          >
            View Item list
          </a>
        </div>
      ),
      sortable: false,
    },
  ]

  // Data grid columns
  const columnsItem: TableColumn<UserGameItems>[] = [
    {
      id: 'name',
      name: 'Name',
      width: '150px',
      selector: (row: any) => row.itemInfo.name,
      sortable: true,
    },

    {
      id: 'class',
      name: 'Class',
      selector: (row: any) => row.itemInfo.class,
      sortable: true,
    },
    {
      id: 'type',
      name: 'Type',
      width: '200px',
      selector: (row: any) => row.itemInfo.type,
      sortable: true,
    },
    {
      id: 'images',
      name: 'Image',
      width: '100px',
      cell: (row: any) => (
        <img
          className='avatar'
          src={
            row.itemInfo.images == null
              ? GlobalKeys.NoImageUrl
              : row.itemInfo.images
          }
          alt='image'
        />
      ),
      sortable: true,
    },
    {
      id: 'receivedDate',
      name: 'Received Date',
      width: '135px',
      selector: (row: any) => dayjs(row.receivedDate).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      id: 'expiredDate',
      name: 'Expired Date',
      width: '125px',
      selector: (row: any) => dayjs(row.expiredDate).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      id: 'action',
      name: 'Action',
      width: '265px',
      cell: (row: any) => (
        <>
          <a
            className='btn btn-sm btn-primary ms-2'
            href='#'
            onClick={() => {
              showConfirmModal({
                message: `Confirm, Assign Item : ${row.itemInfo.name} to player: ${selectedPlayer?.name}`,
                onConfirm: () => {
                  AssignItemToPlayer({
                    gameUrl: gameUrl,
                    payload: { id: row.id },
                  })
                },
              })
            }}
          >
            Assign to Player
          </a>
          <a
            className='btn btn-sm btn-danger ms-2'
            href='#'
            onClick={() => {
              showConfirmModal({
                message: `Confirm, Delete item: ${row.itemInfo.name} of player: ${selectedPlayer?.name}`,
                onConfirm: () => {
                  DeletePLayerGameItem({
                    gameUrl: gameUrl,
                    payload: { id: row.id },
                  })
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
      {getPlayerListStatus.isLoading && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-8'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Player Items</VNTranslation>
                  <ENTranslation>Player Items</ENTranslation>
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
            {selectedPlayer == null && (
              <DataTable
                title='Player List'
                columns={columns}
                data={PlayerList}
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
            )}
            {selectedPlayer != null && (
              <DataTable
                title={'List items of player: ' + selectedPlayer.name}
                columns={columnsItem}
                data={selectedPlayer.items}
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPlayerItem
