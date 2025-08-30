import type { Metadata } from 'next'
import './globals.css'
import './fonts.css'

export const metadata: Metadata = {
  title: 'Thmanyah - iTunes Podcast Search',
  description: 'Search and discover podcasts from iTunes with a beautiful dark theme interface',
  keywords: 'podcasts, iTunes, search, Arabic, بودكاست, بحث',
  authors: [{ name: 'Thmanyah Team' }],
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  themeColor: '#00BC6D',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Thmanyah - iTunes Podcast Search',
    description: 'Search and discover podcasts from iTunes with a beautiful dark theme interface',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thmanyah - iTunes Podcast Search',
    description: 'Search and discover podcasts from iTunes with a beautiful dark theme interface',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-ibm-plex-sans-arabic antialiased relative" suppressHydrationWarning>
        <div id="__next" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
} 