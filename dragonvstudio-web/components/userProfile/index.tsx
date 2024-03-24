'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { v4 } from 'uuid'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import * as Yup from 'yup'
import * as uuid from 'uuid'
import { AppSetting } from '../../types/type'
import { ResultCode } from '../../utils/enums'
import LoginModal from '../loginModal'
import { useEffect, useRef, useState } from 'react'
import {
  useGetEventBookingAvaiableDateQuery,
  useAddEditPrivateTalkMutation,
} from '../../services/event'
import calcTime from '../../utils/time'
import dateFormat from 'dateformat'
import showConfirmModal from '../modal'
import showDialogModal from '../modal/showModal'
import { NIL as NIL_UUID } from 'uuid'
import PageLoading from '../pageLoading'
import { useSession } from 'next-auth/react'
import { UpdateProfileRequest } from '@/services/communication/request/updateProfileRequest'
import { GlobalKeys } from '@/utils/constants'
import {
  useUserUpdateAvatarMutation,
  useUserUpdateProfileMutation,
} from '@/services/account'
import { useUploadImageMutation } from '@/services/fileService'
import { User } from '@/services/models/user'
import { toast } from 'react-toastify'

let appSetting: AppSetting = require('../../appSetting.json')

interface FormValues {
  fullName: any
  phone: any
  address: any
  email: any
}

interface FormAvatarValues {
  file: any
}

let payload: UpdateProfileRequest

const UserProfile: React.FC = () => {
  const { locale } = useAppContext()
  const { data: session, status, update: sessionUpdate } = useSession()

  const currentUser = session?.user
  const [currentAvatar, setcurrentAvatar] = useState<string>(
    currentUser?.image ?? GlobalKeys.NoAvatarUrl
  )
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  let initialValues: FormValues = {
    fullName: currentUser?.fullName,
    phone: currentUser?.phone,
    address: currentUser?.address,
    email: currentUser?.email,
  }
  let initialAvatarValues: FormAvatarValues = { file: '' }
  const [updateProfile, { isLoading, data, error }] =
    useUserUpdateProfileMutation()
  const [updateAvatar, updateAvatarStatus] = useUserUpdateAvatarMutation()
  const [uploadFile, uploadData] = useUploadImageMutation()
  const handleEditMode = (value: boolean) => {
    setIsEditMode(value)
  }
  const validationSchema = () => {
    return Yup.object().shape({
      fullName: Yup.string().required(dictionaryList[locale]['RequiredField']),
      phone: Yup.string().required(dictionaryList[locale]['RequiredField']),
      address: Yup.string().required(dictionaryList[locale]['RequiredField']),
      email: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .email('Email is invalid!')
        .test(
          'EmailAlreadyRegistered',
          dictionaryList[locale]['EmailAlreadyRegistered'],
          (email) => {
            if (email) {
              return new Promise((resolve, reject) => {
                fetch(
                  appSetting.APIUrl +
                    'account/checkEmailWithUser?email=' +
                    email +
                    '&id=' +
                    currentUser?.id
                )
                  .then((response) => response.json())
                  .then((json) => {
                    if (json.resultCode == ResultCode.Invalid) resolve(false)
                    else resolve(true)
                  })
                  .catch(() => {
                    resolve(false)
                  })
              })
            } else {
              return true
            }
          }
        ),
    })
  }
  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    payload = {
      fullName: values.fullName,
      email: values.email,
      address: values.address,
      phone: values.phone,
    }
    updateProfile({ payload: payload })
    async function updateSessionUserInfor(
      fullName: any,
      email: any,
      address: any,
      phone: any
    ) {
      await sessionUpdate({
        userInfo: {
          fullName: fullName,
          email: email,
          address: address,
          phone: phone,
        },
      })
    }

    updateSessionUserInfor(
      values.fullName,
      values.email,
      values.address,
      values.phone
    )
  }

  const inputFileUploadRef = useRef<HTMLInputElement>(null)

  const handleSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let file = e.target.files?.item(0)
    if (file) {
      const formData = new FormData()
      formData.append('file', file!)
      uploadFile(formData)
    }
  }

  const handleUploadFile: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    inputFileUploadRef.current?.click()
  }

  useEffect(() => {
    if (data && data.resultCode == ResultCode.Success) {
      let updatedUser: User // = currentUser!

      // updatedUser.fullName = payload.fullName
      // updatedUser.email = payload.email
      // updatedUser.phone = payload.phone
      // updatedUser.address = payload.address
      // setLoggedUser(updatedUser)
      setIsEditMode(false)
      toast.success(dictionaryList[locale]['UpdatedSuccessfully'])
    }
  }, [data])

  useEffect(() => {
    async function updateSessionAvatar(avartarUrl: any) {
      await sessionUpdate({
        infoAvatar: { avatar: avartarUrl },
      })
    }
    if (uploadData.data && uploadData.data.resultCode == ResultCode.Success) {
      setcurrentAvatar(uploadData.data.resource.url)
      updateSessionAvatar(uploadData.data.resource.url)
      updateAvatar({ payload: { avatar: uploadData.data.resource.url } })
    }
  }, [uploadData.data])

  useEffect(() => {
    if (
      updateAvatarStatus.data &&
      updateAvatarStatus.data.resultCode == ResultCode.Success
    ) {
      toast.success(dictionaryList[locale]['UpdatedSuccessfully'])
    }
  }, [updateAvatarStatus.data])

  return (
    <>
      {(isLoading || uploadData.isLoading) && (
        <>
          <PageLoading />
        </>
      )}

      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <h4 className='card-header-title text-dark'>
              <Translation tid='Profile' />
            </h4>
          </div>
          <div className='card-body'>
            <div className='profile-avatar-edit-link-container text-center mb-5'>
              <a
                className='btn btn-primary'
                href='#'
                onClick={handleUploadFile}
              >
                Edit Avatar
              </a>
              <div className='hide' style={{ display: 'none' }}>
                <input
                  type='file'
                  className='hide'
                  ref={inputFileUploadRef}
                  onChange={handleSelectFile}
                />
              </div>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleOnSubmit}
              validationSchema={validationSchema}
            >
              {({ values, errors, touched }) => (
                <Form
                  className={
                    touched.email ||
                    touched.fullName ||
                    touched.address ||
                    touched.phone
                      ? 'was-validated'
                      : ''
                  }
                >
                  <div className='row'>
                    <div className='col-sm-3'>
                      <h6 className='mb-0 text-dark'>
                        <Translation tid='FullName' />
                      </h6>
                    </div>
                    <div className='col-sm-9 profile-card-item'>
                      {!isEditMode && <>{currentUser?.fullName}</>}
                      {isEditMode && (
                        <>
                          <div className='form-group-profile'>
                            <Field
                              type='text'
                              className='form-control form-control-sm'
                              name='fullName'
                              required
                            />
                            <ErrorMessage
                              name='fullName'
                              component='span'
                              className='invalid-feedback'
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col-sm-3'>
                      <h6 className='mb-0 text-dark'>
                        <Translation tid='Email' />
                      </h6>
                    </div>
                    <div className='col-sm-9 profile-card-item'>
                      {!isEditMode && <>{currentUser?.email}</>}
                      {isEditMode && (
                        <>
                          <div className='form-group-profile'>
                            <Field
                              type='text'
                              className='form-control form-control-sm'
                              name='email'
                              required
                            />
                            <ErrorMessage
                              name='email'
                              component='span'
                              className='invalid-feedback'
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col-sm-3'>
                      <h6 className='mb-0'>
                        <Translation tid='Phone' />
                      </h6>
                    </div>
                    <div className='col-sm-9 profile-card-item'>
                      {!isEditMode && <>{currentUser?.phone}</>}
                      {isEditMode && (
                        <>
                          <div className='form-group-profile'>
                            <Field
                              type='phone'
                              className='form-control form-control-sm'
                              name='phone'
                            />
                            <ErrorMessage
                              name='phone'
                              component='span'
                              className='invalid-feedback'
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <hr />
                  <div className='row'>
                    <div className='col-sm-3'>
                      <h6 className='mb-0'>
                        <Translation tid='Address' />
                      </h6>
                    </div>
                    <div className='col-sm-9 profile-card-item'>
                      {!isEditMode && <>{currentUser?.address}</>}
                      {isEditMode && (
                        <>
                          <div className='form-group-profile'>
                            <Field
                              type='text'
                              className='form-control form-control-sm'
                              name='address'
                            />
                            <ErrorMessage
                              name='address'
                              component='span'
                              className='invalid-feedback'
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col-sm-12 align-items-center text-center'>
                      {!isEditMode && (
                        <>
                          <button
                            className='btn btn-round btn-primary'
                            onClick={() => handleEditMode(true)}
                          >
                            <Translation tid='Edit' />
                          </button>
                        </>
                      )}
                      {isEditMode && (
                        <>
                          <button
                            type='submit'
                            className='btn btn-round btn-primary'
                          >
                            <Translation tid='Save' />
                          </button>
                          &nbsp;
                          <button
                            className='btn btn-round btn-secondary'
                            onClick={() => handleEditMode(false)}
                          >
                            <Translation tid='Cancel' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserProfile
