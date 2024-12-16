'use client'

import Link from 'next/link'
import { useAuth } from '../../lib/AuthContext'
import DarkModeToggle from './DarkModeToggle'

export default function NavBar() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/settings" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={signOut} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
              Login
            </Link>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </header>
  )
}

