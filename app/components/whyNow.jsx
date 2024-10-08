"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import WaitlistModal from './WaitlistModal';

const WhyNow = () => {
  const handleButtonClick = () => {
    document.getElementById('cta3').showModal();
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 text-white relative bg-gradient-to-r from-[#1a1a60] to-[#2a2a80] rounded-b-[45px]">
      <div className="max-w-4xl mx-auto text-center relative backdrop-blur-sm">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 animate-pulse">
          🚀 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">The Future of Learning is Here!</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 border border-white border-opacity-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, loop: Infinity }} className="text-5xl mb-4">⏳</motion.div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-400">Limited Time Offer</h3>
            <p className="text-lg">
              Act now! This revolutionary study tool won't be available at this price for long.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 border border-white border-opacity-20">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1, loop: Infinity }} className="text-5xl mb-4">💡</motion.div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-400">Boost Your Learning</h3>
            <p className="text-lg">
              Transform your notes into interactive flashcards and skyrocket your efficiency.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-lg shadow-xl mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">🎉 Exclusive Waitlist Offer 🎉</h3>
          <p className="text-xl mb-6 text-white">
            Join now and lock in an incredible <span className="text-yellow-300 font-bold text-3xl animate-bounce inline-block">50% OFF</span> your first subscription!
          </p>
          <div className="text-lg text-white mb-4">
            <p>⏰ This offer expires in:</p>
            <div className="font-bold text-3xl" id="countdown">24:00:00</div>
          </div>
        </div>
        
        <button 
          className="px-9 py-5 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 bg-[length:100%_100%] bg-[linear-gradient(45deg,theme(colors.purple.500),theme(colors.yellow.500))] hover:bg-[linear-gradient(45deg,theme(colors.purple.600),theme(colors.yellow.600))]"
          onClick={handleButtonClick}
        >
          <p className="text-white font-semibold text-xl">
            🚀 Join the Waitlist Now!
          </p>
        </button>
        
        <p className="mt-6 text-lg text-yellow-300">
          Don't miss out on this game-changing opportunity. Your future self will thank you!
        </p>
      </div>

      <WaitlistModal 
        modalId="cta3" 
        onClose={() => document.getElementById('cta3').close()} 
      />
    </section>
  )
}

export default WhyNow