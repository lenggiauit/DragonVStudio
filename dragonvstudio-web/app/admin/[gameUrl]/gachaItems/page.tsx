import { auth } from '@/auth'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import { ENTranslation, VNTranslation } from '@/components/translation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { AppProvider } from '@/contexts/appContext'
import NotificationList from '@/components/userNotification'
import UserNav from '@/components/userNav'
import UserGamePage from '@/components/userGame'
import AdminGameLayout from '@/components/layout/gameLayout'
import AdminGamePlayer from '@/components/admin/gamePlayer'
import GachaComponent from '@/components/admin/gacha'
import GachaItemComponent from '@/components/admin/gachaItem'

let appSetting: AppSetting = require('../../../../appSetting.json')

type Props = {
  params: { gameUrl: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Dragon V Studio',
    description: 'Admin - Dragon V Studio',
    openGraph: {
      images: appSetting.SiteUrl + '/assets/images/Logo.png',
      title: 'Dragon V Studio',
      description: 'Admin - Dragon V Studio',
      url: appSetting.SiteUrl + '/admin/' + params,
    },
  }
}

const GachaItemGamesPage: NextPage = async () => {
  const session = await auth()
  return (
    <>
      <AppProvider session={session}>
        <Navigation />
        <AdminGameLayout>
          <GachaItemComponent />
        </AdminGameLayout>
      </AppProvider>
    </>
  )
}

export default GachaItemGamesPage
