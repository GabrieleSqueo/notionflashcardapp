"use client"
import { motion } from 'framer-motion';
import IframeComponent from './iFrameComponent';
import Navbarone from './navbarone';

const Hero = ({ backgroundColor }) => {
  return (
    <div className={`relative min-h-screen ${backgroundColor}`}>
      <Navbarone />
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,0 C30,20 70,20 100,0 L100,100 0,100 Z"
            fill="rgba(128, 90, 213, 0.1)"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,100 C30,80 70,80 100,100 L100,0 0,0 Z"
            fill="rgba(236, 72, 153, 0.1)"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: ["-20%", "120%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full space-y-6 md:space-y-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
            className="backdrop-filter backdrop-blur-md bg-white bg-opacity-10 rounded-full py-2 px-4 md:px-6 inline-block border border-white border-opacity-30"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-bold text-sm md:text-lg">
              Announcing Private Beta
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-extrabold text-white leading-tight"
          >
            <span className="block">Less Confusion</span>
            
            <span className="text-7xl block pb-2  bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 ">Higher Grades</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Transform your Notion notes into dynamic, interactive learning tools. Boost retention and accelerate your study process with our flashcards.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 md:mt-10"
          >
            <IframeComponent />
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 md:mt-16 flex flex-col items-center"
        >
          <p className="text-white text-base md:text-lg mb-4">Discover why our flashcards are <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">PERFECT FOR YOU</span></p>
          <a href="#problem" className="animate-bounce">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-white cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;