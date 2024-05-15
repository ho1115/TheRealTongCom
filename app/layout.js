import { Inter } from 'next/font/google'
import './globals.css'
import MainWrapper from "@/app/MaxWidthWrapper";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '通志史料比對系統',
  icons: {
    icon: '/icon.png'}
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><MainWrapper>{children}</MainWrapper></body>
    </html>
  )
}
