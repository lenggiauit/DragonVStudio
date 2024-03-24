'use client'
import React, { useState } from 'react'
import { Translation } from '../../components/translation'
import { Form, Field, Formik, FormikHelpers, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { useResetPasswordMutation } from '../../services/account'
import { Md5 } from 'md5-typescript'
import PageLoading from '../../components/pageLoading'
import { ResultCode } from '../../utils/enums'
import { useQuery } from '@/utils/functions'

interface FormValues {
  password: string
  confirmPassword: string
}
const ResetPasswordForm: React.FC = () => {
  const { locale } = useAppContext()

  const queryString = useQuery()
  const userInfo = queryString.get('code')

  const [isPasswordSecure, setIsPasswordSecure] = useState(true)
  const [resetPassword, { isLoading, data, error }] = useResetPasswordMutation()

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
    resetPassword({
      payload: { userInfo: userInfo, newPassword: pwdEncrypted },
    })
  }
  if (!userInfo || userInfo.length === 0) {
    return (
      <>
        <div
          className={'modal fade show'}
          style={{
            display: 'block',
          }}
          id='modal-large'
          role='dialog'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-body text-center'>
                <p>
                  <b>
                    <Translation tid='Error' />
                  </b>
                </p>
                <a href='/login'>
                  <Translation tid='BackTo' />
                  &nbsp;
                  <Translation tid='Login' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } else if (data && data.resultCode == ResultCode.Success) {
    return (
      <>
        <div
          className={'modal fade show'}
          style={{
            display: 'block',
          }}
          id='modal-large'
          role='dialog'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>
                  <Translation tid='ResetPassword' />
                </h5>
              </div>
              <div className='modal-body text-center'>
                <Translation tid='ResetPasswordSuccessMsg' />
                <hr className='w-30' />
                <a href='/login'>
                  <Translation tid='BackTo' />
                  &nbsp;
                  <Translation tid='Login' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        {isLoading && (
          <>
            <PageLoading />
          </>
        )}

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
                    style={{ display: errors.password ? 'none' : 'block' }}
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
                  <Translation tid='Confirm' />
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {data && data.resultCode == ResultCode.Expired.valueOf() && (
          <>
            <div className='alert alert-danger' role='alert'>
              <Translation tid='ResetPasswordExpiredMsg' />
            </div>
          </>
        )}
        {data && data.resultCode == ResultCode.NotExistUser.valueOf() && (
          <>
            <div className='alert alert-danger' role='alert'>
              <Translation tid='NotExistUserMsg' />
            </div>
          </>
        )}
        {data && data.resultCode == ResultCode.Error.valueOf() && (
          <>
            <div className='alert alert-danger' role='alert'>
              <Translation tid='ErrorMsg' />
            </div>
          </>
        )}
      </>
    )
  }
}

export default ResetPasswordForm
