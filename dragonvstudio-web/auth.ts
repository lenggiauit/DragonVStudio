// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import NextAuth from 'next-auth'
import type { NextAuthConfig, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import https from 'https'
import Discord from '@auth/core/providers/discord'
import axios from 'axios'
import { AppSetting } from './types/type'
import { Permission } from './services/models/permission'
import { ResultCode } from './utils/enums'
import { getToken } from '@auth/core/jwt'

let appSetting: AppSetting = require('./appSetting.json')

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      discordId: string
      discordName: string
      accessToken: string
      avatar: string
      role: string
      phone: string
      address: string
      fullName: string
      permissions: Permission[]
    } & Omit<User, 'id'>
  }
}

declare module '@auth/core/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      id: string
      discordId: string
      discordName: string
      accessToken: string
      avatar: string
      role: string
      phone: string
      address: string
      fullName: string
      permissions: Permission[]
    }
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    // Add your additional properties here:
    id: string
    accessToken: string
    discordId: string
    discordName: string
    avatar: string
    role: string
    phone: string
    address: string
    fullName: string
    permissions: Permission[]
  }
}

export const authConfig = {
  debug: true,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization:
        'https://discord.com/oauth2/authorize?scope=identify+email+guilds+guilds.members.read',
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(c) {
        console.log('c.email ---- ' + c.email + 'c.password ---' + c.password)

        return await axios
          .post(
            appSetting.APIUrl + `Account/Login`,
            {
              payload: {
                name: c.email,
                password: c.password,
              },
            },
            {
              httpsAgent: new https.Agent({
                rejectUnauthorized: false,
              }),
            }
          )
          .then(function (response) {
            return {
              id: response.data.resource.id,
              discordId: response.data.resource.discordId,
              discordName: response.data.resource.discordName,
              name: response.data.resource.fullName,
              email: response.data.resource.email,
              image: response.data.resource.avatar,
              avatar: response.data.resource.avatar,
              accessToken: response.data.resource.accessToken,
              role: response.data.resource.role.name,
              permissions: response.data.resource.permissions,
            }
          })
          .catch(function (error) {
            console.log('error --- ' + error)
            return null
          })
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // // Allows relative callback URLs
      // if (url.startsWith('/')) return `${baseUrl}${url}`
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url
      // return baseUrl
      return '/'
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
      }

      return true
    },

    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.user?.id,
          discordId: token.user?.discordId,
          discordName: token.user?.discordName,
          fullName: token.user?.fullName,
          name: token.user?.name,
          phone: token.user?.phone,
          address: token.user?.address,
          role: token.user?.role,
          avatar: token.user?.avatar,
          permissions: token.user?.permissions,
          accessToken: token.user?.accessToken,
        },
      }
    },

    async jwt({ token, user, account, session, trigger, profile }) {
      if (trigger === 'update') {
        if (session.infoAvatar) {
          token.user.avatar = session.infoAvatar.avatar
        }
        if (session.userInfo) {
          token.user.fullName = session.userInfo.fullName
          token.user.email = session.userInfo.email
          token.user.phone = session.userInfo.phone
          token.user.address = session.userInfo.address
        }
      }

      if (account) {
        if (account.provider == 'google') {
          const response = await axios
            .get(
              appSetting.APIUrl +
                `Account/LoginWithGoogle?access_token=${account.access_token}`,

              {
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              }
            )
            .then(function (response) {
              if (response.data.resultCode == ResultCode.Success) {
                return {
                  id: response.data.resource.id,
                  discordId: response.data.resource.discordId,
                  discordName: response.data.resource.discordName,
                  name: response.data.resource.name,
                  fullName: response.data.resource.fullName,
                  email: response.data.resource.email,
                  phone: response.data.resource.phone,
                  address: response.data.resource.address,
                  avatar: response.data.resource.avatar,
                  image: user.image,
                  accessToken: response.data.resource.accessToken,
                  role: response.data.resource.role.name,
                  permissions: response.data.resource.permissions,
                }
              } else {
                return null
              }
            })
            .catch(function (error) {
              return null
            })
          console.log(response)
          user = response
        }

        if (account.provider == 'facebook') {
          const response = await axios
            .get(
              appSetting.APIUrl +
                `Account/LoginWithFaceBook?userId=${account.providerAccountId}&access_token=${account.access_token}`,
              {
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              }
            )
            .then(function (response) {
              if (response.data.resultCode == ResultCode.Success) {
                return {
                  id: response.data.resource.id,
                  discordId: response.data.resource.discordId,
                  discordName: response.data.resource.discordName,
                  name: response.data.resource.name,
                  fullName: response.data.resource.fullName,
                  email: response.data.resource.email,
                  phone: response.data.resource.phone,
                  address: response.data.resource.address,
                  avatar: response.data.resource.avatar,
                  image: user.image,
                  accessToken: response.data.resource.accessToken,
                  role: response.data.resource.role.name,
                  permissions: response.data.resource.permissions,
                }
              } else {
                return null
              }
            })
            .catch(function (error) {
              return null
            })
          console.log(response)
          user = response
        }

        if (account.provider == 'discord') {
          console.log('token: ' + account.access_token)
          const response = await axios
            .get(
              appSetting.APIUrl +
                `Account/LoginWithDiscord?access_token=${account.access_token}`,
              {
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              }
            )
            .then(function (response) {
              if (response.data.resultCode == ResultCode.Success) {
                return {
                  id: response.data.resource.id,
                  discordId: response.data.resource.discordId,
                  discordName: profile.username,
                  fullName: response.data.resource.fullName,
                  name: response.data.resource.name,
                  email: response.data.resource.email,
                  phone: response.data.resource.phone,
                  address: response.data.resource.address,
                  avatar: response.data.resource.avatar,
                  image: user.image,
                  accessToken: response.data.resource.accessToken,
                  role: response.data.resource.role.name,
                  permissions: response.data.resource.permissions,
                }
              } else {
                return null
              }
            })
            .catch(function (error) {
              console.log('============= ERROR ==============' + error)
              return null
            })
          console.log(response)
          user = response
        }

        token.accessToken = account.access_token
        token.user = user
      }
      return token
    },

    authorized(params) {
      return !!params.auth?.user
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
