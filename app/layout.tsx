import type { Metadata } from "next"
import { Inter, Roboto } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const roboto = Roboto({
  weight: ["300", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Living Services",
  description: "services for comfortable living",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ru'>
      <body className={roboto.className}>
        <main className='main'>{children}</main>
      </body>
    </html>
  )
}
