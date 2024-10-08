"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import IframeComponent from './iFrameComponent';
import WaitlistModal from './WaitlistModal';

const Problem = () => {
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
    <section ref={parallaxRef} className="relative z-10 flex items-center py-16 md:py-24 bg-gradient-to-b from-[#050520] to-[#0a0a40]" id="problem">
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
            <WaitlistModal 
              modalId="cta1" 
              onClose={() => document.getElementById('cta1').close()} 
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Problem
