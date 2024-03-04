import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dragon V Studio',
  description: 'Dragon V Studio - Games mod servers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='shortcut icon' href='assets/images/favicon.ico' />
        <link
          href='assets/css/style.min.css'
          rel='stylesheet'
          type='text/css'
        />

        <link
          href='assets/css/icons.min.css'
          rel='stylesheet'
          type='text/css'
        ></link>
      </head>
      <body className='bg-slate-100 tracking-wide'>{children}</body>
      <script src='assets/js/theme.js'></script>
    </html>
  )
}
