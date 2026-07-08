import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Background } from '@/components/layout/Background'
import { IntroOverlay } from '@/components/ui/IntroOverlay'
import { getResume } from '@/lib/resume'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export async function generateMetadata(): Promise<Metadata> {
  const resume = await getResume()
  return {
    title: `${resume.basics.name}: ${resume.basics.label}`,
    description: resume.basics.summary,
    openGraph: {
      title: resume.basics.name,
      description: resume.basics.label,
      url: resume.basics.url,
      siteName: resume.basics.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: resume.basics.name,
      description: resume.basics.label,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <IntroOverlay />
          <Background />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
