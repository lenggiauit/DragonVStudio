'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import { Translation } from '../../components/translation'
import { Form, Field, Formik, FormikHelpers, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { dictionaryList } from '../../locales'
import { AppSetting } from '../../types/type'
import { Md5 } from 'md5-typescript'
import PageLoading from '../../components/pageLoading'
import { signIn } from 'next-auth/react'
import { AnimationLogo } from '../../components/animationLogo'
import { useAppContext } from '@/contexts/appContext'

let appSetting: AppSetting = require('../../appSetting.json')

interface FormValues {
  email: string
  password: string
}

const LoginForm: React.FC = (): ReactElement => {
  const { locale } = useAppContext()
  let initialValues: FormValues = { email: '', password: '' }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPasswordSecure, setIsPasswordSecure] = useState(true)

  const validationSchema = () => {
    return Yup.object().shape({
      email: Yup.string().required(dictionaryList[locale]['RequiredField']),
      password: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .test(
          'len',
          dictionaryList[locale]['PasswordsLengthRule'],
          (val) => val.length >= 8
        ),
    })
  }
  const handleOnSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    let pwd = Md5.init(values.password)
    setIsLoading(true)
    const result = await signIn('credentials', {
      email: values.email,
      password: pwd,
    })
  }
  const loginWithDiscord = async () => {
    setIsLoading(true)
    const result = await signIn('discord')
  }

  return (
    <>
      {isLoading && <PageLoading />}

      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched }) => (
          <Form
            className={touched.email || touched.password ? 'was-validated' : ''}
          >
            <div className='mb-4'>
              <label className='form-label'>User name or email</label>
              <Field
                type='text'
                className='form-control form-control-lg'
                name='email'
                placeholder='name@example.com'
                aria-label='name@example.com'
                required
              />
              <ErrorMessage
                name='email'
                component='span'
                className='invalid-feedback'
              />
            </div>

            <div className='mb-4'>
              <div className='d-flex justify-content-between align-items-center'>
                <label className='form-label'>Password</label>
                <a className='form-label-link' href='/forgotPassword'>
                  <Translation tid='ForgotPassword' />
                </a>
              </div>

              <div
                className={`input-group input-group-merge ${
                  errors.password ? 'is-invalid' : ''
                }`}
                // data-hs-validation-validate-className=''
              >
                <Field
                  type={isPasswordSecure ? 'password' : 'text'}
                  className='form-control form-control-lg'
                  name='password'
                  id='password'
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

            <div className='d-grid mb-3'>
              <button type='submit' className='btn btn-primary btn-lg'>
                <Translation tid='Login' />
              </button>
            </div>

            <div className='d-grid mb-3'>
              <p className='mb-3'>
                <Translation tid='OrLoginWith' />
              </p>
              <div className='d-flex gap-2 gap-sm-3 justify-content-center'>
                <a
                  onClick={() => loginWithDiscord()}
                  className='btn btn-lg border-primary p-3 lh-1'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 48 48'
                    width='48px'
                    height='48px'
                  >
                    <path
                      fill='#536dfe'
                      d='M39.248,10.177c-2.804-1.287-5.812-2.235-8.956-2.778c-0.057-0.01-0.114,0.016-0.144,0.068	c-0.387,0.688-0.815,1.585-1.115,2.291c-3.382-0.506-6.747-0.506-10.059,0c-0.3-0.721-0.744-1.603-1.133-2.291	c-0.03-0.051-0.087-0.077-0.144-0.068c-3.143,0.541-6.15,1.489-8.956,2.778c-0.024,0.01-0.045,0.028-0.059,0.051	c-5.704,8.522-7.267,16.835-6.5,25.044c0.003,0.04,0.026,0.079,0.057,0.103c3.763,2.764,7.409,4.442,10.987,5.554	c0.057,0.017,0.118-0.003,0.154-0.051c0.846-1.156,1.601-2.374,2.248-3.656c0.038-0.075,0.002-0.164-0.076-0.194	c-1.197-0.454-2.336-1.007-3.432-1.636c-0.087-0.051-0.094-0.175-0.014-0.234c0.231-0.173,0.461-0.353,0.682-0.534	c0.04-0.033,0.095-0.04,0.142-0.019c7.201,3.288,14.997,3.288,22.113,0c0.047-0.023,0.102-0.016,0.144,0.017	c0.22,0.182,0.451,0.363,0.683,0.536c0.08,0.059,0.075,0.183-0.012,0.234c-1.096,0.641-2.236,1.182-3.434,1.634	c-0.078,0.03-0.113,0.12-0.075,0.196c0.661,1.28,1.415,2.498,2.246,3.654c0.035,0.049,0.097,0.07,0.154,0.052	c3.595-1.112,7.241-2.79,11.004-5.554c0.033-0.024,0.054-0.061,0.057-0.101c0.917-9.491-1.537-17.735-6.505-25.044	C39.293,10.205,39.272,10.187,39.248,10.177z M16.703,30.273c-2.168,0-3.954-1.99-3.954-4.435s1.752-4.435,3.954-4.435	c2.22,0,3.989,2.008,3.954,4.435C20.658,28.282,18.906,30.273,16.703,30.273z M31.324,30.273c-2.168,0-3.954-1.99-3.954-4.435	s1.752-4.435,3.954-4.435c2.22,0,3.989,2.008,3.954,4.435C35.278,28.282,33.544,30.273,31.324,30.273z'
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className='text-center'>
              <p>
                <Translation tid='DontHaveAnAccount' />
                &nbsp;
                <a className='link' href='/register'>
                  <Translation tid='RegisterHere' />
                </a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default LoginForm
