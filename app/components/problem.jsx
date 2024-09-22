"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import IframeComponent from './iFrameComponent';

const Problem = ({ backgroundColor }) => {
  const ref = useRef(null);
  const parallaxRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  const handleButtonClick = () => {
    document.getElementById('cta1').showModal();
  };

  return (
    <section ref={parallaxRef} className={`relative z-10 flex items-center py-16 md:py-24 ${backgroundColor}`} id="problem">
      <motion.div
        ref={ref}
        style={{ opacity }}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 md:mb-12 text-center"
          >
            Feeling Overwhelmed by Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Study Routine?</span>
          </motion.h2>
          <div className="space-y-6 md:space-y-8 text-gray-300 text-base md:text-lg">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              If you're like many students and professionals, your Notion workspace is full of notes, but studying and retaining that information feels like a struggle. You've tried different methods—flashcard apps, separate tools, even traditional notecards— <strong className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">but nothing sticks.</strong> Constantly switching between tools adds frustration, making the process disjointed.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Despite your organized Notion notes, switching between apps to study feels frustrating and time-consuming. Traditional flashcard methods seem outdated, and managing multiple tools breaks your flow. Study sessions become a juggling act—re-reading notes here, creating flashcards there, and no real retention in the end.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-white font-semibold text-lg md:text-xl p-4 md:p-6 rounded-lg shadow-xl backdrop-filter backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-30"
            >
              Now, imagine <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">staying in Notion and instantly turning your notes into interactive flashcards.</span> No more switching between apps or wasting time on manual processes. With just a few clicks, you can convert Notion pages into dynamic learning tools, making your study sessions smoother and more effective. 
            </motion.p>  
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 md:mt-12 flex justify-center"
          >
            <button
              className="px-6 py-3 md:px-9 md:py-5 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600 shadow-lg"
              onClick={handleButtonClick}
            >
              <p className="text-white font-semibold text-lg md:text-xl">
                Take your learning to the next level
              </p>
            </button>
          </motion.div>
        </div>
        <dialog id="cta1" className="modal">
          <div className="modal-box w-11/12 max-w-4xl p-4 md:p-8 relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl border-4 border-purple-400 shadow-2xl">
            <button onClick={() => document.getElementById('cta1').close()} className="absolute top-2 right-2 text-white hover:text-purple-300">
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
      </motion.div>
    </section>
  )
}

export default Problem
