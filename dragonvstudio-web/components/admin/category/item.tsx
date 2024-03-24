'use client'
import React from 'react'
import { Category } from '../../../services/models/admin/category'

type Props = {
  dataItem: Category
  onSelected: (dataItem: Category) => void
}

const CategoryItem: React.FC<Props> = ({ dataItem, onSelected }) => {
  return (
    <>
      <div className='col-6 col-lg-3'>
        <a
          className='card shadow-1 hover-shadow-6'
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onSelected(dataItem)
          }}
        >
          <div className='card-body template-type-item-container'>
            <h6 style={{ color: dataItem.color }} className='mb-0'>
              {dataItem.name}
            </h6>
            <div>
              <small className='small-4 ls-2'>
                {dataItem.description.length > 42
                  ? dataItem.description.substring(0, 42)
                  : dataItem.description}
              </small>
            </div>
          </div>
        </a>
      </div>
    </>
  )
}

export default CategoryItem
