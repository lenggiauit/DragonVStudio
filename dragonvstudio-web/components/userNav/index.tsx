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
import { usePathname } from 'next/navigation'

let appSetting: AppSetting = require('../../appSetting.json')
const UserNav: React.FC = () => {
  const { locale } = useAppContext()
  const { data: session, status } = useSession()
  const pathName = usePathname()
  const currentUser = session?.user
  const [currentAvatar, setcurrentAvatar] = useState<string>(
    currentUser?.image ?? GlobalKeys.NoAvatarUrl
  )

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
                <p className='card-text small'>{session?.user.email}</p>
              </div>

              <span className='text-cap'>
                <VNTranslation>Tài khoản</VNTranslation>
                <ENTranslation>Account</ENTranslation>
              </span>

              <ul className='nav nav-sm nav-tabs nav-vertical mb-4'>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf('user/profile') != -1 ? 'active' : ''
                    }`}
                    href='/user/profile'
                  >
                    <i className='bi-person-badge nav-icon'></i>
                    <VNTranslation>Thông tin cá nhân</VNTranslation>
                    <ENTranslation> Personal info</ENTranslation>
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf('user/security') != -1 ? 'active' : ''
                    }`}
                    href='/user/security'
                  >
                    <i className='bi-shield-shaded nav-icon'></i>
                    <VNTranslation>Bảo mật</VNTranslation>
                    <ENTranslation>Security</ENTranslation>
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf('user/notifications') != -1
                        ? 'active'
                        : ''
                    }`}
                    href='/user/notifications'
                  >
                    <i className='bi-bell nav-icon'></i>
                    <VNTranslation>Thông báo</VNTranslation>
                    <ENTranslation>Notifications</ENTranslation>
                  </a>
                </li>
                <li className='nav-item'>
                  <a
                    className={`nav-link ${
                      pathName.indexOf('user/mount-blade-bannerlord') != -1
                        ? 'active'
                        : ''
                    }`}
                    href='/user/mount-blade-bannerlord'
                  >
                    <span className='rounded-circle border me-1'>
                      <img
                        style={{ width: 18 }}
                        src='/static/images/mount_blade_ii_bannerlord_icon.png'
                      />
                    </span>
                    <Translation tid='nav_mount_blade_bannerlord' />
                  </a>
                </li>

                <li className='nav-item'>
                  <a className='nav-link ' href='#' onClick={() => logout()}>
                    <i className='bi-box-arrow-right nav-icon'></i>
                    <VNTranslation>Đăng xuất</VNTranslation>
                    <ENTranslation>Logout</ENTranslation>
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

export default UserNav
