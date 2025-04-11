import './globals.css'

export const metadata = {
  title: 'Sync',
  description: 'A comprehensive academic management system',
  icons: {
    icon: [
      { url: '/16.png', sizes: '16x16', type: 'image/png' },
      { url: '/32.png', sizes: '32x32', type: 'image/png' },
      { url: '/64.png', sizes: '64x64', type: 'image/png' },
      { url: '/128.png', sizes: '128x128', type: 'image/png' },
      { url: '/256.png', sizes: '256x256', type: 'image/png' },
      { url: '/512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/114.png', sizes: '114x114', type: 'image/png' },
      { url: '/120.png', sizes: '120x120', type: 'image/png' },
      { url: '/144.png', sizes: '144x144', type: 'image/png' },
      { url: '/152.png', sizes: '152x152', type: 'image/png' },
      { url: '/180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/180.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
} 