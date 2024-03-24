import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiRequest, ApiResponse, AppSetting } from '../types/type'
import { ResultCode } from '../utils/enums'
import { NotificationResource } from './resources/notificationResource'
import { getSession } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export const NotificationService = createApi({
  reducerPath: 'NotificationService',
  baseQuery: fetchBaseQuery({
    baseUrl: appSetting.APIUrl,
    prepareHeaders: async (headers) => {
      const currentUser = await getSession().then((session) => session?.user)
      // Add token to headers
      if (currentUser && currentUser.accessToken) {
        headers.set('Authorization', `Bearer ${currentUser.accessToken}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    GetNotification: builder.query<
      ApiResponse<NotificationResource[]>,
      ApiRequest<{}>
    >({
      query: (payload) => ({
        url: 'notification/GetNotification',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<NotificationResource[]>) {
        return response
      },
    }),
    GetNotificationCount: builder.query<ApiResponse<any>, ApiRequest<{}>>({
      query: (payload) => ({
        url: 'notification/GetNotificationCount',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<any>) {
        return response
      },
    }),
    Remove: builder.mutation<
      ApiResponse<ResultCode>,
      ApiRequest<{
        id: any
      }>
    >({
      query: (payload) => ({
        url: 'notification/Remove',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    RemoveAll: builder.mutation<ApiResponse<ResultCode>, ApiRequest<{}>>({
      query: (payload) => ({
        url: 'notification/RemoveAll',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
  }),
})
export const {
  useGetNotificationCountQuery,
  useGetNotificationQuery,
  useRemoveMutation,
  useRemoveAllMutation,
} = NotificationService
