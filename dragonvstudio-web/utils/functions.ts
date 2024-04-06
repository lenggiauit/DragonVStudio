'use client'
import { signOut, useSession } from 'next-auth/react'
import { AppSetting } from '../types/type'
import { decrypt, encrypt } from './crypter'
import { Cookies } from 'react-cookie'
import {
  GlobalKeys,
  MockInterviewEnumStatus,
  PrivateTalkEnumStatus,
} from './constants'
// import { User } from '../services/models/user'
import { Redirect } from 'react-router'
import React from 'react'
// import { useLocation } from 'react-router-dom'
import { useSearchParams } from 'next/navigation'
import { Session } from 'next-auth'

var cookies = new Cookies()

const bgColors = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
]

export function GetRandomBgColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

let appSetting: AppSetting = require('../appSetting.json')

export const setLoggedUser = (user: any) => {
  localStorage.setItem(GlobalKeys.LoggedUserKey, encrypt(user))
}

export const logout = async () => {
  await signOut()
}

export function paginationRange(
  size: number,
  startAt: number = 0
): ReadonlyArray<number> {
  return Array.from({ length: size }, (x, i) => i + startAt)
}

export function useQuery() {
  const searchParams = useSearchParams()
  return searchParams
}

export function checkIfFilesAreTooBig(files?: [File]): boolean {
  let valid = true
  if (files) {
    files.map((file) => {
      const size = file.size / 1024 / 1024
      if (size > 10) {
        valid = false
      }
    })
  }
  return valid
}

export function checkIfFilesAreCorrectType(files?: [File]): boolean {
  let valid = true
  if (files) {
    files.map((file) => {
      if (
        ![
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ].includes(file.type)
      ) {
        valid = false
      }
    })
  }
  return valid
}

export function getPrivateTalkEnumStatusName(value: string) {
  return Object.entries(PrivateTalkEnumStatus).find(
    ([key, val]) => key === value
  )?.[1]
}
export function getMockInterviewEnumStatusName(value: string) {
  return Object.entries(MockInterviewEnumStatus).find(
    ([key, val]) => key === value
  )?.[1]
}

export function hasPermission(session: Session, per: string) {
  if (session?.user != null) {
    return (
      session?.user.permissions.filter(
        (p) => p.code.toLocaleUpperCase() === per.toLocaleUpperCase()
      ).length > 0
    )
  } else {
    return false
  }
}

export function hasPermissions(session: Session, per: string[]) {
  if (session?.user != null) {
    return (
      session?.user.permissions.filter(
        (p) =>
          per.findIndex(
            (pe) => p.code.toLocaleUpperCase() === pe.toLocaleUpperCase()
          ) > -1
      ).length > 0
    )
  } else {
    return false
  }
}

export function GetTypeNameOfItem(item: string) {
  switch (item.toLowerCase()) {
    case 'horse':
      return 'Horse'
    case 'equipment_0':
      return 'Weapon'
    case 'equipment_1':
      return 'Shield'
    case 'equipment_2':
      return 'Weapon'
    case 'equipment_3':
      return 'Shield'
    case 'armor_head':
      return 'Armor Head'
    case 'armor_body':
      return 'Armor Body'
    case 'armor_leg':
      return 'Armor Leg'
    case 'armor_gloves':
      return 'Armor Gloves'
    case 'armor_cape':
      return 'Armor Cape'
    default:
      return item
  }
}
