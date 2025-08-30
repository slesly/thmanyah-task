import type { Metadata } from 'next'
import './globals.css'
import './fonts.css'

export const metadata: Metadata = {
  title: 'ثمانية - محرك بحث البودكاست',
  description: 'ابحث في أكثر من 70 مليون بودكاست وحلقة من iTunes. اكتشف محتوى صوتي جديد ومميز باللغة العربية والإنجليزية',
  keywords: 'بودكاست, podcast, iTunes, بحث, ثمانية, محتوى صوتي, حلقات, برامج صوتية, audio content, search',
  authors: [{ name: 'ثمانية للنشر والتوزيع' }],
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  themeColor: '#00BC6D',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ثمانية - محرك بحث البودكاست',
    description: 'ابحث في أكثر من 70 مليون بودكاست وحلقة من iTunes. اكتشف محتوى صوتي جديد ومميز',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ثمانية',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'ثمانية - محرك بحث البودكاست',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ثمانية - محرك بحث البودكاست',
    description: 'ابحث في أكثر من 70 مليون بودكاست وحلقة من iTunes. اكتشف محتوى صوتي جديد ومميز',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://thmanyah.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ثمانية - محرك بحث البودكاست",
    "description": "ابحث في أكثر من 70 مليون بودكاست وحلقة من iTunes. اكتشف محتوى صوتي جديد ومميز باللغة العربية والإنجليزية",
    "url": "https://thmanyah.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thmanyah.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ثمانية للنشر والتوزيع",
      "logo": {
        "@type": "ImageObject",
        "url": "https://thmanyah.com/logo.svg"
      }
    }
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="font-ibm-plex-sans-arabic antialiased relative" suppressHydrationWarning>
        <div id="__next" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
} 