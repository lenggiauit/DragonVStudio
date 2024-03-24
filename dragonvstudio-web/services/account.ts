import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiRequest, ApiResponse, AppSetting } from '../types/type'
import { ResultCode } from '../utils/enums'
import { AuthenticateRequest } from './communication/request/authenticateRequest'
import { ForgotpasswordRequest } from './communication/request/forgotpasswordRequest'
import { RegisterRequest } from './communication/request/registerRequest'
import { ResetPasswordRequest } from './communication/request/resetPasswordRequest'
import {
  UpdateAvatarRequest,
  UpdateProfileRequest,
} from './communication/request/updateProfileRequest'
import { AuthenticateResponse } from './communication/response/authenticateResponse'
import { CommonResponse } from './communication/response/commonResponse'
import { ForgotpasswordResponse } from './communication/response/forgotpasswordResponse'
import { RegisterResponse } from './communication/response/registerResponse'
import { MockInterviewResource } from './resources/mockInterviewResource'
import { PrivateTalkResource } from './resources/privateTalkResource'
import { getSession, useSession } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export const UserService = createApi({
  reducerPath: 'UserService',
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
    UserUpdateProfile: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<UpdateProfileRequest>
    >({
      query: (payload) => ({
        url: 'account/updateProfile',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),

    UserUpdateAvatar: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<UpdateAvatarRequest>
    >({
      query: (payload) => ({
        url: 'account/updateUserAvatar',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),
    ChangePassword: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<ResetPasswordRequest>
    >({
      query: (payload) => ({
        url: 'account/ChangePassword',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),

    ConnectDiscord: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<{ userId: any; discordId: any; discordName: any }>
    >({
      query: (payload) => ({
        url: 'account/ConnectDiscord',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),

    SendFeedback: builder.mutation<
      ApiResponse<ResultCode>,
      ApiRequest<{ rating: any; yourFeedback: any }>
    >({
      query: (payload) => ({
        url: 'account/SendFeedback',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
  }),
})
export const {
  useUserUpdateProfileMutation,
  useUserUpdateAvatarMutation,
  useChangePasswordMutation,
  useSendFeedbackMutation,
  useConnectDiscordMutation,
} = UserService

export const AccountService = createApi({
  reducerPath: 'AccountService',

  baseQuery: fetchBaseQuery({
    baseUrl: appSetting.APIUrl,
  }),
  endpoints: (builder) => ({
    UserRegister: builder.mutation<
      ApiResponse<RegisterResponse>,
      ApiRequest<RegisterRequest>
    >({
      query: (payload) => ({
        url: 'account/register',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<RegisterResponse>) {
        return response
      },
    }),
    UserLogin: builder.mutation<
      ApiResponse<AuthenticateResponse>,
      ApiRequest<AuthenticateRequest>
    >({
      query: (payload) => ({
        url: 'account/login',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<AuthenticateResponse>) {
        return response
      },
    }),
    ForgotPassword: builder.mutation<
      ApiResponse<ForgotpasswordResponse>,
      ApiRequest<ForgotpasswordRequest>
    >({
      query: (payload) => ({
        url: 'account/forgotpassword',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ForgotpasswordResponse>) {
        return response
      },
    }),
    ResetPassword: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<ResetPasswordRequest>
    >({
      query: (payload) => ({
        url: 'account/resetpassword',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),
  }),
})

export const {
  useUserRegisterMutation,
  useUserLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = AccountService
