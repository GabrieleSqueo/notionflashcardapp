'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { logout } from '../actions'
import { MdExitToApp, MdPerson, MdMenu, MdClose } from 'react-icons/md'
import logo from '../../../public/logo.png'

const Navbar = ({ username }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleButtonClick = (e, action) => {
        e.preventDefault();
        const button = e.currentTarget;
        button.classList.add('active');
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                button.classList.remove('active');
                action();
            });
        });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-100 to-purple-100 shadow-md w-full">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Image src={logo} alt="NotionFlashcard Logo" className="h-10 w-auto mr-2" width={40} height={40} />
                        <h1 className="text-2xl font-bold text-indigo-600 hidden sm:block">NotionFlashcard</h1>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        <div className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold">
                            <MdPerson className="w-5 h-5 mr-2" />
                            <span>{username}</span>
                        </div>
                        <form action={logout}>
                            <button 
                                type="submit"
                                onClick={(e) => handleButtonClick(e, logout)}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-xl shadow-[0_3px_0_rgb(185,28,28)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(185,28,28)] active:translate-y-[3px]"
                            >
                                <MdExitToApp className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </form>
                    </div>
                    <div className="sm:hidden">
                        <button onClick={toggleMenu} className="text-indigo-600">
                            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <div className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold">
                            <MdPerson className="w-5 h-5 mr-2" />
                            <span>{username}</span>
                        </div>
                        <form action={logout} className="mt-2">
                            <button 
                                type="submit"
                                onClick={(e) => handleButtonClick(e, logout)}
                                className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-xl shadow-[0_3px_0_rgb(185,28,28)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(185,28,28)] active:translate-y-[3px]"
                            >
                                <MdExitToApp className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar