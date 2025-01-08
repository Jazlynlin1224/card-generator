import './globals.css'
import { Inter } from 'next/font/google'

// 导入手写风格的英文字体
const dancingScript = {
  variable: '--font-dancing-script',
  display: 'swap',
  adjustFontFallback: false,
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  preload: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* 添加中文手写字体 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
