'user client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiRequest, ApiResponse, AppSetting } from '../types/type'
import * as FormDataFile from 'form-data'
import { FileResponse } from './communication/response/fileResponse'
import { FileSharingResource } from './resources/fileSharingResource'
import { getSession } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export const getCurrentUser = async () => {
  return await getSession().then((session) => session!.user!)
}

export const FileService = createApi({
  reducerPath: 'FileService',

  baseQuery: fetchBaseQuery({
    baseUrl: appSetting.APIUrl,
    prepareHeaders: async (headers) => {
      const session = await getSession()
      // Add token to headers
      if (session) {
        headers.set('Authorization', `Bearer ${session.user.accessToken}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    UploadImage: builder.mutation<ApiResponse<FileResponse>, FormData>({
      query: (payload) => ({
        url: 'file/uploadImage',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<FileResponse>) {
        return response
      },
    }),
    UploadPackageFile: builder.mutation<ApiResponse<FileResponse>, FormData>({
      query: (payload) => ({
        url: 'file/uploadPackageFile',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<FileResponse>) {
        return response
      },
    }),
    GetFileSharing: builder.mutation<
      ApiResponse<FileSharingResource[]>,
      ApiRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'fileSharing/getFileSharing',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<FileSharingResource[]>) {
        return response
      },
    }),
  }),
})

export const {
  useUploadImageMutation,
  useUploadPackageFileMutation,
  useGetFileSharingMutation,
} = FileService
