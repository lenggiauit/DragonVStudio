'use client'
import { ReactElement, useEffect, useState } from 'react'
import { ENTranslation, VNTranslation } from '../../translation'
import { useParams } from 'next/navigation'
import { useGetGameInforMutation } from '@/services/mountAndBladeGameService'
import { GameServer } from '@/services/models/adminGame/gameServerStatus'
import PageLoading from '@/components/pageLoading'
import { ResultCode } from '@/utils/enums'
const AdminGameInfo: React.FC = (): ReactElement => {
  const { gameUrl } = useParams()

  const [getGameInfor, getGameInforStatus] = useGetGameInforMutation()

  useEffect(() => {
    getGameInfor({
      payload: {},
      gameUrl: gameUrl,
    })
  }, [])

  return (
    <>
      {getGameInforStatus.isLoading && <PageLoading />}
      <div className='d-grid gap-3 gap-lg-5 bg-white-text-dark position-relative'>
        <div className='card'>
          <div className='card-header border-bottom'>
            <h4 className='card-header-title text-dark'>
              {getGameInforStatus.data &&
                getGameInforStatus.data.resultCode == ResultCode.Success && (
                  <>Game Info: {getGameInforStatus.data?.resource?.name} </>
                )}
            </h4>
          </div>
          <div className='card-body'>
            <table className='table w-100'>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{getGameInforStatus.data?.resource?.name} </td>
                </tr>
                <tr>
                  <th>Season</th>
                  <td>{getGameInforStatus.data?.resource?.season}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGameInfo
