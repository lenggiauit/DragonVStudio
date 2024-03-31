'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignPlayerToPrisonMutation,
  useGetPlayerListMutation,
  useGetPlayersHasItemMutation,
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
import { useQuery } from '@/utils/functions'
const AdminPlayerItem: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  let query = useQuery()

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
    query.get('playerId')
  )

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

  const [metaData, setMetaData] = useState<MetaData>({
    paging: { index: 1, size: appSetting.PageSize },
  })
  const [pagingData, setPagingData] = useState<Paging>({
    index: 1,
    size: appSetting.PageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const [PlayerList, setPlayerList] = useState<Player[]>([])

  const [isShowBanModal, setIsShowBanModal] = useState<boolean>(false)

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
      id: 'actions',
      name: 'Actions',
      width: '150px',
      cell: (row) => (
        <div className='align-items-center'>
          <a
            href={`/admin/${gameUrl}/playerItems?playerId=${row.playerId}`}
            className='btn btn-warning btn-sm ms-2'
          >
            Item list
          </a>
        </div>
      ),
      sortable: false,
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
            {selectedPlayerId == null && (
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
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPlayerItem
