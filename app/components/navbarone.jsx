"use client"
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import Image from 'next/image';
import IframeComponent from './iFrameComponent';

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
          <div className="flex items-center">
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
      
      <dialog id="cta4" className="modal">
        <div className="modal-box w-11/12 max-w-4xl p-8 relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl border-4 border-purple-400 shadow-2xl">
          <button onClick={() => document.getElementById('cta4').close()} className="absolute top-2 right-2 text-white hover:text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="font-bold text-4xl sm:text-5xl text-center mb-6 text-white">
            🎉 <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-400">Unlock Your Learning Potential!</span>
          </h3>
          <div className="space-y-6 text-white">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h4 className="text-2xl font-bold mb-4 text-yellow-300">🚀 Exclusive Waitlist Benefits:</h4>
              <ul className="list-none space-y-3">
                {[
                  ["💎", "50% OFF your first subscription"],
                  ["🥇", "Early access to our game-changing tool"],
                  ["🎁", "Bonus study resources and tips"],
                  ["🔔", "First to know about new features"]
                ].map(([emoji, text]) => (
                  <li key={text} className="flex items-center text-lg">
                    <span className="text-2xl mr-2">{emoji}</span> {text}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-center text-lg">
              Don't let this opportunity slip away! Join now and transform your Notion workspace into a powerful learning engine.
            </p>
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">Time is running out!</p>
              <div className="font-bold text-3xl text-yellow-300 animate-pulse" id="countdown">23:59:59</div>
            </div>
          </div>
          <div className="mt-8">
            <IframeComponent />
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default Navbarone;
