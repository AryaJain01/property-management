"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Home, User, LogOut, Menu } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">LuxeStay</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!session ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">
                  Login
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-indigo-600 font-medium transition space-x-1">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="flex items-center text-red-500 hover:text-red-700 font-medium transition space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
