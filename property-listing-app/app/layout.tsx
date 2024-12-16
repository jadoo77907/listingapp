import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../lib/AuthContext'
import NavBar from './components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Property Listing App',
  description: 'A property listing app using Gemini AI and Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Property Listing App. All rights reserved.
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

