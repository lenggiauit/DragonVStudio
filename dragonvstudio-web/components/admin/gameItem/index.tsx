'use client'
import { ReactElement } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
const AdminGameItems: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()
  return (
    <>
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <h4 className='card-header-title text-dark'>
              <VNTranslation>Items: {gameUrl}</VNTranslation>
              <ENTranslation>Items: {gameUrl}</ENTranslation>
            </h4>
          </div>
          <div className='card-body'></div>
        </div>
      </div>
    </>
  )
}

export default AdminGameItems
