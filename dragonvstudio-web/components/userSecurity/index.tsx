'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import * as Yup from 'yup'
import { AppSetting } from '../../types/type'

import PageLoading from '../pageLoading'
import { useSession } from 'next-auth/react'
import { UpdateProfileRequest } from '@/services/communication/request/updateProfileRequest'
import { GlobalKeys } from '@/utils/constants'
import {
  useChangePasswordMutation,
  useConnectDiscordMutation,
} from '@/services/account'
import { toast } from 'react-toastify'
import { useQuery } from '@/utils/functions'
import { Md5 } from 'md5-typescript'
import { useEffect, useState } from 'react'
import { ResultCode } from '@/utils/enums'

let appSetting: AppSetting = require('../../appSetting.json')

interface FormValues {
  password: any
  confirmPassword: any
}

interface FormAvatarValues {
  file: any
}

let payload: UpdateProfileRequest

const UserSecurity: React.FC = () => {
  const { locale } = useAppContext()

  const queryString = useQuery()
  const { data: session, status, update: sessionUpdate } = useSession()

  const currentUser = session?.user

  const [isPasswordSecure, setIsPasswordSecure] = useState(true)
  const [changePassword, { isLoading, data, error }] =
    useChangePasswordMutation()

  const [connectDisconrd, connectDisconrdStatus] = useConnectDiscordMutation()

  let initialValues: FormValues = { password: '', confirmPassword: '' }

  const validationSchema = () => {
    return Yup.object().shape({
      password: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .min(8, dictionaryList[locale]['PasswordsLengthRule']),
      confirmPassword: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .oneOf(
          [Yup.ref('password')],
          dictionaryList[locale]['PasswordsMustMatch']
        ),
    })
  }
  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    let pwdEncrypted = Md5.init(values.password)
    changePassword({
      payload: { userInfo: currentUser?.id, newPassword: pwdEncrypted },
    })
    actions.resetForm()
  }

  useEffect(() => {
    if (data && data.resultCode == ResultCode.Success) {
      toast.success(dictionaryList[locale]['UpdatedSuccessfully'])
    }
  }, [data])

  return (
    <>
      {isLoading && (
        <>
          <PageLoading />
        </>
      )}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <h4 className='card-header-title text-dark'>
              <VNTranslation>Bảo mật</VNTranslation>
              <ENTranslation>Security</ENTranslation>
            </h4>
          </div>
          <div className='card-body'>
            <div className='row mb-8'>
              <div className='mb-5'>
                <h3>
                  <VNTranslation>Kết nối</VNTranslation>
                  <ENTranslation>Connected socials</ENTranslation>
                </h3>
              </div>
              <div>
                {currentUser?.discordId == null &&
                  queryString.get('connectWithDiscord') == null && (
                    <>
                      <div className='row bg-light d-flex align-items-center'>
                        <div className='col-md-2 '>
                          <i
                            style={{ fontSize: 48, color: '#' }}
                            className='bi bi-discord text-primary'
                          ></i>
                        </div>
                        <div className='col-md-8 text-start mt-3'>
                          <h5>Discord</h5>
                          <p>Connected to...</p>
                        </div>
                        <div className='col-md-2 mt-1'>
                          <a
                            href={`${appSetting.APIUrl}Account/ConnectingWithDiscord?userId=${currentUser?.id}`}
                            className='btn btn-primary btn-sm'
                          >
                            Conntect
                          </a>
                        </div>
                      </div>
                    </>
                  )}
              </div>
              {(currentUser?.discordId != null ||
                queryString.get('connectWithDiscord') == 'success') && (
                <>
                  <div className='row mt-2 bg-light d-flex align-items-center'>
                    <div className='col-md-2 mt-2'>
                      <i
                        style={{ fontSize: 48, color: '#' }}
                        className='bi bi-discord text-primary'
                      ></i>
                    </div>
                    <div className='col-md-8 text-start mt-3'>
                      <h5>Discord</h5>
                      <p>Connected to {currentUser?.discordId}</p>
                    </div>
                    <div className='col-md-2 mt-1'>
                      <a href='#' className='btn btn-primary btn-sm disabled'>
                        Conntected
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className='row'>
              <div className='mb-5'>
                <h3>
                  <VNTranslation>Thay đổi mật khẩu</VNTranslation>
                  <ENTranslation>Change password</ENTranslation>
                </h3>
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={handleOnSubmit}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched }) => (
                  <Form
                    className={
                      touched.password || touched.confirmPassword
                        ? 'was-validated'
                        : ''
                    }
                  >
                    <div className='mb-4'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <label className='form-label'>Password</label>
                      </div>

                      <div
                        className={`input-group input-group-merge ${
                          errors.password ? 'is-invalid' : ''
                        }`}
                      >
                        <Field
                          type={isPasswordSecure ? 'password' : 'text'}
                          className='form-control form-control-lg'
                          name='password'
                          minLength={8}
                          aria-autocomplete='list'
                          placeholder='8+ characters required'
                          aria-label='8+ characters required'
                          data-hs-toggle-password-options='{
                         "target": "#changePassTarget",
                         "defaultClass": "bi-eye-slash",
                         "showClass": "bi-eye",
                         "classChangeTarget": "#changePassIcon"
                       }'
                          required
                        />
                        <a
                          id='changePassTarget'
                          className='input-group-append input-group-text'
                          href='#'
                          style={{
                            display: errors.password ? 'none' : 'block',
                          }}
                          onClick={() => setIsPasswordSecure(!isPasswordSecure)}
                        >
                          <i
                            id='changePassIcon'
                            className={`${
                              isPasswordSecure ? 'bi-eye-slash' : 'bi-eye-fill'
                            }`}
                          ></i>
                        </a>
                      </div>
                      <ErrorMessage
                        name='password'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='mb-4'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <label className='form-label'>Confirm password</label>
                      </div>

                      <div
                        className={`input-group input-group-merge ${
                          errors.confirmPassword ? 'is-invalid' : ''
                        }`}
                      >
                        <Field
                          type={isPasswordSecure ? 'password' : 'text'}
                          className='form-control form-control-lg'
                          name='confirmPassword'
                          minLength={8}
                          aria-autocomplete='list'
                          placeholder='8+ characters required'
                          aria-label='8+ characters required'
                          data-hs-toggle-password-options='{
                         "target": "#changePassTarget2",
                         "defaultClass": "bi-eye-slash",
                         "showClass": "bi-eye",
                         "classChangeTarget": "#changePassIcon2"
                       }'
                          required
                        />
                        <a
                          id='changePassTarget2'
                          className='input-group-append input-group-text'
                          href='#'
                          style={{
                            display: errors.confirmPassword ? 'none' : 'block',
                          }}
                          onClick={() => setIsPasswordSecure(!isPasswordSecure)}
                        >
                          <i
                            id='changePassIcon2'
                            className={`${
                              isPasswordSecure ? 'bi-eye-slash' : 'bi-eye-fill'
                            }`}
                          ></i>
                        </a>
                      </div>
                      <ErrorMessage
                        name='confirmPassword'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='d-grid mb-3'>
                      <button
                        type='submit'
                        className='btn btn-primary btn-lg'
                        disabled={isLoading}
                      >
                        <Translation tid='Submit' />
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

export default UserSecurity
