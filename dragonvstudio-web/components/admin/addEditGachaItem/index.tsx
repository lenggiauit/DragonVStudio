'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { AppSetting } from '@/types/type'
import { useAppContext } from '@/contexts/appContext'
import { ResultCode } from '@/utils/enums'
import { dictionaryList } from '@/locales'
import { useParams } from 'next/navigation'
import dayjs, { Dayjs } from 'dayjs'
import PageLoading from '@/components/pageLoading'
import { GameItem } from '@/services/models/adminGame/gameItem'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useAddEditGachaItemMutation } from '@/services/mountAndBladeGameService'
import { useUploadImageMutation } from '@/services/fileService'
import { GlobalKeys } from '@/utils/constants'
import { v4, NIL } from 'uuid'
import { GachaItem } from '@/services/models/adminGame/gachaItem'

const appSetting: AppSetting = require('../../../appSetting.json')

type Props = {
  isShow: boolean
  currentItem?: GachaItem | null
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type GameItemFormValues = {
  id: any
  name: any
  code: any
  quantity: any
  isActive: boolean
}

const AddEditGachaItemModal: React.FC<Props> = ({
  isShow,
  currentItem,
  onSubmit,
  onClose,
}) => {
  const { locale } = useAppContext()
  const { gameUrl } = useParams()

  let initialValues: GameItemFormValues = {
    id: currentItem == null ? NIL : currentItem?.id,
    name: currentItem == null ? '' : currentItem?.name,
    code: currentItem == null ? '' : currentItem?.code,
    quantity: currentItem == null ? '' : currentItem?.quantity,
    isActive: currentItem == null ? false : currentItem?.isActive,
  }

  //
  const [selectedPunishmentTime, setSelectedPunishmentTime] =
    useState<Dayjs | null>()

  //
  const [AddEditGachaItem, AddEditGachaItemStatus] =
    useAddEditGachaItemMutation()

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required(dictionaryList[locale]['RequiredField']),
      code: Yup.string().required(dictionaryList[locale]['RequiredField']),
      quantity: Yup.number().required(dictionaryList[locale]['RequiredField']),
    })
  }
  const handleOnSubmit = (
    values: GameItemFormValues,
    actions: FormikHelpers<GameItemFormValues>
  ) => {
    AddEditGachaItem({
      payload: {
        id: values.id,
        name: values.name,
        code: values.code,
        quantity: values.quantity,
        isActive: values.isActive,
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
      AddEditGachaItemStatus.data &&
      AddEditGachaItemStatus.data.resultCode == ResultCode.Success
    ) {
      onSubmit(true)
    } else if (
      AddEditGachaItemStatus.isError ||
      AddEditGachaItemStatus.data?.resultCode == ResultCode.Error ||
      AddEditGachaItemStatus.data?.resultCode == ResultCode.Invalid ||
      AddEditGachaItemStatus.data?.resultCode == ResultCode.Unknown ||
      AddEditGachaItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      onSubmit(false)
    }
  }, [AddEditGachaItemStatus])

  return (
    <>
      {AddEditGachaItemStatus.isLoading && <PageLoading />}
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
                {currentItem == null ? 'Add Item' : 'Edit Item'}
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
                enableReinitialize={true}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  setFieldValue,
                  getFieldHelpers,
                  errors,
                  touched,
                }) => (
                  <Form
                    autoComplete={'off'}
                    className={
                      touched.name || touched.code || touched.quantity
                        ? 'was-validated'
                        : ''
                    }
                  >
                    <div className='form-group  '>
                      <input type='hidden' name='id' value={currentItem?.id} />
                      <label className='form-label'>Name</label>
                      <Field
                        type='text'
                        className='form-control form-control-sm'
                        name='name'
                        required
                      />
                      <ErrorMessage
                        name='name'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <label className='form-label'>Item Id</label>
                      <Field
                        type='text'
                        className='form-control  form-control-sm'
                        name='code'
                        required
                      />
                      <ErrorMessage
                        name='code'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <label className='form-label'>Quantity</label>
                      <Field
                        type='number'
                        className='form-control  form-control-sm'
                        name='quantity'
                        required
                      />

                      <ErrorMessage
                        name='quantity'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <div className='row mb-1'>
                        <div className='col-md-4'>
                          <Field
                            type='checkbox'
                            className='form-check-input'
                            name='isActive'
                            id='isActive'
                          />
                          <label
                            className='form-check-label ms-2'
                            htmlFor='isActive'
                          >
                            Is Active
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={AddEditGachaItemStatus.isLoading}
                      >
                        {currentItem == null ? 'Add' : 'Edit'}
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={AddEditGachaItemStatus.isLoading}
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

export default AddEditGachaItemModal
