'use client'
import { ReactTyped } from 'react-typed'
import { Translation } from '../translation'
import { dictionaryList } from '@/locales'
import { useAppContext } from '@/contexts/appContext'

const TypingText: React.FC = () => {
  const { locale } = useAppContext()
  return (
    <>
      <ReactTyped
        strings={[
          'Dragon V Studio.',
          dictionaryList[locale]['welcome_home'],
          dictionaryList[locale]['welcome_uplifting_place'],
          dictionaryList[locale]['welcome_communal_place'],
        ]}
        typeSpeed={100}
        loop
      />
    </>
  )
}

export default TypingText
