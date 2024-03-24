'use client'
import React, { useContext, MouseEvent } from 'react'
import { localeOptions } from '../../locales'
import { useAppContext } from '../../contexts/appContext'
import { GlobalKeys } from '../../utils/constants'

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useAppContext()
  const handleLanguageChange: React.MouseEventHandler<HTMLAnchorElement> = (
    e
  ) => {
    //e.preventDefault()
    var selectLang = (e.target as HTMLAnchorElement).id
    if (selectLang) {
      window.localStorage.setItem(GlobalKeys.LanguageSelectedKey, selectLang)
      setLocale(selectLang)
      //console.log(locale)
    }
  }
  return (
    <>
      <li className='nav-item dropdown'>
        <a
          className='nav-link'
          role='button'
          data-bs-toggle='dropdown'
          data-toggle='dropdown'
          aria-expanded='false'
          href='#'
        >
          <span>
            <img
              className='avatar avatar-xss avatar-circle me-2'
              src={`/assets/svg/${locale}.svg`}
              alt='English (US)'
              width='16'
            />
          </span>
          {localeOptions[locale]}
        </a>
        <ul className='dropdown-menu'>
          {Object.entries(localeOptions).map(([id, name]) => (
            <li key={id}>
              <a
                id={id}
                className='dropdown-item'
                href='#'
                onClick={handleLanguageChange}
              >
                <span>
                  <img
                    className='avatar avatar-xss avatar-circle me-2'
                    src={`/assets/svg/${id}.svg`}
                    alt='English (US)'
                    width='16'
                  />
                </span>
                <span> {name}</span>
              </a>
            </li>
          ))}
        </ul>
      </li>
    </>
  )
}
