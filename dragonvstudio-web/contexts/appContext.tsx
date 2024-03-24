'use client'
import React, { useState, createContext, useContext } from 'react'
import { AppSetting } from '../types/type'
import { GlobalKeys } from '../utils/constants'
import { Provider } from 'react-redux'
import { store } from '../store'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

let appSetting: AppSetting = require('../appSetting.json')

export type AppContextType = {
  locale: string
  setLocale: (string: string) => void
  appSetting: AppSetting
}

export const AppContext = createContext<AppContextType>({
  locale: 'en',
  setLocale: (locale) => console.warn('No locale provider'),
  appSetting: appSetting,
})

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({
  children,
  session,
}: React.PropsWithChildren<{ session: Session | null }>) => {
  const defaultLocale = 'en'
  // if (typeof window !== 'undefined') {
  //   window.localStorage.getItem(GlobalKeys.LanguageSelectedKey)
  // }
  const [locale, setLocale] = useState<string>(defaultLocale || 'en')

  const provider = {
    locale,
    setLocale,
    appSetting,
  }
  return (
    <>
      <SessionProvider session={session}>
        <Provider store={store}>
          <AppContext.Provider value={provider}>{children}</AppContext.Provider>
        </Provider>
      </SessionProvider>
    </>
  )
}
