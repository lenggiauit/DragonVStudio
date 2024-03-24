import { auth } from '@/auth'
import { AppSetting } from '@/types/type'
import { Metadata, NextPage, ResolvingMetadata } from 'next'
import { ENTranslation, VNTranslation } from '@/components/translation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { AppProvider } from '@/contexts/appContext'
import NotificationList from '@/components/userNotification'
import AdminGameNav from '@/components/adminGameNav'
import UserGamePage from '@/components/userGame'
import AdminGameLayout from '@/components/layout/gameLayout'
import AdminGameItems from '@/components/admin/gameItem'

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
      images: appSetting.SiteUrl + '/assets/images/ChiVan.jpg',
      title: 'Dragon V Studio',
      description: 'Admin - Dragon V Studio',
      url: appSetting.SiteUrl + '/admin/' + params,
    },
  }
}

const AdminGameItemsPage: NextPage = async () => {
  const session = await auth()
  return (
    <>
      <AppProvider session={session}>
        <Navigation />
        <AdminGameLayout>
          <AdminGameItems />
        </AdminGameLayout>
      </AppProvider>
    </>
  )
}

export default AdminGameItemsPage
