'use client'
import React, { ReactElement } from 'react'
import { Translation } from '../../components/translation'
import { Form, Field, Formik, FormikHelpers, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { useForgotPasswordMutation } from '../../services/account'

import PageLoading from '../../components/pageLoading'
import { ResultCode } from '../../utils/enums'

interface FormValues {
  email: string
}

const ForgotPasswordForm: React.FC = (): ReactElement => {
  const { locale } = useAppContext()

  const [forgotPassword, { isLoading, data, error }] =
    useForgotPasswordMutation()

  let initialValues: FormValues = { email: '' }

  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .email('Email is invalid!'),
    })
  }
  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    forgotPassword({ payload: { email: values.email } })
  }
  if (data && data.resultCode == ResultCode.Success) {
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
                  <Translation tid='ForgotPassword' />
                </h5>
              </div>
              <div className='modal-body'>
                <Translation tid='ForgotpasswordSubmitedSuccessMsg' />
                <hr className='w-30' />
                <p className='text-center text-muted small-2'>
                  <Translation tid='BackTo' />
                  &nbsp;
                  <a href='/login'>
                    <Translation tid='Login' />
                  </a>
                </p>
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
            <Form className={touched.email ? 'was-validated' : ''}>
              <div className='mb-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <label className='form-label'>Your email</label>
                  <a className='form-label-link' href='/login'>
                    <i className='bi-chevron-left small ms-1'></i>
                    <Translation tid='BackTo' />
                    &nbsp;
                    <Translation tid='Login' />
                  </a>
                </div>
                <Field
                  type='email'
                  className='form-control form-control-lg'
                  name='email'
                  placeholder='Enter your email address'
                  aria-label='Enter your email address'
                  required
                />
                <ErrorMessage
                  name='email'
                  component='span'
                  className='invalid-feedback'
                />
              </div>

              <div className='d-grid mb-3'>
                <button
                  className='btn btn-block btn-primary'
                  type='submit'
                  disabled={isLoading}
                >
                  <Translation tid='Confirm' />
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {data && data.resultCode == ResultCode.NotExistEmail.valueOf() && (
          <>
            <div className='alert alert-danger' role='alert'>
              <Translation tid='NotExistEmail' />
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

export default ForgotPasswordForm
