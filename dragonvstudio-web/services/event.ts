import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiRequest, ApiResponse, AppSetting } from '../types/type'

import * as FormDataFile from 'form-data'
import { CategoryResource } from './resources/categoryResource'
import { TagResource } from './resources/tagResource'
import {
  BlogPostRelatedResource,
  BlogPostResource,
} from './resources/blogPostResource'
import { CommentResource } from './resources/commentResource'
import { ResultCode } from '../utils/enums'
import { EventBookingDateResource } from './resources/eventBookingDateResource'
import { getSession } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export const EventService = createApi({
  reducerPath: 'EventService',

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
    GetEventBookingAvaiableDate: builder.query<
      ApiResponse<EventBookingDateResource[]>,
      ApiRequest<null>
    >({
      query: (payload) => ({
        url: 'event/GetEventBookingAvaiableDate',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<EventBookingDateResource[]>) {
        return response
      },
    }),
    AddEditPrivateTalk: builder.mutation<
      ApiResponse<{ id: any }>,
      ApiRequest<{
        id?: any
        fullname: any
        email: any
        agerange: any
        problem: any
        problemOther: any
        problemDescription: any
        yourSolutionDescription: any
        yourExpectationDescription: any
        eventBookingDateId: any
        redeemCode: any
      }>
    >({
      query: (payload) => ({
        url: 'event/AddEditPrivateTalk',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<{ id: any }>) {
        return response
      },
    }),
    AddEditMockInterview: builder.mutation<
      ApiResponse<{ id: any }>,
      ApiRequest<{
        id?: any
        fullname: any
        email: any
        agerange: any
        language: any
        resume: any
        coverLetter: any
        jobDescription: any
        note: any
        eventBookingDateId: any
        redeemCode: any
      }>
    >({
      query: (payload) => ({
        url: 'event/AddEditMockInterview',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<{ id: any }>) {
        return response
      },
    }),
  }),
})

export const {
  useGetEventBookingAvaiableDateQuery,
  useAddEditPrivateTalkMutation,
  useAddEditMockInterviewMutation,
} = EventService
