'use client'
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useFormik,
  useFormikContext,
} from 'formik'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../../../contexts/appContext'
import { Translation } from '../../../translation'
import * as Yup from 'yup'
import { dictionaryList } from '../../../../locales'
import { AppSetting } from '../../../../types/type'
import { ResultCode } from '../../../../utils/enums'
import PageLoading from '../../../pageLoading'
import { Category } from '../../../../services/models/admin/category'
import * as uuid from 'uuid'
import { useCreateEditCategoryMutation } from '../../../../services/admin'
//@ts-ignore
import { SliderPicker } from 'react-color'
import { getLoggedUser } from '../../../../utils/functions'

let appSetting: AppSetting = require('../../../../appSetting.json')

interface FormValues {
  id: string
  name: string
  color: string
  description: string
  isArchived: boolean
}

type Props = {
  dataModel?: Category
  onClose: (dataModel?: Category) => void
}

const AddEditCategoryModal: React.FC<Props> = ({ dataModel, onClose }) => {
  const { locale } = useAppContext()
  const formikProps = useFormikContext()
  const [category, setCategory] = useState<Category | undefined>(dataModel)
  const [createEditCategory, createEditCategoryStatus] =
    useCreateEditCategoryMutation()
  const [isArchived, setIsArchived] = useState<boolean>(
    dataModel != null ? dataModel.isArchived : false
  )
  const [color, setColor] = useState<string>(
    dataModel != null ? dataModel.color : '#fffff1'
  )
  const onCancelHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    onClose()
  }

  const onCloseHandler: any = () => {
    onClose()
  }

  let initialValues: FormValues = {
    id: dataModel == null ? uuid.NIL : dataModel.id,
    name: dataModel != null ? dataModel?.name : '',
    description: dataModel != null ? dataModel?.description : '',
    color: color,
    isArchived: dataModel != null ? dataModel.isArchived : false,
  }

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string()
        .required(dictionaryList[locale]['RequiredField'])
        .test(
          'CategoryNameAlreadyExisted',
          dictionaryList[locale]['CategoryNameAlreadyExisted'],
          (name) => {
            if (name) {
              return new Promise((resolve, reject) => {
                const currentUser = getLoggedUser()
                const headers: HeadersInit = {
                  'Content-Type': 'application/json',
                  'X-Request-Id': uuid.v4().toString(),
                  Authorization: `Bearer ${currentUser?.accessToken}`,
                }
                const opts: RequestInit = {
                  method: 'GET',
                  headers,
                }
                fetch(
                  appSetting.APIUrl +
                    `admin/CheckCategoryName?name=${name}` +
                    (dataModel != null ? `&categoryid=${dataModel.id}` : ''),
                  opts
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
      description: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
    })
  }
  const handleOnSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    createEditCategory({
      payload: {
        id: values.id,
        name: values.name,
        color: color,
        description: values.description,
        isArchived: isArchived,
      },
    })
  }

  useEffect(() => {
    if (
      createEditCategoryStatus.isSuccess &&
      createEditCategoryStatus.data.resultCode == ResultCode.Success
    ) {
      onClose(createEditCategoryStatus.data.resource)
    }
  }, [createEditCategoryStatus])

  const handleArchivedClick: React.MouseEventHandler<HTMLLabelElement> = (
    e
  ) => {
    setIsArchived(!isArchived)
  }
  const handleChangeComplete = (color: { hex: string }) => {
    setColor(color.hex)
  }

  //
  return (
    <>
      {createEditCategoryStatus.isLoading && <PageLoading />}
      <div
        className='modal fade show'
        role='dialog'
        aria-labelledby='addEditCategoryModalLabel'
        aria-modal='true'
      >
        <div className='modal-dialog modal-lg' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='addEditCategoryModalLabel'>
                {!dataModel && <Translation tid='CreateNewCategory' />}
                {dataModel && <Translation tid='EditCategory' />}
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={onCloseHandler}
              >
                <span aria-hidden='true'>×</span>
              </button>
            </div>
            <div className='modal-body pb-0 pt-5'>
              <Formik
                initialValues={initialValues}
                onSubmit={handleOnSubmit}
                validationSchema={validationSchema}
                validateOnChange={false}
              >
                {({ values, errors, touched }) => (
                  <Form autoComplete='off'>
                    <div className='form-group'>
                      <Field type='hidden' name='id' />
                      <Field
                        type='text'
                        className='form-control'
                        name='name'
                        placeholder='name'
                      />
                      <ErrorMessage
                        name='name'
                        component='div'
                        className='alert alert-field alert-danger'
                      />
                    </div>

                    <div className='form-group'>
                      <Field
                        type='textarea'
                        as='textarea'
                        row={7}
                        className='form-control'
                        name='description'
                        placeholder='description'
                      />
                      <ErrorMessage
                        name='description'
                        component='div'
                        className='alert alert-field alert-danger'
                      />
                    </div>
                    <div className='form-group'>
                      <SliderPicker
                        color={color}
                        onChangeComplete={handleChangeComplete}
                      />
                      <ErrorMessage
                        name='color'
                        component='div'
                        className='alert alert-field alert-danger'
                      />
                    </div>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <Field
                          type='checkbox'
                          className='custom-control-input'
                          name='isArchived'
                          checked={isArchived}
                        />
                        <label
                          className='custom-control-label'
                          onClick={handleArchivedClick}
                        >
                          <Translation tid='archived' />
                        </label>
                      </div>
                    </div>
                    <div className='modal-footer border-0 pr-0 pl-0'>
                      <button
                        type='button'
                        className='btn btn-secondary'
                        onClick={onCancelHandler}
                        data-dismiss='modal'
                      >
                        <Translation tid='btnClose' />
                      </button>
                      <button type='submit' className='btn btn-primary'>
                        {dataModel && <Translation tid='btnSave' />}
                        {!dataModel && <Translation tid='btnCreate' />}
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

export default AddEditCategoryModal
