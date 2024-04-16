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
  useChangePlayerNameMutation,
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
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type ChangePlayerNameFormValues = {
  playerId: string
  name: string
}

const ChangePlayerNameModal: React.FC<Props> = ({
  isShow,
  currentPlayer,
  onSubmit,
  onClose,
}) => {
  const { locale } = useAppContext()
  const { gameUrl } = useParams()
  let initialValues: ChangePlayerNameFormValues = {
    playerId: currentPlayer?.playerId,
    name: currentPlayer?.name,
  }

  //
  const [selectedPunishmentTime, setSelectedPunishmentTime] =
    useState<Dayjs | null>()

  //  Change Player Name
  const [ChangePlayerName, ChangePlayerNameStatus] =
    useChangePlayerNameMutation()

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required(dictionaryList[locale]['RequiredField']),
    })
  }
  const handleOnSubmit = (
    values: ChangePlayerNameFormValues,
    actions: FormikHelpers<ChangePlayerNameFormValues>
  ) => {
    ChangePlayerName({
      payload: {
        playerId: currentPlayer?.playerId,
        name: values.name,
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
      ChangePlayerNameStatus.data &&
      ChangePlayerNameStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      ChangePlayerNameStatus.isError ||
      ChangePlayerNameStatus.data?.resultCode == ResultCode.Error ||
      ChangePlayerNameStatus.data?.resultCode == ResultCode.Invalid ||
      ChangePlayerNameStatus.data?.resultCode == ResultCode.Unknown ||
      ChangePlayerNameStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [ChangePlayerNameStatus])

  return (
    <>
      {ChangePlayerNameStatus.isLoading && <PageLoading />}
      <div
        className={`${isShow ? 'modal fade show' : 'modal fade'}`}
        style={{
          display: isShow ? 'block' : 'none',
        }}
        id='modal-large'
        role='dialog'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-md modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-dark'>
                Change name of player: {currentPlayer?.name}
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
                enableReinitialize={true}
              >
                {({ values, errors, touched }) => (
                  <Form
                    autoComplete={'off'}
                    className={touched.name ? 'was-validated' : ''}
                  >
                    <div className='form-group mt-4'>
                      <input
                        type='hidden'
                        name='playerId'
                        value={currentPlayer?.playerId}
                      />
                      <Field
                        type='text'
                        className='form-control form-control-sm'
                        name='name'
                        placeholder='Name'
                        required
                      />
                      <ErrorMessage
                        name='name'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={ChangePlayerNameStatus.isLoading}
                      >
                        Change
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={ChangePlayerNameStatus.isLoading}
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

export default ChangePlayerNameModal
