import './globals.css'

export const metadata = {
  title: 'ERP System',
  description: 'A comprehensive enterprise resource planning solution',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div style={{ position: 'relative' }}>
          {children}
        </div>
      </body>
    </html>
  )
} 