// import { User } from '../services/models/user'
import { ResultCode } from '../utils/enums'

export interface Dictionary<T> {
  [Key: string]: T
}

export interface AppSetting {
  SiteUrl: any
  APIUrl: any
  GoogleClientId: any
  PageSize: number
}

export type ApiResponse<T> = {
  resultCode: ResultCode
  messages: any
  resource: T
  total: number
}

export type ApiRequest<T> = {
  metaData?: MetaData
  payload: T
}

export type ApiGameRequest<T> = {
  metaData?: MetaData
  payload: T
  gameUrl: any
}

export type Paging = {
  index: number
  size: number
}

export type MetaData = {
  paging: Paging
  sortBy?: string[]
  orderBy?: string[]
}

export type LoginFormValues = {
  username: string
  password: string
}

export type FormKeyword = {
  keywords: string
}
