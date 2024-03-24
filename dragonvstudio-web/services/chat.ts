'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiRequest, ApiResponse, AppSetting } from '../types/type'
import { Conversation } from './models/conversation'
import {
  CreateConversationRequest,
  GetConversationListRequest,
  GetMessagesRequest,
  InviteToConversationRequest,
  MessengeSearchRequest,
  RemoveFromConversationRequest,
  SearchRequest,
} from './communication/request/getConversationListRequest'
import * as signalR from '@microsoft/signalr'
import { ConversationMessage } from './models/conversationMessage'
import { CommonResponse } from './communication/response/commonResponse'
import { Messenger } from './models/messenger'
import { getSession } from 'next-auth/react'
import { Session, User } from 'next-auth'
let appSetting: AppSetting = require('../appSetting.json')

export const getCurrentUser = async () => {
  return await getSession().then((session) => session!.user!)
}
export const signalRHubConnection = new signalR.HubConnectionBuilder()
  .withUrl(appSetting.APIUrl + 'conversationServiceHub', {
    accessTokenFactory: () => getCurrentUser().then((u) => u.accessToken),
  })
  //.configureLogging(signalR.LogLevel.Trace)
  .withAutomaticReconnect()
  .build()

// var signalRHubConnectionVar: signalR.HubConnection

export const StartSignalRHubConnection = async () => {
  const currentUser = await getSession().then((session) => session?.user!)

  if (CheckSignalRHubConnection()) {
    signalRHubConnection
      .start()
      .then(() => {
        // check connection
        signalRHubConnection.send(
          'checkConnectionStatus',
          getCurrentUser().then((u) => u.id)
        )
        // receive connection status
        signalRHubConnection.on('onCheckConnectionStatus', (message) => {
          console.log(message)
        })
      })
      .catch((ex) => {
        console.log(ex)
      })
  }
}

export const getSignalRHubConnection = () => {
  return signalRHubConnection
}

export const CheckSignalRHubConnection = () => {
  return signalRHubConnection.state == 'Disconnected'
}

export const StopSignalRHubConnection = () => {
  signalRHubConnection.stop()
}

export const ChatService = createApi({
  reducerPath: 'ChatService',

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
    GetConversationListByUser: builder.mutation<
      ApiResponse<Conversation[]>,
      ApiRequest<GetConversationListRequest>
    >({
      query: (payload) => ({
        url: 'chat/getConversationListByUser',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Conversation[]>) {
        return response
      },
    }),
    GetMessagesByConversation: builder.mutation<
      ApiResponse<ConversationMessage[]>,
      ApiRequest<GetMessagesRequest>
    >({
      query: (payload) => ({
        url: 'chat/getMessagesByConversation',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ConversationMessage[]>) {
        return response
      },
    }),
    ConversationalSearchKeyword: builder.mutation<
      ApiResponse<Conversation[]>,
      ApiRequest<SearchRequest>
    >({
      query: (payload) => ({
        url: 'chat/conversationalSearch',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Conversation[]>) {
        return response
      },
    }),
    SearchMessengerByKeyword: builder.mutation<
      ApiResponse<Messenger[]>,
      ApiRequest<MessengeSearchRequest>
    >({
      query: (payload) => ({
        url: 'chat/messengerSearch',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Messenger[]>) {
        return response
      },
    }),
    CreateConversation: builder.mutation<
      ApiResponse<Conversation>,
      ApiRequest<CreateConversationRequest>
    >({
      query: (payload) => ({
        url: 'chat/createConversation',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<Conversation>) {
        return response
      },
    }),
    DeleteConversation: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<any>
    >({
      query: (payload) => ({
        url: 'chat/deleteConversation',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),
    InviteToConversation: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<InviteToConversationRequest>
    >({
      query: (payload) => ({
        url: 'chat/inviteToConversation',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),
    RemoveFromConversation: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<RemoveFromConversationRequest>
    >({
      query: (payload) => ({
        url: 'chat/removeFromConversation',
        method: 'post',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommonResponse>) {
        return response
      },
    }),
    DeleteMessage: builder.mutation<
      ApiResponse<CommonResponse>,
      ApiRequest<{ convesationId: any; messageId: any }>
    >({
      query: (payload) => ({
        url: 'chat/deleteMessage',
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
  useGetConversationListByUserMutation,
  useGetMessagesByConversationMutation,
  useConversationalSearchKeywordMutation,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useSearchMessengerByKeywordMutation,
  useInviteToConversationMutation,
  useRemoveFromConversationMutation,
  useDeleteMessageMutation,
} = ChatService
