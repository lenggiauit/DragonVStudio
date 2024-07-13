'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { Md5 } from 'md5-typescript'
import { useGoogleLogin } from '@react-oauth/google'
import { AppSetting } from '@/types/type'
import { useAppContext } from '@/contexts/appContext'
import { ResultCode } from '@/utils/enums'
import {
  useBanPlayerMutation,
  useGivePlayerMoneyMutation,
  useTakePlayerMoneyMutation,
} from '@/services/mountAndBladeGameService'
import { dictionaryList } from '@/locales'
import { useParams } from 'next/navigation'
import { Translation } from '@/components/translation'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Player } from '@/services/models/adminGame/player'
import dayjs, { Dayjs } from 'dayjs'
import PageLoading from '@/components/pageLoading'

const appSetting: AppSetting = require('../../../appSetting.json')

type Props = {
  isShow: boolean
  currentPlayer?: Player
  takeMoney: boolean
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type MoneyFormValues = {
  userId: string
  playerId: string
  discordId: string
  amount: number
}

const PlayerBankMoneyModal: React.FC<Props> = ({
  isShow,
  currentPlayer,
  takeMoney,
  onSubmit,
  onClose,
}) => {
  const { locale } = useAppContext()
  const { gameUrl } = useParams()
  let initialValues: MoneyFormValues = {
    userId: currentPlayer?.userId,
    playerId: currentPlayer?.playerId,
    discordId: currentPlayer?.discordId,
    amount: 0,
  }

  //
  const [selectedPunishmentTime, setSelectedPunishmentTime] =
    useState<Dayjs | null>()

  // TakePlayerMoney

  const [TakePlayerMoney, TakePlayerMoneyStatus] = useTakePlayerMoneyMutation()

  // GivePlayerMoney
  const [GivePlayerMoney, GivePlayerMoneyStatus] = useGivePlayerMoneyMutation()

  const validationSchema = () => {
    return Yup.object().shape({
      amount: Yup.number().required(dictionaryList[locale]['RequiredField']),
    })
  }
  const handleOnSubmit = (
    values: MoneyFormValues,
    actions: FormikHelpers<MoneyFormValues>
  ) => {
    if (takeMoney) {
      TakePlayerMoney({
        payload: {
          userId: currentPlayer?.userId,
          playerId: currentPlayer?.playerId,
          discordId: currentPlayer?.discordId,
          amount: values.amount,
        },
        gameUrl: gameUrl,
      })
    } else {
      GivePlayerMoney({
        payload: {
          userId: currentPlayer?.userId,
          playerId: currentPlayer?.playerId,
          discordId: currentPlayer?.discordId,
          amount: values.amount,
        },
        gameUrl: gameUrl,
      })
    }
    actions.resetForm()
  }
  const onCloseHandler: any = () => {
    onClose()
  }

  useEffect(() => {
    if (
      TakePlayerMoneyStatus.data &&
      TakePlayerMoneyStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      TakePlayerMoneyStatus.isError ||
      TakePlayerMoneyStatus.data?.resultCode == ResultCode.Error ||
      TakePlayerMoneyStatus.data?.resultCode == ResultCode.Invalid ||
      TakePlayerMoneyStatus.data?.resultCode == ResultCode.Unknown ||
      TakePlayerMoneyStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [TakePlayerMoneyStatus])

  useEffect(() => {
    if (
      GivePlayerMoneyStatus.data &&
      GivePlayerMoneyStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      GivePlayerMoneyStatus.isError ||
      GivePlayerMoneyStatus.data?.resultCode == ResultCode.Error ||
      GivePlayerMoneyStatus.data?.resultCode == ResultCode.Invalid ||
      GivePlayerMoneyStatus.data?.resultCode == ResultCode.Unknown ||
      GivePlayerMoneyStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [GivePlayerMoneyStatus])

  return (
    <>
      {TakePlayerMoneyStatus.isLoading ||
        (GivePlayerMoneyStatus.isLoading && <PageLoading />)}
      <div
        className={`${isShow ? 'modal fade show' : 'modal fade'}`}
        style={{
          display: isShow ? 'block' : 'none',
        }}
        id='modal-large'
        role='dialog'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-dark'>
                {' '}
                {takeMoney
                  ? 'Take money from bank of player ' + currentPlayer?.name
                  : 'Give player ' + currentPlayer?.name + ' money'}
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={() => {
                  onCloseHandler()
                }}
              ></button>
            </div>
            <div className='modal-body'>
              <Formik
                initialValues={initialValues}
                onSubmit={handleOnSubmit}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched }) => (
                  <Form
                    autoComplete={'off'}
                    className={touched.amount ? 'was-validated' : ''}
                  >
                    <div className='form-group'>
                      <label>Player Id: </label> {currentPlayer?.playerId}
                    </div>
                    <div className='form-group mt-4'>
                      <label>Discord Id: </label> {currentPlayer?.discordId}
                    </div>
                    <div className='form-group mt-4'>
                      <label>Player Name: </label> {currentPlayer?.name}
                    </div>

                    <div className='form-group mt-4'>
                      <Field
                        type='number'
                        className='form-control'
                        name='amount'
                        placeholder='Amount'
                        required
                      />
                      <ErrorMessage
                        name='amount'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={
                          TakePlayerMoneyStatus.isLoading ||
                          GivePlayerMoneyStatus.isLoading
                        }
                      >
                        {takeMoney ? 'Take money' : 'Give money'}
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={
                          TakePlayerMoneyStatus.isLoading ||
                          GivePlayerMoneyStatus.isLoading
                        }
                      >
                        Close
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerBankMoneyModal
