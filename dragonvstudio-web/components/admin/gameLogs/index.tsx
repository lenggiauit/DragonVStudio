'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Log } from '@/services/models/adminGame/log'
import { AppSetting, FormKeyword, MetaData, Paging } from '@/types/type'
import { useGetPlayerLogsMutation } from '@/services/mountAndBladeGameService'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

let appSetting: AppSetting = require('../../../appSetting.json')
import * as Yup from 'yup'
import { useQuery } from '@/utils/functions'
import showDialogModal from '@/components/modal/showModal'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import PageLoading from '@/components/pageLoading'

type FormKeywordActionType = FormKeyword & { actionType: any }

const AdminGameLogs: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  let query = useQuery()

  const [keyWords, setKeyWords] = useState<string | null>(query.get('keywords'))
  const [actionType, setActionType] = useState<string | null>('')
  const [createdAt, setCreatedAt] = useState<string | null>()
  let initialFormKeyword: FormKeywordActionType = {
    keywords: '',
    actionType: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      keywords: Yup.string().max(20),
    })
  }

  const handleOnSubmit = (
    values: FormKeywordActionType,
    actions: FormikHelpers<FormKeywordActionType>
  ) => {
    setKeyWords(values.keywords)
    setActionType(values.actionType)
  }

  // get list
  const [getPlayerLogs, getPlayerLogsStatus] = useGetPlayerLogsMutation()

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [PlayerList, setPlayerList] = useState<Log[]>([])

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
    getPlayerLogs({
      payload: {
        keywords: keyWords,
        actionType: actionType,
        createdAt: createdAt,
      },
      metaData: metaData,
      gameUrl: gameUrl,
    })
  }, [metaData, keyWords, actionType, createdAt])

  useEffect(() => {
    if (
      getPlayerLogsStatus.isSuccess &&
      getPlayerLogsStatus.data.resource != null
    ) {
      let data = getPlayerLogsStatus.data.resource
      setTotalRows(getPlayerLogsStatus.data.total)
      setPlayerList(data)
    }
  }, [getPlayerLogsStatus])

  // Data grid columns
  const columns: TableColumn<Log>[] = [
    {
      id: 'id',
      name: 'ID',
      width: '80px',
      selector: (row: any) => row.id,
      sortable: true,
    },

    {
      id: 'issuerPlayerId',
      name: 'Player Id',
      width: '165px',
      selector: (row: any) => row.issuerPlayerId,
      sortable: true,
    },
    {
      id: 'issuerPlayerName',
      name: 'Player Name',
      width: '180px',
      selector: (row) => row.issuerPlayerName,
      sortable: true,
    },
    {
      id: 'actionType',
      name: 'Action Type',
      width: '180px',
      selector: (row) => row.actionType,
      sortable: true,
    },
    {
      id: 'createdAt',
      name: 'Created At',
      width: '180px',
      selector: (row: any) => row.createdAt,
      sortable: true,
    },
    {
      id: 'logMessage',
      name: 'logMessage',
      width: '950px',
      cell: (row) => (
        <>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              showDialogModal({
                title: 'Log Message',
                message: row.logMessage,
                size: 'modal-lg',
                onClose: () => {},
              })
            }}
          >
            {row.logMessage.toString().length > 50
              ? row.logMessage.substring(0, 50)
              : row.logMessage}
          </a>
        </>
      ),
      sortable: true,
    },
    {
      id: 'affectedPlayers',
      name: 'affectedPlayers',
      width: '650px',
      cell: (row) => (
        <>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              showDialogModal({
                title: 'Affected Players',
                message: row.affectedPlayers,
                size: 'modal-lg',
                onClose: () => {},
              })
            }}
          >
            {row.affectedPlayers.toString().length > 50
              ? row.affectedPlayers.substring(0, 50)
              : row.affectedPlayers}
          </a>
        </>
      ),
      sortable: true,
    },
  ]

  return (
    <>
      {getPlayerLogsStatus.isLoading && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-6'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Logs</VNTranslation>
                  <ENTranslation>Logs</ENTranslation>
                </h4>
              </div>
              <div className='col-lg-6'>
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
                          placeholder='Keyword'
                          maxLength='50'
                        />
                        <Field
                          className='form-control form-control-sm'
                          name='actionType'
                          as='select'
                        >
                          <option value=''>All action type</option>
                          <option value='FactionDeclaredWar'>
                            FactionDeclaredWar
                          </option>
                          <option value='FactionLordChanged'>
                            FactionLordChanged
                          </option>
                          <option value='FactionMadePeace'>
                            FactionMadePeace
                          </option>
                          <option value='LocalChat'> LocalChat </option>
                          <option value='PlayerBansPlayer'>
                            PlayerBansPlayer
                          </option>
                          <option value='PlayerBecomesGodlike'>
                            PlayerBecomesGodlike
                          </option>
                          <option value='PlayerBumpedWithHorse'>
                            PlayerBumpedWithHorse
                          </option>
                          <option value='PlayerBuysStockpile'>
                            PlayerBuysStockpile
                          </option>
                          <option value='PlayerChangedName'>
                            PlayerChangedName
                          </option>
                          <option value='PlayerClassChange'>
                            PlayerClassChange
                          </option>
                          <option value='PlayerClosesStockpile'>
                            PlayerClosesStockpile
                          </option>
                          <option value='PlayerCommitedSuicide'>
                            PlayerCommitedSuicide
                          </option>
                          <option value='PlayerDepositedToBank'>
                            PlayerDepositedToBank
                          </option>
                          <option value='PlayerDespawnedPrefab'>
                            PlayerDespawnedPrefab
                          </option>
                          <option value='PlayerDied'> PlayerDied </option>
                          <option value='PlayerDisconnected'>
                            PlayerDisconnected
                          </option>
                          <option value='PlayerDismountedHorse'>
                            PlayerDismountedHorse
                          </option>
                          <option value='PlayerDroppedGold'>
                            PlayerDroppedGold
                          </option>
                          <option value='PlayerDroppedItem'>
                            PlayerDroppedItem
                          </option>
                          <option value='PlayerDroppedLoot'>
                            PlayerDroppedLoot
                          </option>
                          <option value='PlayerFactionChange'>
                            PlayerFactionChange
                          </option>
                          <option value='PlayerFreezePlayer'>
                            PlayerFreezePlayer
                          </option>
                          <option value='PlayerHealedPlayer'>
                            PlayerHealedPlayer
                          </option>
                          <option value='PlayerHitAgent'>PlayerHitAgent</option>
                          <option value='PlayerHitToDestructable'>
                            PlayerHitToDestructable
                          </option>
                          <option value='PlayerItemGathers'>
                            PlayerItemGathers
                          </option>
                          <option value='PlayerJoined'> PlayerJoined </option>
                          <option value='PlayerKicksPlayer'>
                            PlayerKicksPlayer
                          </option>
                          <option value='PlayerKilledAgent'>
                            PlayerKilledAgent
                          </option>
                          <option value='PlayerMountedHorse'>
                            PlayerMountedHorse
                          </option>
                          <option value='PlayerOpensStockpile'>
                            PlayerOpensStockpile
                          </option>
                          <option value='PlayerPickedUpGold'>
                            PlayerPickedUpGold
                          </option>
                          <option value='PlayerRepairesTheDestructable'>
                            PlayerRepairesTheDestructable
                          </option>
                          <option value='PlayerRevealedItemBag'>
                            PlayerRevealedItemBag
                          </option>
                          <option value='PlayerRevealedMoneyPouch'>
                            PlayerRevealedMoneyPouch
                          </option>
                          <option value='PlayerSlayPlayer'>
                            PlayerSlayPlayer
                          </option>
                          <option value='PlayerSpawn'> PlayerSpawn </option>
                          <option value='PlayerSpawnedMoney'>
                            PlayerSpawnedMoney
                          </option>
                          <option value='PlayerSpawnedPrefab'>
                            PlayerSpawnedPrefab
                          </option>
                          <option value='PlayerSpawnsItem'>
                            PlayerSpawnsItem
                          </option>
                          <option value='PlayerTempBanPlayer'>
                            PlayerTempBanPlayer
                          </option>
                          <option value='PlayerTpToMePlayer'>
                            PlayerTpToMePlayer
                          </option>
                          <option value='PlayerTpToPlayer'>
                            PlayerTpToPlayer
                          </option>
                          <option value='PlayerTransferredItemFromChest'>
                            PlayerTransferredItemFromChest
                          </option>
                          <option value='PlayerTransferredItemToChest'>
                            PlayerTransferredItemToChest
                          </option>
                          <option value='PlayerWithdrawToBank'>
                            PlayerWithdrawToBank
                          </option>
                        </Field>
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              sx={{ width: 190 }}
                              onChange={(date) => {
                                setCreatedAt(date?.toISOString())
                              }}
                            />
                          </LocalizationProvider>
                        </div>
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
              title='Logs List'
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

export default AdminGameLogs
