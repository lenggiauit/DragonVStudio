'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import {
  useAssignPlayerBackToPreviousRoleAndfactionMutation,
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
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { v4 } from 'uuid'
import { EventPlayer } from '@/services/models/adminGame/eventPlayer'
import { dictionaryList } from '@/locales'
import { useAppContext } from '@/contexts/appContext'
import DataTable, { TableColumn } from 'react-data-table-component'
import showConfirmModal from '@/components/modal'
import showDialogModal from '@/components/modal/showModal'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { toast } from 'react-toastify'

const ITEM_HEIGHT = 32
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
  //  assign back
  const [
    AssignPlayerBackToPreviousRoleAndfaction,
    AssignPlayerBackToPreviousRoleAndfactionStatus,
  ] = useAssignPlayerBackToPreviousRoleAndfactionMutation()

  const [eventEquipment, setEventEquipment] = useState<string | null>('tier1')

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
      console.log(getSavedPlayerListForEventStatus.data.resource)
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
      payload: { players: selectedPlayers, equipmentId: eventEquipment },
    })
  }

  const handleAssignTeamsBackToPreviousRoleandFaction = () => {
    AssignPlayerBackToPreviousRoleAndfaction({
      gameUrl: gameUrl,
      payload: { keywords: '' },
    })
  }

  useEffect(() => {
    if (
      AssignPlayerBackToPreviousRoleAndfactionStatus.isSuccess &&
      AssignPlayerBackToPreviousRoleAndfactionStatus.data.resultCode ==
        ResultCode.Success
    ) {
      toast.success(
        'Assign Player Back To Previous RoleA nd Faction Successfully!'
      )
    }
    if (
      AssignPlayerBackToPreviousRoleAndfactionStatus.isError ||
      AssignPlayerBackToPreviousRoleAndfactionStatus.data?.resultCode ==
        ResultCode.Error ||
      AssignPlayerBackToPreviousRoleAndfactionStatus.data?.resultCode ==
        ResultCode.UnAuthorized ||
      AssignPlayerBackToPreviousRoleAndfactionStatus.data?.resultCode ==
        ResultCode.Unknown
    ) {
      toast.error('Error, please try again!')
    }
  }, [AssignPlayerBackToPreviousRoleAndfactionStatus])

  useEffect(() => {
    if (
      SavePlayersEventStatus.isSuccess &&
      SavePlayersEventStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Saved!')
    }

    if (
      SavePlayersEventStatus.isError ||
      SavePlayersEventStatus.data?.resultCode == ResultCode.Error ||
      SavePlayersEventStatus.data?.resultCode == ResultCode.UnAuthorized ||
      SavePlayersEventStatus.data?.resultCode == ResultCode.Unknown
    ) {
      toast.error('Error, please try again!')
    }
  }, [SavePlayersEventStatus])

  useEffect(() => {
    if (
      AssignTeamsToBattleEventStatus.isSuccess &&
      AssignTeamsToBattleEventStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success('Assign Teams To Battle Event Successfully!')
    }
    if (
      AssignTeamsToBattleEventStatus.isError ||
      AssignTeamsToBattleEventStatus.data?.resultCode == ResultCode.Error ||
      AssignTeamsToBattleEventStatus.data?.resultCode ==
        ResultCode.UnAuthorized ||
      AssignTeamsToBattleEventStatus.data?.resultCode == ResultCode.Unknown
    ) {
      toast.error('Error, please try again!')
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
      cell: (row: any) => (
        <>
          <select
            className='form-select form-select-sm'
            onChange={(e) => {
              let newList = [...selectedPlayers]
              newList = newList.map((i) => {
                if (i.playerId === row.playerId) {
                  return { ...i, class: e.target.value }
                } else {
                  return i
                }
              })
              setSelectedPlayers(newList)
            }}
          >
            <option
              selected={row.class == 'pe_sergeant'}
              key='pe_sergeant'
              value='pe_sergeant'
            >
              Sergeant
            </option>
            <option
              key='pe_manatarms'
              selected={row.class == 'pe_manatarms'}
              value='pe_manatarms'
            >
              Man At Arms
            </option>
            <option
              key='pe_master_archer'
              selected={row.class == 'pe_master_archer'}
              value='pe_master_archer'
            >
              Master Archer
            </option>

            <option
              key='pe_master_crossbowman'
              selected={row.class == 'pe_master_crossbowman'}
              value='pe_master_crossbowman'
            >
              Master Crossbowman
            </option>
            <option
              key='pe_doctor'
              selected={row.class == 'pe_doctor'}
              value='pe_doctor'
            >
              Doctor
            </option>
          </select>
        </>
      ),
      sortable: true,
    },
    {
      id: 'action',
      name: 'Action',
      width: '95px',
      cell: (row: any) => (
        <>
          <a
            className='me-2'
            href='#'
            title='Change team'
            onClick={() => {
              let newList = [...selectedPlayers]

              newList = newList.map((i) => {
                if (i.playerId == row.playerId) {
                  return { ...i, team: i.team == 1 ? 2 : 1 }
                } else {
                  return i
                }
              })

              setSelectedPlayers(newList)
            }}
          >
            <i className='bi bi-arrow-left-right' style={{ fontSize: 24 }} />
          </a>
          <a
            href='#'
            title='Remove'
            onClick={() => {
              let newList = selectedPlayers.filter(
                (p) => p.playerId != row.playerId
              )
              setSelectedPlayers(newList)
            }}
          >
            <i className='bi bi-x' style={{ fontSize: 32 }} />
          </a>
        </>
      ),
      sortable: true,
    },
  ]

  return (
    <>
      {(getPlayerListForEventStatus.isLoading ||
        getSavedPlayerListForEventStatus.isLoading ||
        AssignTeamsToBattleEventStatus.isLoading ||
        AssignPlayerBackToPreviousRoleAndfactionStatus.isLoading ||
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
                          sx={{ width: '350px', height: '350px' }}
                          name='players'
                          multiple
                          value={selectedPlayersId}
                          onChange={(e) => {
                            handleSelectedPlayerIds(e)
                          }}
                          input={<OutlinedInput label='Tag' />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                          label='player'
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
                          {/* <MenuItem key='pe_lancer' value='pe_lancer'>
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
                          </MenuItem> */}
                          <MenuItem
                            key='pe_master_archer'
                            value='pe_master_archer'
                          >
                            Master Archer
                          </MenuItem>
                          {/* <MenuItem key='pe_archer' value='pe_archer'>
                            Archer
                          </MenuItem> */}
                          <MenuItem
                            key='pe_master_crossbowman'
                            value='pe_master_crossbowman'
                          >
                            Master Crossbowman
                          </MenuItem>
                          <MenuItem key='pe_doctor' value='pe_doctor'>
                            Doctor
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
                            Blue Team
                          </MenuItem>
                          <MenuItem key='2' value='2'>
                            Red Team
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
                <h3 className='text-primary'>Blue Team</h3>
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
                <h3 className='text-danger'>Red Team</h3>
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

            <div className='row mt-4'>
              <h5>Event Equipment</h5>
              <div className='col-lg-12'>
                <Select
                  name='eventEquipment'
                  defaultValue={eventEquipment}
                  sx={{ width: '250px' }}
                  onChange={(e) => {
                    setEventEquipment(e.target.value)
                  }}
                >
                  <MenuItem key='tier1' value='tier1'>
                    Tier 1
                  </MenuItem>
                  <MenuItem key='tier2' value='tier2'>
                    Tier 2
                  </MenuItem>
                  <MenuItem key='tier3' value='tier3'>
                    Tier 3
                  </MenuItem>
                  <MenuItem key='tier4' value='tier4'>
                    Tier 4
                  </MenuItem>
                  <MenuItem key='tier5' value='tier5'>
                    Tier 5
                  </MenuItem>
                  <MenuItem key='tier6' value='tier6'>
                    Tier 6
                  </MenuItem>
                </Select>
              </div>
            </div>

            <div className='row mt-10'>
              <div className='col-md-12 text-center'>
                <a
                  className='btn btn-primary mt-2'
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
                  className='btn btn-primary ms-2 mt-2'
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
                  className='btn btn-danger ms-2 mt-2'
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

                <a
                  className='btn btn-warning ms-2 mt-2'
                  href='#'
                  onClick={() => {
                    showConfirmModal({
                      message:
                        'Confirm Assign teams back to previous Role and Faction!',
                      onConfirm: () => {
                        handleAssignTeamsBackToPreviousRoleandFaction()
                      },
                    })
                  }}
                >
                  Assign teams back to previous Role and Faction
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
