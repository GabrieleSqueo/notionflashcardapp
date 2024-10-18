"use client"
import { motion } from 'framer-motion';
import { MdInsights } from 'react-icons/md';

const Gamification = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50 to-purple-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:w-1/2 w-full max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 transform -rotate-6 rounded-3xl border border-white/10 shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden"></div>
              <div className="relative bg-white border rounded-xl shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden">
                <iframe
                  id="insight-embed"
                  src="https://www.notionflashcard.com/embed/18d32144-e5f5-448a-8be8-e55c34749c91?mode=light&insight=true"
                  className="w-full h-[400px] sm:h-[500px]"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Enhance Your Learning with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Gamification
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Turn your study sessions into a game with our insight embed feature. Track your progress, earn rewards, and stay motivated like never before.
            </p>
            <button 
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] overflow-hidden flex items-center justify-center"
            >
              <MdInsights className="mr-2 h-6 w-6" />
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
