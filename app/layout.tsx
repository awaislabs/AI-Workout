import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500","600","700","800","900"], // ✅ Fix: define weights to prevent build error
})

export const metadata: Metadata = {
  title: "Workout Generator",
  description: "Generate custom fitness plans with AI",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout fontClass={poppins.variable}>{children}</ClientLayout>
}
