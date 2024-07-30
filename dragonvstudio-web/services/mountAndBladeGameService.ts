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
import { Player, UserGameItems } from './models/adminGame/player'
import { Log } from './models/adminGame/log'
import { GameServer } from './models/adminGame/gameServerStatus'
import { EventPlayer } from './models/adminGame/eventPlayer'
import { BannedPlayer } from './models/adminGame/bannedPlayer'
import { GameItem } from './models/adminGame/gameItem'
import { GachaItem } from './models/adminGame/gachaItem'

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

    GetPlayersHasItem: builder.mutation<
      ApiResponse<Player[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetPlayersHasItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Player[]>) {
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
      ApiGameRequest<{ players: EventPlayer[]; equipmentId: any }>
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
    AssignPlayerToPrison: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{ playerId: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AssignPlayerToPrison',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    AssignPlayerBackToPreviousRoleAndfaction: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AssignPlayerBackToPreviousRoleAndfaction',
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
    GetBannedPlayers: builder.mutation<
      ApiResponse<BannedPlayer[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetBannedPlayers',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<BannedPlayer[]>) {
        return response
      },
    }),
    BanPlayer: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userId: any
        playerId: any
        discordId: any
        name: any
        reason: any
        punishmentTime: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/BanPlayer',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    UnbanPlayer: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userId: any
        playerId: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/UnbanPlayer',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    GetGachaItems: builder.mutation<
      ApiResponse<GachaItem[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetGachaItems',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<GachaItem[]>) {
        return response
      },
    }),

    GetGachaItemsForEvent: builder.mutation<
      ApiResponse<GachaItem[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetGachaItemsForEvent',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<GachaItem[]>) {
        return response
      },
    }),

    AddEditGachaItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
        name: any
        code: any
        quantity: any
        isActive: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AddEditGachaItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    DeleteGachaItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/DeleteGachaItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    GetGameItems: builder.mutation<
      ApiResponse<GameItem[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GetGameItems',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<GameItem[]>) {
        return response
      },
    }),

    AddEditGameItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
        name: any
        code: any
        class: any
        type: any
        description: any
        images: any
        stock: any
        price: any
        duration: any
        isActive: any
        isFavorite: any
        isInGameCash: any
        discordRole: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AddEditGameItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    DeleteGameItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/DeleteGameItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    DeletePLayerGameItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/DeletePLayerGameItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    AssignItemToPlayer: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        id: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/AssignItemToPlayer',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    GetPlayerInfo: builder.mutation<
      ApiResponse<Player>,
      ApiGameRequest<{ userId: any }>
    >({
      query: (payload) => ({
        url: 'GameMaB/GetPlayerInfo',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Player>) {
        return response
      },
    }),

    GetShopGameItems: builder.mutation<
      ApiResponse<GameItem[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'GameMaB/GetShopGameItems',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<GameItem[]>) {
        return response
      },
    }),

    PlayerBuyGameItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{ itemId: any }>
    >({
      query: (payload) => ({
        url: 'GameMaB/PlayerBuyGameItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    GetPlayerGameItems: builder.mutation<
      ApiResponse<UserGameItems[]>,
      ApiGameRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'GameMaB/GetPlayerGameItems',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<UserGameItems[]>) {
        return response
      },
    }),
    PLayerDeleteGameItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userItemId: any
      }>
    >({
      query: (payload) => ({
        url: 'GameMaB/PlayerDeleteItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    PlayerEquipItem: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userItemId: any
      }>
    >({
      query: (payload) => ({
        url: 'GameMaB/PlayerEquipItem',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    ChangePlayerName: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        playerId: any
        name: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/ChangePlayerName',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    TakePlayerMoney: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userId: any
        playerId: any
        discordId: any
        amount: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/TakePlayerMoney',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),

    GivePlayerMoney: builder.mutation<
      ApiResponse<ResultCode>,
      ApiGameRequest<{
        userId: any
        playerId: any
        discordId: any
        amount: any
      }>
    >({
      query: (payload) => ({
        url: 'AdminGameMaB/GivePlayerMoney',
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
  useGetGameInforMutation,
  useGetPlayerListMutation,
  useGetPlayerLogsMutation,
  useGetPlayerListForEventMutation,
  useSavePlayersEventMutation,
  useGetSavedPlayersEventMutation,
  useAssignTeamsToBattleEventMutation,
  useAssignPlayerBackToPreviousRoleAndfactionMutation,
  useGetBannedPlayersMutation,
  useBanPlayerMutation,
  useAssignPlayerToPrisonMutation,
  useUnbanPlayerMutation,
  useGetGachaItemsMutation,
  useAddEditGachaItemMutation,
  useDeleteGachaItemMutation,
  useGetGameItemsMutation,
  useAddEditGameItemMutation,
  useDeleteGameItemMutation,
  useGetPlayersHasItemMutation,
  useDeletePLayerGameItemMutation,
  useAssignItemToPlayerMutation,
  useGetPlayerInfoMutation,
  useGetShopGameItemsMutation,
  usePlayerBuyGameItemMutation,
  useGetPlayerGameItemsMutation,
  usePLayerDeleteGameItemMutation,
  usePlayerEquipItemMutation,
  useGetGachaItemsForEventMutation,
  useChangePlayerNameMutation,
  useGivePlayerMoneyMutation,
  useTakePlayerMoneyMutation,
} = MountAndBladeGameService
