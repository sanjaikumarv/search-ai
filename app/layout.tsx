import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Search with Collections",
  description: "Search with AI and save results to collections",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
