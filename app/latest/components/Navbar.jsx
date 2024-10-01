'use client'

import React from 'react'
import Image from 'next/image'
import { logout } from '../actions'
import { MdExitToApp } from 'react-icons/md'
import logo from '../../../public/logo.png'

const Navbar = ({ userEmail }) => {
    const handleButtonClick = (e, action) => {
        const button = e.currentTarget;
        button.classList.add('active');
        
        const removeActiveClass = () => {
            button.classList.remove('active');
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                removeActiveClass();
                action();
            });
        });

        setTimeout(removeActiveClass, 150);
    };

    return (
        <nav className="mx-auto bg-gradient-to-r from-blue-100 to-purple-100 shadow-md">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Image src={logo} alt="NotionFlashcard Logo" className="h-12 w-auto mr-2" width={32} height={32} />
                            <h1 className="text-2xl font-bold text-indigo-600">NotionFlashcard</h1>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700 mr-4">Welcome, {userEmail}</span>
                        <form action={logout}>
                            <button 
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleButtonClick(e, logout);
                                }}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-xl shadow-[0_3px_0_rgb(185,28,28)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(185,28,28)] active:translate-y-[3px]"
                            >
                                <MdExitToApp className="w-5 h-5 mr-2" />
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