import Image from 'next/image'
import styles from './page.module.css'
import ComingSoon from '@/component/comingsoon'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Dragon V Studio',
    description: 'Dragon V Studio - Games mod servers',
    openGraph: {
      images: 'assets/images/logo.png',
      title: 'Dragon V Studio',
      description: 'Dragon V Studio - Games mod servers',
      url: 'https://dragonvstudio.com/',
    },
  }
}

export default function Home() {
  return (
    <>
      <ComingSoon />
    </>
  )
}
