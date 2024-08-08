'use client'
import { useAppContext } from '../../contexts/appContext'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import { AppSetting } from '../../types/type'
import { useState } from 'react'

import { useSession } from 'next-auth/react'
import { GlobalKeys } from '@/utils/constants'
import { useParams, usePathname } from 'next/navigation'

let appSetting: AppSetting = require('../../appSetting.json')
const AdminGameNav: React.FC = () => {
  const { locale } = useAppContext()
  const { data: session, status } = useSession()
  const pathName = usePathname()
  const { gameUrl } = useParams()

  return (
    <>
      <div className='navbar-expand-lg navbar-light'>
        <div
          id='sidebarNav'
          className='collapse navbar-collapse navbar-vertical'
        >
          <div className='card flex-grow-1 mb-5'>
            <div className='card-body'>
              <span className='text-cap'>
                <VNTranslation>Trò chơi</VNTranslation>
                <ENTranslation>Game</ENTranslation>
              </span>

              <ul className='nav nav-sm nav-tabs nav-vertical mb-4'>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.endsWith(`/admin/${gameUrl}`) ? 'active' : ''
                    }`}
                    href={`/admin/${gameUrl}`}
                  >
                    <i className='bi bi-info-circle nav-icon'></i>
                    <VNTranslation>Thông tin trò chơi</VNTranslation>
                    <ENTranslation> Game info</ENTranslation>
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/players`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/players`}
                  >
                    <i className='bi bi-people nav-icon'></i>
                    <VNTranslation>Người chơi</VNTranslation>
                    <ENTranslation>Player</ENTranslation>
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/bannedPlayers`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/bannedPlayers`}
                  >
                    <i className='bi bi-person-x nav-icon'></i>
                    Banned player
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/items`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/items`}
                  >
                    <i className='bi bi-list-stars nav-icon'></i>
                    <VNTranslation>Vật phẩm</VNTranslation>
                    <ENTranslation>Items</ENTranslation>
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/playerItems`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/playerItems`}
                  >
                    <i className='bi bi-bucket nav-icon'></i>
                    Player Items
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/personalProperty`) !=
                      -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/personalProperty`}
                  >
                    <i className='bi bi-house nav-icon'></i>
                    Personal Property
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/logs`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/logs`}
                  >
                    <i className='bi bi-list-stars nav-icon'></i>
                    <VNTranslation>Logs</VNTranslation>
                    <ENTranslation>Logs</ENTranslation>
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/battleEvent`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/battleEvent`}
                  >
                    <i className='bi bi-list-stars nav-icon'></i>
                    <VNTranslation>Sự kiện chiến tranh</VNTranslation>
                    <ENTranslation>Event Battle</ENTranslation>
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/gacha`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/gacha`}
                  >
                    <i className='bi bi-gift nav-icon'></i>
                    Gacha
                  </a>
                </li>

                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf(`/admin/${gameUrl}/gachaItems`) != -1
                        ? 'active'
                        : ''
                    }`}
                    href={`/admin/${gameUrl}/gachaItems`}
                  >
                    <i className='bi bi-gift nav-icon'></i>
                    Gacha Items
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGameNav
