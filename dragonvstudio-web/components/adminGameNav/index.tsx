'use client'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { v4 } from 'uuid'
import { useAppContext } from '../../contexts/appContext'
import { dictionaryList } from '../../locales'
import { ENTranslation, Translation, VNTranslation } from '../translation'
import * as Yup from 'yup'
import * as uuid from 'uuid'
import { AppSetting } from '../../types/type'
import { ResultCode } from '../../utils/enums'
import LoginModal from '../loginModal'
import { useEffect, useRef, useState } from 'react'
import {
  useGetEventBookingAvaiableDateQuery,
  useAddEditPrivateTalkMutation,
} from '../../services/event'
import calcTime from '../../utils/time'
import dateFormat from 'dateformat'
import showConfirmModal from '../modal'
import showDialogModal from '../modal/showModal'
import { NIL as NIL_UUID } from 'uuid'
import PageLoading from '../pageLoading'
import { useSession } from 'next-auth/react'
import { UpdateProfileRequest } from '@/services/communication/request/updateProfileRequest'
import { GlobalKeys } from '@/utils/constants'
import {
  useUserUpdateAvatarMutation,
  useUserUpdateProfileMutation,
} from '@/services/account'
import { useUploadImageMutation } from '@/services/fileService'
import { User } from '@/services/models/user'
import { toast } from 'react-toastify'
import { logout } from '@/utils/functions'
import { useParams, usePathname } from 'next/navigation'

let appSetting: AppSetting = require('../../appSetting.json')
const AdminGameNav: React.FC = () => {
  const { locale } = useAppContext()
  const { data: session, status } = useSession()
  const pathName = usePathname()
  const currentUser = session?.user
  const [currentAvatar, setcurrentAvatar] = useState<string>(
    currentUser?.image ?? GlobalKeys.NoAvatarUrl
  )
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
              <div className='d-none d-lg-block text-center mb-5'>
                <div className='avatar avatar-xxl avatar-circle mb-3'>
                  <img
                    className='avatar-img'
                    src={session?.user.avatar!}
                    alt='avatar'
                  />
                </div>

                <h4 className='card-title mb-0'>{session?.user.name}</h4>
              </div>

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
                    <i className='bi bi-people-fill nav-icon'></i>
                    <VNTranslation>Người chơi</VNTranslation>
                    <ENTranslation>Player</ENTranslation>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminGameNav
