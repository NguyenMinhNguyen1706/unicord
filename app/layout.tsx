import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { ModalRenderer } from '@/components/modals/modal-renderer'
import { ClerkProvider } from '@clerk/nextjs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniCord — Nền tảng giao tiếp học thuật cho sinh viên',
  description: 'UniCord là nền tảng giao tiếp học thuật theo kênh, lấy cảm hứng từ Discord nhưng được thiết kế dành riêng cho sinh viên đại học Việt Nam. Tập trung thông tin lớp học, tích hợp deadline, và phòng học nhóm thường trực.',
  keywords: 'unicord, sinh viên, đại học, giao tiếp, học thuật, channel, deadline, study room',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <head>
          <meta name="theme-color" content="#7c3aed" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
        </head>
        <body className={`${font.className} antialiased`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="unicord-theme"
          >
            <SocketProvider>
              <TooltipProvider>
                <ModalProvider>
                  <QueryProvider>
                    <ModalRenderer />
                    {children}
                  </QueryProvider>
                </ModalProvider>
              </TooltipProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}