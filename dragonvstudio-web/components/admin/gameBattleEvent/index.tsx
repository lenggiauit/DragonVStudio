'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignTeamsToBattleEventMutation,
  useGetPlayerListForEventMutation,
  useGetSavedPlayersEventMutation,
  useSavePlayersEventMutation,
} from '@/services/mountAndBladeGameService'
import { GameServer } from '@/services/models/adminGame/gameServerStatus'
import PageLoading from '@/components/pageLoading'
import { ResultCode } from '@/utils/enums'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { Player } from '@/services/models/adminGame/player'
import { FormKeyword } from '@/types/type'
import * as Yup from 'yup'

import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { v4 } from 'uuid'
import { EventPlayer } from '@/services/models/adminGame/eventPlayer'
import { dictionaryList } from '@/locales'
import { useAppContext } from '@/contexts/appContext'
import DataTable, { TableColumn } from 'react-data-table-component'
import showConfirmModal from '@/components/modal'
import showDialogModal from '@/components/modal/showModal'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

type FormAddPlayer = {
  players: EventPlayer[]
  class: any
  team: number
}

const AdminGameBattleEvent: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  const { locale } = useAppContext()
  const [PlayerList, setPlayerList] = useState<EventPlayer[]>([])
  // get list
  const [getPlayerListForEvent, getPlayerListForEventStatus] =
    useGetPlayerListForEventMutation()
  // save

  const [SavePlayersEvent, SavePlayersEventStatus] =
    useSavePlayersEventMutation()

  //
  // get saved list
  const [getSavedPlayerListForEvent, getSavedPlayerListForEventStatus] =
    useGetSavedPlayersEventMutation()

  // AssignTeamsToBattleEvent

  const [AssignTeamsToBattleEvent, AssignTeamsToBattleEventStatus] =
    useAssignTeamsToBattleEventMutation()

  const [keyWords, setKeyWords] = useState<string | null>('')
  let initialForm: FormAddPlayer = {
    players: [],
    class: 'pe_sergeant',
    team: 1,
  }

  const validationSchema = () => {
    return Yup.object().shape({
      class: Yup.string().required(dictionaryList[locale]['RequiredField']),
      team: Yup.number()
        .min(1)
        .max(2)
        .required(dictionaryList[locale]['RequiredField']),
    })
  }

  const handleOnSubmit = (
    values: FormAddPlayer,
    actions: FormikHelpers<FormAddPlayer>
  ) => {
    let selectednew = PlayerList.filter(
      (p) => selectedPlayersId.indexOf(p.playerId) != -1
    )
    let modifiedSelectednew = selectednew.map((p) => {
      return { ...p, class: values.class, team: values.team }
    })

    setSelectedPlayers((prev) => [...prev, ...modifiedSelectednew])
    setSelectedPlayersId([])
    actions.resetForm()
  }

  useEffect(() => {
    getPlayerListForEvent({
      payload: { keywords: keyWords },
      gameUrl: gameUrl,
    })
  }, [])

  useEffect(() => {
    if (
      getPlayerListForEventStatus.isSuccess &&
      getPlayerListForEventStatus.data.resultCode == ResultCode.Success &&
      getPlayerListForEventStatus.data.resource.length > 0
    ) {
      setPlayerList(getPlayerListForEventStatus.data.resource)
    }
  }, [getPlayerListForEventStatus])

  useEffect(() => {
    if (
      getSavedPlayerListForEventStatus.isSuccess &&
      getSavedPlayerListForEventStatus.data.resultCode == ResultCode.Success &&
      getSavedPlayerListForEventStatus.data.resource.length > 0
    ) {
      setSelectedPlayers(getSavedPlayerListForEventStatus.data.resource)
    }
  }, [getSavedPlayerListForEventStatus])

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const [selectedPlayers, setSelectedPlayers] = React.useState<EventPlayer[]>(
    []
  )

  const [selectedPlayersId, setSelectedPlayersId] = React.useState<string[]>([])

  const handleSelectedPlayerIds = (
    event: SelectChangeEvent<typeof selectedPlayersId>
  ) => {
    const {
      target: { value },
    } = event

    setSelectedPlayersId(typeof value === 'string' ? value.split(',') : value)
  }
  // save

  const SaveEventPlayerToDatabase = () => {
    SavePlayersEvent({
      gameUrl: gameUrl,
      payload: { players: selectedPlayers },
    })
  }

  const handleAssignTeamsToBattleEvent = () => {
    AssignTeamsToBattleEvent({
      gameUrl: gameUrl,
      payload: { players: selectedPlayers },
    })
  }

  useEffect(() => {
    if (
      SavePlayersEventStatus.isSuccess &&
      SavePlayersEventStatus.data.resultCode == ResultCode.Success
    ) {
      showDialogModal({ message: 'Saved!' })
    }
  }, [SavePlayersEventStatus])

  useEffect(() => {
    if (
      AssignTeamsToBattleEventStatus.isSuccess &&
      AssignTeamsToBattleEventStatus.data.resultCode == ResultCode.Success
    ) {
      showDialogModal({ message: 'Assign Teams To Battle Event Successfully!' })
    }
  }, [AssignTeamsToBattleEventStatus])

  // Data grid columns
  const columns: TableColumn<EventPlayer>[] = [
    {
      id: 'playerName',
      name: 'Player Name',
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
      id: 'action',
      name: 'Action',
      width: '95px',
      cell: (row: any) => (
        <a
          href='#'
          onClick={() => {
            let newList = selectedPlayers.filter(
              (p) => p.playerId != row.playerId
            )
            setSelectedPlayers(newList)
          }}
        >
          <i className='bi bi-x' style={{ fontSize: 32 }} />
        </a>
      ),
      sortable: true,
    },
  ]

  return (
    <>
      {(getPlayerListForEventStatus.isLoading ||
        getSavedPlayerListForEventStatus.isLoading ||
        AssignTeamsToBattleEventStatus.isLoading ||
        SavePlayersEventStatus.isLoading) && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-lg-2'>
                <h4 className='card-header-title text-dark'>
                  <VNTranslation>Battle Event</VNTranslation>
                  <ENTranslation>Battle Event</ENTranslation>
                </h4>
              </div>
              <div className='col-lg-10 text-end'>
                <Formik
                  initialValues={initialForm}
                  onSubmit={handleOnSubmit}
                  validationSchema={validationSchema}
                  validateOnChange={false}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form autoComplete='off'>
                      <div className='input-group mb-3'>
                        <Select
                          sx={{ width: '300px' }}
                          name='players'
                          multiple
                          value={selectedPlayersId}
                          onChange={(e) => {
                            handleSelectedPlayerIds(e)
                          }}
                          input={<OutlinedInput label='Tag' />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                        >
                          {PlayerList.filter(
                            (p) =>
                              selectedPlayers.filter(
                                (s) => s.playerId == p.playerId
                              ).length == 0
                          ).map((p) => (
                            <MenuItem key={v4()} value={p.playerId}>
                              <Checkbox
                                checked={
                                  selectedPlayersId.indexOf(p.playerId) > -1
                                }
                              />
                              <ListItemText primary={p.name} />
                            </MenuItem>
                          ))}
                        </Select>

                        <Select
                          sx={{ width: '150px' }}
                          onChange={(e) => {
                            setFieldValue('class', e.target.value)
                          }}
                        >
                          <MenuItem key='pe_sergeant' value='pe_sergeant'>
                            Sergeant
                          </MenuItem>
                          <MenuItem key='pe_manatarms' value='pe_manatarms'>
                            Man At Arms
                          </MenuItem>
                          <MenuItem key='pe_lancer' value='pe_lancer'>
                            Lancer
                          </MenuItem>
                          <MenuItem
                            key='pe_militia_cavalry'
                            value='pe_militia_cavalry'
                          >
                            Militia Cavalry
                          </MenuItem>
                          <MenuItem key='pe_militia' value='pe_militia'>
                            Militia
                          </MenuItem>
                          <MenuItem
                            key='pe_master_archer'
                            value='pe_master_archer'
                          >
                            Master Archer
                          </MenuItem>
                          <MenuItem key='pe_archer' value='pe_archer'>
                            Archer
                          </MenuItem>
                          <MenuItem
                            key='pe_master_crossbowman'
                            value='pe_master_crossbowman'
                          >
                            Master Crossbowman
                          </MenuItem>
                          <MenuItem key='pe_crossbowman' value='pe_crossbowman'>
                            Crossbowman
                          </MenuItem>
                        </Select>

                        <Select
                          name='team'
                          sx={{ width: '150px' }}
                          onChange={(e) => {
                            setFieldValue('team', e.target.value)
                          }}
                        >
                          <MenuItem key='1' value='1'>
                            Team 1
                          </MenuItem>
                          <MenuItem key='2' value='2'>
                            Team 2
                          </MenuItem>
                        </Select>

                        <button className='btn btn btn-primary' type='submit'>
                          Add Players
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-6 text-center'>
                <h3 className='text-primary'>Battle Team 1</h3>
                <div className='row'>
                  <div className='col-md-12'>
                    <DataTable
                      columns={columns}
                      data={selectedPlayers.filter((p) => p.team == 1)}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-6 text-center'>
                <h3 className='text-danger'>Battle Team 2</h3>
                <div className='row'>
                  <div className='col-md-12'>
                    <DataTable
                      columns={columns}
                      data={selectedPlayers.filter((p) => p.team == 2)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-10'>
              <div className='col-md-12 text-center'>
                <a
                  className='btn btn-primary'
                  onClick={() => {
                    showConfirmModal({
                      message: 'Confirm load event players from database!',
                      onConfirm: () => {
                        getSavedPlayerListForEvent({
                          payload: { keywords: '' },
                          gameUrl: gameUrl,
                        })
                      },
                    })
                  }}
                  href='#'
                >
                  Load
                </a>

                <a
                  className='btn btn-primary ms-2'
                  onClick={() => {
                    if (selectedPlayers.length > 0) {
                      showConfirmModal({
                        message: 'Confirm save event players to database!',
                        onConfirm: () => {
                          SaveEventPlayerToDatabase()
                        },
                      })
                    } else {
                      showDialogModal({ message: 'Please select players!' })
                    }
                  }}
                  href='#'
                >
                  Save
                </a>

                <a
                  className='btn btn-danger ms-2'
                  href='#'
                  onClick={() => {
                    showConfirmModal({
                      message: 'Confirm Assign teams to Battle Event!',
                      onConfirm: () => {
                        handleAssignTeamsToBattleEvent()
                      },
                    })
                  }}
                >
                  Assign teams to Battle Event
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGameBattleEvent
function setFieldValue(arg0: string) {
  throw new Error('Function not implemented.')
}
