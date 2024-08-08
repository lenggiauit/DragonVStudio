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
  useUpdatePersonalPropertyMutation,
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
import { PersonalProperty } from '@/services/models/adminGame/personalProperty'

const appSetting: AppSetting = require('../../../appSetting.json')

type Props = {
  isShow: boolean
  currentPP?: PersonalProperty
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type PPFormValues = {
  id: any
  propertyIndex: any
  propertyName: any
  propertyBanner: any
  ownerId: any
}

const UpdatePersonalPropertyModal: React.FC<Props> = ({
  isShow,
  currentPP,
  onSubmit,
  onClose,
}) => {
  const { locale } = useAppContext()
  const { gameUrl } = useParams()
  let initialValues: PPFormValues = {
    id: currentPP != null ? currentPP?.id : '',
    propertyIndex: currentPP != null ? currentPP?.propertyIndex : '',
    propertyName: currentPP != null ? currentPP?.propertyName : '',
    propertyBanner: currentPP != null ? currentPP?.propertyBanner : '',
    ownerId: currentPP != null ? currentPP?.ownerId : '',
  }

  const [UpdatePP, UpdatePPStatus] = useUpdatePersonalPropertyMutation()

  const validationSchema = () => {
    return Yup.object().shape({
      propertyName: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
      propertyBanner: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
    })
  }
  const handleOnSubmit = (
    values: PPFormValues,
    actions: FormikHelpers<PPFormValues>
  ) => {
    UpdatePP({
      payload: {
        id: currentPP?.id,
        propertyIndex: values.propertyIndex,
        propertyName: values.propertyName,
        propertyBanner: values.propertyBanner,
        ownerId: values.ownerId,
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
      UpdatePPStatus.data &&
      UpdatePPStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      UpdatePPStatus.isError ||
      UpdatePPStatus.data?.resultCode == ResultCode.Error ||
      UpdatePPStatus.data?.resultCode == ResultCode.Invalid ||
      UpdatePPStatus.data?.resultCode == ResultCode.Unknown ||
      UpdatePPStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [UpdatePPStatus])

  useEffect(() => {
    if (
      UpdatePPStatus.data &&
      UpdatePPStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      UpdatePPStatus.isError ||
      UpdatePPStatus.data?.resultCode == ResultCode.Error ||
      UpdatePPStatus.data?.resultCode == ResultCode.Invalid ||
      UpdatePPStatus.data?.resultCode == ResultCode.Unknown ||
      UpdatePPStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [UpdatePPStatus])

  return (
    <>
      {UpdatePPStatus.isLoading ||
        (UpdatePPStatus.isLoading && <PageLoading />)}
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
                Update Personal Property
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
                    className={
                      touched.propertyName ||
                      touched.propertyBanner ||
                      touched.ownerId
                        ? 'was-validated'
                        : ''
                    }
                  >
                    <div className='form-group'>
                      <label>Id: </label> {currentPP?.id}
                    </div>
                    <div className='form-group mt-4'>
                      <label>Index: </label> {currentPP?.propertyIndex}
                    </div>

                    <div className='form-group mt-4'>
                      <Field
                        type='text'
                        className='form-control'
                        name='propertyName'
                        placeholder='propertyName'
                        required
                      />
                      <ErrorMessage
                        name='propertyName'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-4'>
                      <Field
                        type='text'
                        className='form-control'
                        name='propertyBanner'
                        placeholder='propertyBanner'
                        required
                      />
                      <ErrorMessage
                        name='propertyBanner'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-4'>
                      <Field
                        type='text'
                        className='form-control'
                        name='ownerId'
                        placeholder='ownerId'
                      />
                      <ErrorMessage
                        name='ownerId'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={UpdatePPStatus.isLoading}
                      >
                        Update
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={UpdatePPStatus.isLoading}
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

export default UpdatePersonalPropertyModal
