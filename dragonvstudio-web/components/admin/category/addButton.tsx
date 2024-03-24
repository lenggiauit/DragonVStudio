'use client'
import React, { useState } from 'react'
import { Category } from '../../../services/models/admin/category'
import AddEditCategoryModal from './modal/'

type Props = {
  onAdded: (category?: Category) => void
}
const AddCategoryButton: React.FC<Props> = ({ onAdded }) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false)
  const onAddNewHandler = (dataModel?: Category) => {
    setIsShowModal(false)
    onAdded(dataModel)
  }
  return (
    <>
      {isShowModal && <AddEditCategoryModal onClose={onAddNewHandler} />}
      <div className='col-6 col-lg-3'>
        <a
          className='card shadow-1 hover-shadow-6'
          href='#'
          onClick={(e) => {
            e.preventDefault()
            setIsShowModal(true)
          }}
          data-toggle='modal'
        >
          <div className='card-body project-container d-flex text-center justify-content-center '>
            <i className='bi bi-plus' style={{ fontSize: 42 }}></i>
          </div>
        </a>
      </div>
    </>
  )
}

export default AddCategoryButton
