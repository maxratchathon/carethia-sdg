import type { Metadata } from 'next'
import ThemeRegistry from './ThemeRegistry'
import I18nProvider from '@/components/I18nProvider'
import Providers from '@/components/Providers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Carethia – Trusted Home Care for Families',
  description: 'Platform connecting families with verified special-needs care professionals across Thailand.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <I18nProvider>
          <Providers>
            <ThemeRegistry>{children}</ThemeRegistry>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  )
}



