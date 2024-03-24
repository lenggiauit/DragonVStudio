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
import { getSession } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export const BlogService = createApi({
  reducerPath: 'BlogService',

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
    GetCategory: builder.query<ApiResponse<CategoryResource[]>, null>({
      query: () => ({
        url: 'blog/getCategory',
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<CategoryResource[]>) {
        return response
      },
    }),
    GetTags: builder.query<ApiResponse<TagResource[]>, null>({
      query: () => ({
        url: 'blog/getTags',
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<TagResource[]>) {
        return response
      },
    }),
    GetTopPost: builder.query<ApiResponse<BlogPostResource[]>, null>({
      query: () => ({
        url: 'blog/getTopPost',
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<BlogPostResource[]>) {
        return response
      },
    }),
    GetNewsPost: builder.query<ApiResponse<BlogPostResource[]>, null>({
      query: () => ({
        url: 'blog/GetNewsPost',
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<BlogPostResource[]>) {
        return response
      },
    }),
    GetBlogPost: builder.mutation<
      ApiResponse<BlogPostResource[]>,
      ApiRequest<{ keywords: any }>
    >({
      query: (payload) => ({
        url: 'blog/getBlogPost',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<BlogPostResource[]>) {
        return response
      },
    }),
    GetPostDetail: builder.query<
      ApiResponse<BlogPostResource>,
      { postUrl: string }
    >({
      query: (params) => ({
        url: 'blog/GetBlogPostDetail?postUrl=' + params.postUrl,
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<BlogPostResource>) {
        return response
      },
    }),
    GetRelatedPost: builder.query<
      ApiResponse<BlogPostRelatedResource[]>,
      { category: string; notIn: string }
    >({
      query: (params) => ({
        url: `blog/GetRelatedPost?category=${params.category}&notIn=${params.notIn}`,
        method: 'GET',
      }),
      transformResponse(response: ApiResponse<BlogPostRelatedResource[]>) {
        return response
      },
    }),
    AddComment: builder.mutation<
      ApiResponse<CommentResource>,
      ApiRequest<{ postId: any; parentId: any; comment: any }>
    >({
      query: (payload) => ({
        url: 'blog/AddComment',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommentResource>) {
        return response
      },
    }),
    RemoveComment: builder.mutation<
      ApiResponse<ResultCode>,
      ApiRequest<{ commentId: any }>
    >({
      query: (payload) => ({
        url: 'blog/RemoveComment',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<ResultCode>) {
        return response
      },
    }),
    GetComment: builder.mutation<
      ApiResponse<CommentResource[]>,
      ApiRequest<{ postId: any }>
    >({
      query: (payload) => ({
        url: 'blog/GetComments',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<CommentResource[]>) {
        return response
      },
    }),
    GetBlogPostByCategory: builder.mutation<
      ApiResponse<BlogPostResource[]>,
      ApiRequest<{ url: any; keywords?: any }>
    >({
      query: (payload) => ({
        url: 'blog/GetBlogPostByCategory',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<BlogPostResource[]>) {
        return response
      },
    }),
    GetBlogPostByTag: builder.mutation<
      ApiResponse<BlogPostResource[]>,
      ApiRequest<{ url: any; keywords?: any }>
    >({
      query: (payload) => ({
        url: 'blog/GetBlogPostByTag',
        method: 'POST',
        body: payload,
      }),
      transformResponse(response: ApiResponse<BlogPostResource[]>) {
        return response
      },
    }),
  }),
})

export const {
  useGetCategoryQuery,
  useGetTagsQuery,
  useGetTopPostQuery,
  useGetBlogPostMutation,
  useGetPostDetailQuery,
  useGetRelatedPostQuery,
  useAddCommentMutation,
  useGetCommentMutation,
  useRemoveCommentMutation,
  useGetBlogPostByCategoryMutation,
  useGetBlogPostByTagMutation,
  useGetNewsPostQuery,
} = BlogService
