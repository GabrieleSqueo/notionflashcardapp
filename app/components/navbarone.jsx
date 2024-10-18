"use client"
import { useState, useEffect } from 'react';
import logo from '../../public/logo.png';
import Image from 'next/image';
import Link from 'next/link';

const Navbarone = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    // Add your sign in logic here
    console.log('Sign In clicked');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center">
            <Image src={logo} height={48} width={48} alt="NotionFlashcard Logo" className="mr-3" />
            <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600`}>
              NotionFlashcard
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="#solution" className={`hidden md:inline-block font-semibold text-lg transition-all duration-150 ${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-black hover:text-indigo-200'}`}>
              Features
            </Link>
            <Link href="#whyNow" className={`hidden md:inline-block font-semibold text-lg transition-all duration-150 ${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-black hover:text-indigo-200'}`}>
              Pricing
            </Link>
            <Link href="https://buy.stripe.com/8wM7uX51TeEsdCU6oo">
              <button 
                onClick={handleSignIn}
                className={`px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-600 hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[1px]`}
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbarone;
