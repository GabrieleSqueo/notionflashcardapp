import React from 'react'
import { logout } from '../actions'

const Navbar = ({ userEmail }) => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">NotionFlashcard</h1>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 mr-4">Welcome, {userEmail}</span>
                        <form action={logout}>
                            <button 
                                type="submit"
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar