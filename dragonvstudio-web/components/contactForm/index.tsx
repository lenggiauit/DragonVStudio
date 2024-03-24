'use client'
import React from 'react'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import { useEffect } from 'react'
import { useAppContext } from '../../contexts/appContext'
import { useSendContactMutation } from '../../services/home'
import { ResultCode } from '../../utils/enums'
import showDialogModal from '../modal/showModal'
import PageLoading from '../pageLoading'
import { Form, Field, Formik, FormikHelpers, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { dictionaryList } from '../../locales'

type FormValues = {
  yourName: string
  yourEmail: string
  yourMessage: string
}

export const ContactForm: React.FC = () => {
  const { locale } = useAppContext()

  const [sendContact, sendContactStatus] = useSendContactMutation()

  let initialValues: FormValues = {
    yourName: '',
    yourEmail: '',
    yourMessage: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      yourName: Yup.string().required(dictionaryList[locale]['RequiredField']),
      yourEmail: Yup.string()
        .email()
        .required(dictionaryList[locale]['RequiredField'])
        .max(150),
      yourMessage: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
    })
  }

  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    sendContact({
      payload: {
        yourName: values.yourName,
        yourEmail: values.yourEmail,
        yourMessage: values.yourMessage,
      },
    })
    actions.resetForm()
  }

  useEffect(() => {
    if (
      sendContactStatus.data &&
      sendContactStatus.data.resultCode == ResultCode.Success
    ) {
      showDialogModal({
        message: (
          <>
            <ENTranslation>
              Your information has been sent successfully, Dragon V Studio will
              contact you with you as soon as possible!
            </ENTranslation>
            <VNTranslation>
              Thông tin của bạn đã được gửi thành công, Dragon V Studio sẽ liên
              hệ với bạn sớm nhất có thể!
            </VNTranslation>
          </>
        ),

        onClose: () => {},
      })
    }
  }, [sendContactStatus])

  return (
    <>
      {sendContactStatus.isLoading && <PageLoading />}

      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form
            autoComplete='off'
            className={
              touched.yourName ||
              touched.yourName ||
              touched.yourEmail ||
              touched.yourMessage
                ? 'was-validated'
                : ''
            }
          >
            <div className='row gx-3'>
              <div className='mb-3'>
                <label className='form-label'>
                  <ENTranslation>Your name</ENTranslation>
                  <VNTranslation>Tên bạn</VNTranslation>
                </label>
                <Field
                  type='text'
                  className={`form-control form-control-lg ${
                    errors.yourName ? 'is-invalid' : ''
                  }`}
                  name='yourName'
                  required
                />
                <ErrorMessage
                  name='yourName'
                  component='span'
                  className='invalid-feedback'
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>
                  <ENTranslation>Your email</ENTranslation>
                  <VNTranslation>Email của bạn</VNTranslation>
                </label>
                <Field
                  type='text'
                  className={`form-control form-control-lg ${
                    errors.yourEmail ? 'is-invalid' : ''
                  }`}
                  name='yourEmail'
                  required
                />
                <ErrorMessage
                  name='yourEmail'
                  component='span'
                  className='invalid-feedback'
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>
                  <ENTranslation>Your message</ENTranslation>
                  <VNTranslation>Nội dung</VNTranslation>
                </label>
                <Field
                  type='textarea'
                  as='textarea'
                  rows={4}
                  className={`form-control form-control-lg ${
                    errors.yourMessage ? 'is-invalid' : ''
                  }`}
                  name='yourMessage'
                  required
                />
                <ErrorMessage
                  name='yourMessage'
                  component='span'
                  className='invalid-feedback'
                />
              </div>
              <div className='d-grid'>
                <button type='submit' className='btn btn-primary btn-lg'>
                  <Translation tid='btnSubmit'></Translation>
                </button>
              </div>

              <div className='text-center'>
                <p className='form-text'>
                  <ENTranslation>
                    We'll get back to you in 1-2 business days.
                  </ENTranslation>
                  <VNTranslation>
                    Chúng tôi sẽ liên hệ lại với bạn sau 1-2 ngày làm việc.
                  </VNTranslation>
                </p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
