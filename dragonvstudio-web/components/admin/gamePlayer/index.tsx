'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignPlayerToPrisonMutation,
  useGetPlayerListMutation,
} from '@/services/mountAndBladeGameService'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import { Player } from '@/services/models/adminGame/player'
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
import ChangePlayerNameModal from '../changePlayerNameModal/inde'
import PlayerBankMoneyModal from '../moneyModal'
const AdminGamePlayer: React.FC = (): ReactElement => {
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
  const [getPlayerList, getPlayerListStatus] = useGetPlayerListMutation()

  //
  const [AssignPlayerToPrison, AssignPlayerToPrisonStatus] =
    useAssignPlayerToPrisonMutation()

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [PlayerList, setPlayerList] = useState<Player[]>([])

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const [isShowBanModal, setIsShowBanModal] = useState<boolean>(false)

  const [isShowMoneyModal, setIsShowMoneyModal] = useState<boolean>(false)

  const [isTakeMoney, setIsTakeMoney] = useState<boolean>(false)

  const [isShowChangeNameModal, setIsShowChangeNameModal] =
    useState<boolean>(false)

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
      AssignPlayerToPrisonStatus.data &&
      AssignPlayerToPrisonStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Assign Player To Prison Successfully!')
    }
    if (
      AssignPlayerToPrisonStatus.isError ||
      AssignPlayerToPrisonStatus.data?.resultCode == ResultCode.Error ||
      AssignPlayerToPrisonStatus.data?.resultCode == ResultCode.Invalid ||
      AssignPlayerToPrisonStatus.data?.resultCode == ResultCode.Unknown ||
      AssignPlayerToPrisonStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      toast.error('Error, Please try again!')
    }
  }, [AssignPlayerToPrisonStatus])

  // Data grid columns
  const columns: TableColumn<Player>[] = [
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
      width: '200px',
      selector: (row) => row.discordId,
      sortable: true,
    },
    {
      id: 'money',
      name: 'Money',
      width: '130px',
      selector: (row) => row.money,
      sortable: true,
    },
    {
      id: 'bankAmount',
      name: 'Bank Amount',
      width: '130px',
      selector: (row) => row.bankAmount,
      sortable: true,
    },

    {
      id: 'actions',
      name: 'Actions',
      width: 'auto',
      cell: (row) => (
        <div className='align-items-center'>
          <button
            type='button'
            className='btn btn-danger btn-sm'
            onClick={() => {
              setSelectedPlayer(row)
              setIsShowChangeNameModal(true)
            }}
          >
            Change Name
          </button>

          <button
            type='button'
            className='btn btn-danger btn-sm ms-2'
            onClick={() => {
              setSelectedPlayer(row)
              setIsShowBanModal(true)
            }}
          >
            Ban
          </button>

          <button
            type='button'
            className='btn btn-danger btn-sm ms-2'
            onClick={() => {
              setSelectedPlayer(row)
              setIsTakeMoney(true)
              setIsShowMoneyModal(true)
            }}
          >
            Take Money
          </button>
          <button
            type='button'
            className='btn btn-danger btn-sm ms-2'
            onClick={() => {
              setSelectedPlayer(row)
              setIsTakeMoney(false)
              setIsShowMoneyModal(true)
            }}
          >
            Give Money
          </button>

          <button
            type='button'
            className='btn btn-danger btn-sm ms-2'
            onClick={() => {
              showConfirmModal({
                message: `Confirm, Assign player: ${row.name} to Prison`,
                onConfirm: () => {
                  AssignPlayerToPrison({
                    payload: { playerId: row.playerId },
                    gameUrl: gameUrl,
                  })
                },
              })
            }}
          >
            Prison
          </button>
          <a
            href={`/admin/${gameUrl}/logs?keywords=${row.playerId}`}
            className='btn btn-warning btn-sm ms-2'
          >
            Log
          </a>
        </div>
      ),
      sortable: false,
    },
  ]

  return (
    <>
      <BanPlayerModal
        isShow={isShowBanModal}
        currentPlayer={selectedPlayer!}
        onSubmit={(result) => {
          if (result) {
            toast.success('Banned Player!')
            setIsShowBanModal(false)
          } else {
            toast.error('Error, please try again!')
          }
        }}
        onClose={() => {
          setIsShowBanModal(false)
        }}
      />
      <PlayerBankMoneyModal
        isShow={isShowMoneyModal}
        takeMoney={isTakeMoney}
        currentPlayer={selectedPlayer!}
        onSubmit={(result) => {
          if (result) {
            if (isTakeMoney) {
              toast.success('Taken player money!')
            } else {
              toast.success('Given player money!')
            }
            getPlayerList({
              payload: { keywords: keyWords },
              metaData: metaData,
              gameUrl: gameUrl,
            })
            setIsShowMoneyModal(false)
          } else {
            toast.error('Error, please try again!')
          }
        }}
        onClose={() => {
          setIsShowMoneyModal(false)
        }}
      />
      <ChangePlayerNameModal
        isShow={isShowChangeNameModal}
        currentPlayer={selectedPlayer!}
        onSubmit={(result) => {
          if (result) {
            toast.success('Changed Player Name!')
            getPlayerList({
              payload: { keywords: keyWords },
              metaData: metaData,
              gameUrl: gameUrl,
            })
            setIsShowChangeNameModal(false)
          } else {
            toast.error('Error, please try again!')
          }
        }}
        onClose={() => {
          setIsShowChangeNameModal(false)
        }}
      />
      {(getPlayerListStatus.isLoading ||
        AssignPlayerToPrisonStatus.isLoading) && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-8'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Players</VNTranslation>
                  <ENTranslation>Players</ENTranslation>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGamePlayer
