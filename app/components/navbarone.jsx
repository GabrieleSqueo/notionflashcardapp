"use client"
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import Image from 'next/image';
import IframeComponent from './iFrameComponent';
import Link from 'next/link';
import WaitlistModal from './WaitlistModal';

const Navbarone = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = () => {
    document.getElementById('cta4').showModal();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[#14103F]/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Image src={logo} height={40} width={40} alt="NotionFlashcard Logo" className="mr-3" />
            <span className="text-white text-xl font-bold hidden md:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              NotionFlashcard
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleButtonClick}
              className="px-4 py-2 text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-md border border-white border-opacity-10 hover:border-opacity-20 shadow-lg"
            >
              <span className="font-bold text-sm md:text-base">
                Join Waitlist
              </span>
            </button>
          </div>
        </div>
      </div>
            <WaitlistModal 
              modalId="cta4" 
              onClose={() => document.getElementById('cta4').close()} 
            />
    </nav>
  );
};

export default Navbarone;
