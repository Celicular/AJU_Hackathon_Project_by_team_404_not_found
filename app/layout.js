import './globals.css'

export const metadata = {
  title: 'Student Portal',
  description: 'A comprehensive portal for student academic management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 