'use client'

import { useEffect, useRef, useState } from 'react'
import WheelSpin, { CanReDraw } from './wheel'
import { EventPlayer } from '@/services/models/adminGame/eventPlayer'
import {
  useGetGachaItemsForEventMutation,
  useGetPlayerListForEventMutation,
} from '@/services/mountAndBladeGameService'
import { GachaItem } from '@/services/models/adminGame/gachaItem'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/contexts/appContext'
import { FormKeyword } from '@/types/type'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers } from 'formik'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { v4 } from 'uuid'
import { ResultCode } from '@/utils/enums'
import PageLoading from '@/components/pageLoading'

const ITEM_HEIGHT = 32
const ITEM_PADDING_TOP = 8

type FormGachaEvent = {
  players: EventPlayer[]
  gachaItems: GachaItem[]
}

export type PlayersAndAward = {
  player: EventPlayer
  round: number
  gachaItem: GachaItem
}

var currentRound = 1
var currentPlayer = -1

const GachaComponent: React.FC = () => {
  const { gameUrl } = useParams()
  const { locale, setLocale } = useAppContext()

  const wheelCahvas = useRef<typeof WheelSpin>(null)
  const wheelCahvasRef = useRef<CanReDraw>(null)

  const [keyWords, setKeyWords] = useState<string | null>('')
  let initialFormKeyword: FormKeyword = {
    keywords: '',
  }
  // Round, current Player

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  let initialForm: FormGachaEvent = {
    players: [],
    gachaItems: [],
  }

  const validationSchema = () => {
    return Yup.object().shape({
      keywords: Yup.string().max(20),
    })
  }

  const handleOnSubmit = (
    values: FormGachaEvent,
    actions: FormikHelpers<FormGachaEvent>
  ) => {
    let selectedPlayernew = PlayerList.filter(
      (p) => selectedPlayersId.indexOf(p.playerId) != -1
    )

    setSelectedPlayers((prev) => [...prev, ...selectedPlayernew])
    setSelectedPlayersId([])

    let selectedGachaItemnew = GachaitemList.filter(
      (p) => selectedGachaItemIds.indexOf(p.id) != -1
    )

    setSelectedGachaitemList((prev) => [...prev, ...selectedGachaItemnew])
    setSelectedGachaItemIds([])
    wheelCahvasRef.current?.ReDraw()
    actions.resetForm()
  }

  const [PlayersAndAwardList, setPlayersAndAwardList] = useState<
    PlayersAndAward[]
  >([])

  const [isShowWinner, setIsShowWinner] = useState<boolean>(false)
  const [currentWinner, setCurrentWinner] = useState<GachaItem | null>()

  const [selectedPlayers, setSelectedPlayers] = useState<EventPlayer[]>([])
  const [PlayerList, setPlayerList] = useState<EventPlayer[]>([])
  // get list
  const [getPlayerListForEvent, getPlayerListForEventStatus] =
    useGetPlayerListForEventMutation()

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

  // get gacha item list
  const [GachaitemList, setGachaitemList] = useState<GachaItem[]>([])
  const [selectedGachaitemList, setSelectedGachaitemList] = useState<
    GachaItem[]
  >([])
  const [getGachaItemList, getGachaItemListStatus] =
    useGetGachaItemsForEventMutation()

  useEffect(() => {
    getGachaItemList({
      payload: { keywords: '' },
      gameUrl: gameUrl,
    })
  }, [])

  useEffect(() => {
    if (
      getGachaItemListStatus.isSuccess &&
      getGachaItemListStatus.data.resource != null
    ) {
      setGachaitemList(getGachaItemListStatus.data.resource)
    }
  }, [getGachaItemListStatus])

  const onFinished = (winner: GachaItem) => {
    setCurrentWinner(winner)
    setIsShowWinner(true)
    setTimeout(() => {
      setIsShowWinner(false)
    }, 10000)
  }

  const [selectedPlayersId, setSelectedPlayersId] = useState<string[]>([])

  const handleSelectedPlayerIds = (
    event: SelectChangeEvent<typeof selectedPlayersId>
  ) => {
    const {
      target: { value },
    } = event

    setSelectedPlayersId(typeof value === 'string' ? value.split(',') : value)
  }

  const [selectedGachaItemIds, setSelectedGachaItemIds] = useState<string[]>([])

  const handleSelectedGachaItemIds = (
    event: SelectChangeEvent<typeof selectedPlayersId>
  ) => {
    const {
      target: { value },
    } = event

    setSelectedGachaItemIds(
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <>
      {(getGachaItemListStatus.isLoading ||
        getPlayerListForEventStatus.isLoading) && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <div className='row'>
              <div className='col-md-2'>
                <h4 className='card-header-title text-dark'>Gacha</h4>
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
                          sx={{ width: '300px' }}
                          name='gachaItems'
                          multiple
                          value={selectedGachaItemIds}
                          onChange={(e) => {
                            handleSelectedGachaItemIds(e)
                          }}
                          input={<OutlinedInput label='Tag' />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={MenuProps}
                          label='Gacha Item'
                        >
                          {GachaitemList.filter(
                            (p) =>
                              selectedGachaitemList.filter((s) => s.id == p.id)
                                .length == 0
                          ).map((p) => (
                            <MenuItem key={v4()} value={p.id}>
                              <Checkbox
                                checked={
                                  selectedGachaItemIds.indexOf(p.id) > -1
                                }
                              />
                              <ListItemText primary={p.name} />
                            </MenuItem>
                          ))}
                        </Select>
                        <button className='btn btn btn-primary' type='submit'>
                          Update
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className='card-body '>
            <div className='position-relative'>
              {selectedGachaitemList.length > 0 && (
                <WheelSpin
                  ref={wheelCahvasRef}
                  gachaItems={selectedGachaitemList}
                  winningSegment=''
                  onStart={() => {
                    if (currentPlayer < selectedPlayers.length - 1) {
                      currentPlayer++
                    } else {
                      currentPlayer = 0
                      currentRound++
                    }
                  }}
                  onFinished={(winner: GachaItem) => {
                    onFinished(winner)
                    let players = selectedPlayers
                    let pna: PlayersAndAward = {
                      player: players[currentPlayer],
                      round: currentRound,
                      gachaItem: winner,
                    }

                    setPlayersAndAwardList((prev) => [...prev, pna])
                  }}
                  primaryColor='#fff'
                  primaryColoraround='#f4d03fe8'
                  contrastColor='#fff'
                  buttonText='Spin'
                  isOnlyOnce={false}
                  size={380}
                  upDuration={100}
                  downDuration={3000}
                />
              )}
              {isShowWinner && (
                <a
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                  href='#'
                >
                  <div id='winner' className='winner-container'>
                    <div className='winner-bg'>
                      <p>Round: {currentRound}</p>
                      <p>Player: {selectedPlayers[currentPlayer]?.name}</p>
                      <p>Win: {currentWinner?.name}</p>
                    </div>
                  </div>
                </a>
              )}
            </div>
            <div className='row'>
              <div className='col-md-12'>
                {PlayersAndAwardList.length > 0 && (
                  <table className='table table-striped w-100'>
                    <thead>
                      <tr>
                        <th scope='col'>Round</th>
                        <th scope='col'>Player</th>
                        <th scope='col'>Award</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PlayersAndAwardList.map((item) => (
                        <tr>
                          <td>{item.round}</td>
                          <td>{item.player.name}</td>
                          <td>{item.gachaItem.name}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className='text-center'>
                          {/* <a
                            className='btn btn-primary'
                            href='#'
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            Send Award To Player Inventory
                          </a> */}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GachaComponent
