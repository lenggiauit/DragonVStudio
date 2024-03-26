import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  ApiGameRequest,
  ApiRequest,
  ApiResponse,
  AppSetting,
} from '../types/type'
import * as FormDataFile from 'form-data'
import { Category } from './models/admin/category'
import { BlogPost } from './models/admin/blogPost'
import { Tag } from './models/tag'
import { EventBookingDate } from './models/admin/eventBookingDate'
import { ResultCode } from '../utils/enums'
import { PrivateTalk } from './models/admin/privateTalk'
import { EventBookingDateResource } from './resources/eventBookingDateResource'
import { MockInterview } from './models/admin/mockInterview'
import { User } from './models/user'
import { UserResource } from './resources/userResource'
import { FileSharing } from './models/admin/fileSharing'
import { FeedbackResource } from './resources/feedbackResource'
import { getSession } from 'next-auth/react'
import { Player } from './models/adminGame/player'
import { Log } from './models/adminGame/log'
import { GameServer } from './models/adminGame/gameServerStatus'
import { EventPlayer } from './models/adminGame/eventPlayer'

let appSetting: AppSetting = require('../appSetting.json')

export const MountAndBladeGameService = createApi({
  reducerPath: 'MountAndBladeGameService',

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
    GetGameInfor: builder.mutation<ApiResponse<GameServer>, ApiGameRequest<{}>>(
      {
        query: (payload) => ({
          url: 'AdminGameMaB/GetGameInfor',
          method: 'post',
          body: payload,
        }),
        transformResponse(response: ApiResponse<GameServer>) {
          return response
        },
      }
    ),

    GetPlayerList: builder.mutation<
      ApiResponse<Player[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetPlayerList',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Player[]>) {
        return response
      },
    }),

    GetPlayerListForEvent: builder.mutation<
      ApiResponse<EventPlayer[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetPlayerListForEvent',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<EventPlayer[]>) {
        return response
      },
    }),

    GetPlayerLogs: builder.mutation<
      ApiResponse<Log[]>,
      ApiGameRequest<{ keywords: any; actionType: any; createdAt: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetPlayerLogs',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Log[]>) {
        return response
      },
    }),

    SavePlayersEvent: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{ players: EventPlayer[] }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/SavePlayersEvent',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    AssignTeamsToBattleEvent: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{ players: EventPlayer[] }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AssignTeamsToBattleEvent',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    GetSavedPlayersEvent: builder.mutation<
      ApiResponse<EventPlayer[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetSavedPlayersEvent',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<EventPlayer[]>) {
        return response
      },
    }),
  }),
})

export const {
  useGetGameInforMutation,
  useGetPlayerListMutation,
  useGetPlayerLogsMutation,
  useGetPlayerListForEventMutation,
  useSavePlayersEventMutation,
  useGetSavedPlayersEventMutation,
  useAssignTeamsToBattleEventMutation,
} = MountAndBladeGameService
