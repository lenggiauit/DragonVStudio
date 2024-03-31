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
import { useAddEditGameItemMutation } from '@/services/mountAndBladeGameService'
import { useUploadImageMutation } from '@/services/fileService'
import { GlobalKeys } from '@/utils/constants'
import { v4, NIL } from 'uuid'

const appSetting: AppSetting = require('../../../appSetting.json')

type Props = {
  isShow: boolean
  currentItem?: GameItem | null
  onSubmit: (isSuccess: boolean) => void
  onClose: () => void
}

export type GameItemFormValues = {
  id: any
  name: any
  code: any
  class: any
  type: any
  description: any
  images: any
  stock: any
  price: any
  isActive: boolean
  isFavorite: boolean
}

const AddEditGameItemModal: React.FC<Props> = ({
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
    class: currentItem == null ? '' : currentItem?.class,
    type: currentItem == null ? '' : currentItem?.type,
    description: currentItem == null ? '' : currentItem?.description,
    images: currentItem == null ? '' : currentItem?.images,
    stock: currentItem == null ? 0 : currentItem?.stock,
    price: currentItem == null ? 0 : currentItem?.price,
    isActive: currentItem == null ? false : currentItem?.isActive,
    isFavorite: currentItem == null ? false : currentItem?.isFavorite,
  }

  //
  const [selectedPunishmentTime, setSelectedPunishmentTime] =
    useState<Dayjs | null>()

  //
  const [AddEditGameItem, AddEditGameItemStatus] = useAddEditGameItemMutation()
  const [currentImage, setcurrentImage] = useState<string>(
    currentItem != null ? currentItem?.images : GlobalKeys.NoImageUrl
  )

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required(dictionaryList[locale]['RequiredField']),
      code: Yup.string().required(dictionaryList[locale]['RequiredField']),
      class: Yup.string().required(dictionaryList[locale]['RequiredField']),
      type: Yup.string().required(dictionaryList[locale]['RequiredField']),
      description: Yup.string().required(
        dictionaryList[locale]['RequiredField']
      ),
      stock: Yup.number().required(dictionaryList[locale]['RequiredField']),
      price: Yup.number().required(dictionaryList[locale]['RequiredField']),
    })
  }
  const handleOnSubmit = (
    values: GameItemFormValues,
    actions: FormikHelpers<GameItemFormValues>
  ) => {
    AddEditGameItem({
      payload: {
        id: values.id,
        name: values.name,
        code: values.code,
        class: values.class,
        type: values.type,
        description: values.description,
        images: currentImage,
        stock: values.stock,
        price: values.price,
        isFavorite: values.isFavorite,
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
      AddEditGameItemStatus.data &&
      AddEditGameItemStatus.data.resultCode == ResultCode.Success
    ) {
      //setcurrentImage('')
      onSubmit(true)
    } else if (
      AddEditGameItemStatus.isError ||
      AddEditGameItemStatus.data?.resultCode == ResultCode.Error ||
      AddEditGameItemStatus.data?.resultCode == ResultCode.Invalid ||
      AddEditGameItemStatus.data?.resultCode == ResultCode.Unknown ||
      AddEditGameItemStatus.data?.resultCode == ResultCode.UnAuthorized
    ) {
      //setcurrentImage('')
      onSubmit(false)
    }
  }, [AddEditGameItemStatus])

  const inputFileUploadRef = useRef<HTMLInputElement>(null)
  const [uploadFile, uploadData] = useUploadImageMutation()
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
    if (uploadData.data && uploadData.data.resultCode == ResultCode.Success) {
      setcurrentImage(uploadData.data.resource.url)
    }
  }, [uploadData.data])

  return (
    <>
      {AddEditGameItemStatus.isLoading && <PageLoading />}
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
                {currentItem?.class}
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
                {({ values, setFieldValue, errors, touched }) => (
                  <Form
                    autoComplete={'off'}
                    className={
                      touched.name ||
                      touched.class ||
                      touched.code ||
                      touched.description ||
                      touched.images ||
                      touched.price ||
                      touched.stock ||
                      touched.type
                        ? 'was-validated'
                        : ''
                    }
                  >
                    <div className='form-group text-center'>
                      <img
                        src={currentImage}
                        className='avatar rounded-circle'
                      />
                      <br />
                      <a href='#' onClick={handleUploadFile}>
                        Edit Image
                      </a>
                      <ErrorMessage
                        name='images'
                        component='span'
                        className='invalid-feedback'
                      />
                      <div className='hide' style={{ display: 'none' }}>
                        <input
                          type='file'
                          className='hide'
                          ref={inputFileUploadRef}
                          onChange={handleSelectFile}
                        />
                      </div>
                    </div>
                    <div className='form-group mt-2'>
                      <input type='hidden' name='id' value={currentItem?.id} />
                      <Field
                        type='text'
                        className='form-control'
                        name='name'
                        placeholder='name'
                        required
                      />
                      <ErrorMessage
                        name='name'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <Field
                        type='text'
                        className='form-control'
                        name='code'
                        placeholder='code | item id'
                        required
                      />
                      <ErrorMessage
                        name='code'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <select
                        className='form-select'
                        name='class'
                        value={values.class || ''}
                        required
                        onChange={(e) => {
                          setFieldValue('class', e.target.value)
                        }}
                      >
                        <option key='' value=''></option>
                        <option key='All' value='All'>
                          All
                        </option>
                        <option key='pe_sergeant' value='pe_sergeant'>
                          Sergeant
                        </option>
                        <option key='pe_manatarms' value='pe_manatarms'>
                          Man At Arms
                        </option>
                        <option key='pe_lancer' value='pe_lancer'>
                          Lancer
                        </option>
                        <option
                          key='pe_militia_cavalry'
                          value='pe_militia_cavalry'
                        >
                          Militia Cavalry
                        </option>
                        <option key='pe_militia' value='pe_militia'>
                          Militia
                        </option>
                        <option key='pe_master_archer' value='pe_master_archer'>
                          Master Archer
                        </option>
                        <option key='pe_archer' value='pe_archer'>
                          Archer
                        </option>
                        <option
                          key='pe_master_crossbowman'
                          value='pe_master_crossbowman'
                        >
                          Master Crossbowman
                        </option>
                        <option key='pe_crossbowman' value='pe_crossbowman'>
                          Crossbowman
                        </option>
                      </select>

                      <ErrorMessage
                        name='class'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <select
                        className='form-select'
                        name='type'
                        required
                        value={values.type || ''}
                        onChange={(e) => {
                          setFieldValue('type', e.target.value)
                        }}
                      >
                        <option key='' value=''></option>
                        <option key='Armor_Head' value='Armor_Head'>
                          Armor Head
                        </option>
                        <option key='Armor_Body' value='Armor_Body'>
                          Armor Body
                        </option>
                        <option key='Armor_Leg' value='Armor_Leg'>
                          Armor Leg
                        </option>
                        <option key='Armor_Gloves' value='Armor_Gloves'>
                          Armor Gloves
                        </option>
                        <option key='Armor_Cape' value='Armor_Cape'>
                          Armor_Cape
                        </option>
                        <option key='Equipment_0' value='Equipment_0'>
                          Equipment_0 Weapon
                        </option>
                        <option key='Equipment_1' value='Equipment_1'>
                          Equipment_1 Shield
                        </option>
                        <option key='Equipment_2' value='Equipment_2'>
                          Equipment_2 Weapon
                        </option>
                        <option key='Equipment_3' value='Equipment_3'>
                          Equipment_3 Shield
                        </option>
                        <option key='horse' value='Horse'>
                          Horse
                        </option>
                      </select>

                      <ErrorMessage
                        name='class'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>

                    <div className='form-group mt-2'>
                      <Field
                        type='textarea'
                        as='textarea'
                        className='form-control'
                        name='description'
                        placeholder='Description'
                        required
                      />
                      <ErrorMessage
                        name='description'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='form-group mt-2'>
                      <Field
                        type='number'
                        className='form-control'
                        name='stock'
                        placeholder='stock'
                        required
                      />

                      <ErrorMessage
                        name='stock'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='form-group mt-2'>
                      <Field
                        type='number'
                        className='form-control'
                        name='price'
                        placeholder='price'
                        required
                      />
                      <ErrorMessage
                        name='price'
                        component='span'
                        className='invalid-feedback'
                      />
                    </div>
                    <div className='form-group mt-2'>
                      <div className='row'>
                        <div className='col-md-6'>
                          <input
                            type='checkbox'
                            className='form-check-input'
                            name='isActive'
                            value={values.isActive ? 'on' : 'off'}
                            id='isActive'
                            onChange={(e) => {
                              setFieldValue(
                                'isActive',
                                e.target.value == 'on' ? true : false
                              )
                            }}
                          />
                          <label
                            className='form-check-label ms-2'
                            htmlFor='isActive'
                          >
                            Is Active
                          </label>
                        </div>
                        <div className='col-md-6'>
                          <input
                            type='checkbox'
                            className='form-check-input'
                            name='isFavorite'
                            value={values.isFavorite ? 'on' : 'off'}
                            id='isFavorite'
                            onChange={(e) => {
                              setFieldValue(
                                'isFavorite',
                                e.target.value == 'on' ? true : false
                              )
                            }}
                          />
                          <label
                            className='form-check-label ms-2'
                            htmlFor='isFavorite'
                          >
                            Is Favorite
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className='form-group mt-2 text-end'>
                      <button
                        className='btn btn-block btn-primary'
                        type='submit'
                        disabled={AddEditGameItemStatus.isLoading}
                      >
                        {currentItem == null ? 'Add' : 'Edit'}
                      </button>
                      <button
                        className='btn btn-block btn-secondary ms-2'
                        type='button'
                        onClick={() => onCloseHandler()}
                        disabled={AddEditGameItemStatus.isLoading}
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

export default AddEditGameItemModal
