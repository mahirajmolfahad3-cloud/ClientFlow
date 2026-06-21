import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'ClientFlow', template: '%s | ClientFlow' },
  description: 'The client management platform for freelancers and agencies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
