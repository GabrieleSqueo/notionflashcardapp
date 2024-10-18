"use client"
import { motion } from 'framer-motion';
import Navbarone from './navbarone';
import { MdAddCircle, MdPlayArrow } from 'react-icons/md';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-white overflow-hidden">
      <Navbarone />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-44 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Notion Notes
              </span>
              Into Flashcards
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Boost retention and accelerate your study process with our dynamic, AI-powered flashcard system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button 
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] overflow-hidden flex items-center justify-center"
                onClick={() => document.getElementById('cta3').showModal()}
              >
                <MdAddCircle className="mr-2 h-6 w-6" />
                Get Started Now
              </button>
              <button 
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl shadow-[0_3px_0_rgb(203,213,225)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(203,213,225)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[3px] overflow-hidden flex items-center justify-center"
              >
                <MdPlayArrow className="mr-2 h-6 w-6" />
                Watch Demo
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:w-1/2 w-full max-w-lg mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 transform -rotate-6 rounded-3xl border border-white/10 shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden"></div>
              <div className="relative bg-white border rounded-xl shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden">
                <iframe
                  id="example-embed"
                  src="https://www.notionflashcard.com/embed/18d32144-e5f5-448a-8be8-e55c34749c91?mode=light"
                  className="w-full h-[500px] sm:h-[600px]"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
