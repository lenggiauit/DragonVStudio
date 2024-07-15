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
import { useBanPlayerMutation } from '@/services/mountAndBladeGameService'
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
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type BanPlayerFormValues = {
  userId: string
  playerId: string
  discordId: string
  reason: string
  punishmentTime: number
}

const BanPlayerModal: React.FC<Props> = ({
  isShow,
  currentPlayer,
  onSubmit,
  onClose,
}) => {
  const { locale } = useAppContext()
  const { gameUrl } = useParams()
  let initialValues: BanPlayerFormValues = {
    userId: currentPlayer?.userId,
    playerId: currentPlayer?.playerId,
    discordId: currentPlayer?.discordId,
    reason: '',
    punishmentTime: 1,
  }

  //
  const [selectedPunishmentTime, setSelectedPunishmentTime] =
    useState<Dayjs | null>()

  // ban
  const [BanPlayer, BanPlayerStatus] = useBanPlayerMutation()

  const validationSchema = () => {
    return Yup.object().shape({
      reason: Yup.string().required(dictionaryList[locale]['RequiredField']),
      punishmentTime: Yup.number().required(
        dictionaryList[locale]['RequiredField']
      ),
    })
  }
  const handleOnSubmit = (
    values: BanPlayerFormValues,
    actions: FormikHelpers<BanPlayerFormValues>
  ) => {
    BanPlayer({
      payload: {
        userId: currentPlayer?.userId,
        playerId: currentPlayer?.playerId,
        discordId: currentPlayer?.discordId,
        name: currentPlayer?.name,
        reason: values.reason,
        punishmentTime: values.punishmentTime,
      },
      gameUrl: gameUrl,
    })
    actions.resetForm()
  }
  const onCloseHandler: any = () => {
    onClose()
  }

  useEffect(() => {
    if (
      BanPlayerStatus.data &&
      BanPlayerStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      BanPlayerStatus.isError ||
      BanPlayerStatus.data?.resultCode == ResultCode.Error ||
      BanPlayerStatus.data?.resultCode == ResultCode.Invalid ||
      BanPlayerStatus.data?.resultCode == ResultCode.Unknown ||
      BanPlayerStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [BanPlayerStatus])

  return (
    <>
      {BanPlayerStatus.isLoading && <PageLoading />}
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
              <h5 className='modal-title text-dark'>Ban player</h5>
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
                    className={
                      touched.reason || touched.punishmentTime
                        ? 'was-validated'
                        : ''
                    }
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
                        type='textarea'
                        as='textarea'
                        className='form-control'
                        name='reason'
                        placeholder='Ban reason'
                        required
                      />
                      <ErrorMessage
                        name='reason'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group  mt-4'>
                      <Field
                        type='number'
                        min='0'
                        step='1'
                        className='form-control'
                        name='punishmentTime'
                        placeholder='days'
                        required
                      />
                      <ErrorMessage
                        name='punishmentTime'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={BanPlayerStatus.isLoading}
                      >
                        Ban
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={BanPlayerStatus.isLoading}
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

export default BanPlayerModal
