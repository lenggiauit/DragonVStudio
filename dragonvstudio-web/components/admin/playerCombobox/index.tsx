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
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

const ITEM_HEIGHT = 32
const ITEM_PADDING_TOP = 8

type FormAddPlayer = {
  players: EventPlayer[]
  class: any
  team: number
}

type Props = {
  data?: EventPlayer
  onChange: (data?: EventPlayer) => void
  onClear: () => void
}

const AdminGameBattleEvent: React.FC<Props> = ({
  data,
  onChange,
  onClear,
}): ReactElement => {
  const { gameUrl } = useParams()
  const { locale } = useAppContext()
  const [PlayerList, setPlayerList] = useState<EventPlayer[]>([])
  const [keyWords, setKeyWords] = useState<string | null>('')
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

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  return (
    <>
      {getPlayerListForEventStatus.isLoading && <PageLoading />}
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
            selectedPlayers.filter((s) => s.playerId == p.playerId).length == 0
        ).map((p) => (
          <MenuItem key={v4()} value={p.playerId}>
            <Checkbox checked={selectedPlayersId.indexOf(p.playerId) > -1} />
            <ListItemText primary={p.name} />
          </MenuItem>
        ))}
      </Select>
    </>
  )
}
