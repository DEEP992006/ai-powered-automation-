"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">AutoFlow</h1>
      </div>

      {/* Right side - Auth Actions */}
      <div className="flex items-center gap-4">
        {session ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {session.user?.name}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user?.email}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setIsDropdownOpen(false)
                    signOut({ redirect: true, redirectTo: "/" })
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signIn("google", { redirect: true, redirectTo: "/dashboard" })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  )
}
