'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import { Translation } from '../translation'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { dictionaryList } from '../../locales'
import { useAppContext } from '../../contexts/appContext'
import { ResultCode } from '../../utils/enums'
import showDialogModal from '../modal/showModal'
import PageLoading from '../pageLoading'
import { Rating } from 'react-simple-star-rating'
import { useSendFeedbackMutation } from '../../services/account'
import { AppSetting } from '../../types/type'
const appSetting: AppSetting = require('../../appSetting.json')

type FormValues = {
  rating: number
  yourFeedback: string
}

const tooltipArray = [
  'Terrible',
  'Terrible+',
  'Bad',
  'Bad+',
  'Average',
  'Average+',
  'Great',
  'Great+',
  'Awesome',
  'Awesome+',
]
const fillColorArray = [
  '#f17a45',
  '#f17a45',
  '#f19745',
  '#f19745',
  '#f1a545',
  '#f1a545',
  '#f1b345',
  '#f1b345',
  '#f1d045',
  '#f1d045',
]

export const FeedbackForm: React.FC = () => {
  const { locale } = useAppContext()

  const [sendFeedback, sendFeedbackStatus] = useSendFeedbackMutation()

  let initialValues: FormValues = {
    rating: 0,
    yourFeedback: '',
  }

  const validationSchema = () => {
    return Yup.object().shape({
      rating: Yup.number()
        .required(dictionaryList[locale]['RequiredField'])
        .min(0.5, dictionaryList[locale]['RequiredField'])
        .max(5, dictionaryList[locale]['RequiredField']),
      yourFeedback: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
    })
  }

  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    sendFeedback({
      payload: { rating: values.rating, yourFeedback: values.yourFeedback },
    })
    actions.resetForm()
  }

  useEffect(() => {
    if (
      sendFeedbackStatus.data &&
      sendFeedbackStatus.data.resultCode == ResultCode.Success
    ) {
      showDialogModal({
        message: 'Cảm ơn bạn đã feedback cho Dragon V Studio!',
        onClose: () => {
          window.location.href = appSetting.SiteUrl
        },
      })
    } else if (
      sendFeedbackStatus.data &&
      sendFeedbackStatus.data.resultCode == ResultCode.Invalid
    ) {
      showDialogModal({
        message: 'Lỗi, bạn đã feedback rồi!',
        onClose: () => {
          window.location.href = appSetting.SiteUrl
        },
      })
    }
  }, [sendFeedbackStatus])

  return (
    <>
      {sendFeedbackStatus.isLoading && <PageLoading />}
      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form autoComplete='off'>
            <div className='form-row pl-8 pr-8'>
              <div className='form-group col-md-12'>
                Mức độ hài lòng:
                <Rating
                  onClick={(v) => {
                    setFieldValue('rating', v)
                  }}
                  size={50}
                  transition
                  allowFraction
                  showTooltip
                  tooltipArray={tooltipArray}
                  fillColorArray={fillColorArray}
                />
                <ErrorMessage
                  name='rating'
                  component='div'
                  className='alert alert-field alert-danger'
                />
              </div>
              <div className='form-group col-md-12'>
                <Field
                  type='textarea'
                  as='textarea'
                  style={{ height: 150 }}
                  maxLength={500}
                  className='form-control'
                  name='yourFeedback'
                  placeholder='Nhận xét của bạn'
                />
                <ErrorMessage
                  name='yourFeedback'
                  component='div'
                  className='alert alert-field alert-danger'
                />
              </div>
              <div className='form-group col-md-12'>
                <i className='small-text'>
                  *Lời nhận xét và tên của bạn có thể hiển thị công khai trên
                  trang Dragon V Studio nhé!
                </i>
              </div>
              <div className='col-12 text-center'>
                <button
                  className='btn btn-lg btn-primary '
                  style={{ width: 250 }}
                  type='submit'
                >
                  <Translation tid='btnSubmit'></Translation>
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
