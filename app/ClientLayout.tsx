"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import "../app/globals.css"

export default function ClientLayout({
  children,
  fontClass,
}: Readonly<{
  children: React.ReactNode
  fontClass: string
}>) {
  return (
    <html lang="en">
      <body className={fontClass}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
