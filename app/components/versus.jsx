"use client"
import { useState, useEffect, useRef } from 'react'
import Term from "../assets/Term.png";
import Definition from "../assets/Definition.png";
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import WaitlistModal from './WaitlistModal';

const Versus = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    const handleMouseMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleButtonClick = () => {
    document.getElementById('cta2').showModal();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <section ref={ref} className="py-28 px-4 sm:px-6 lg:px-8 rounded-3xl relative overflow-hidden">
      <motion.div 
        className="max-w-6xl mx-auto z-30 relative"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 
          className="text-4xl sm:text-5xl font-bold text-white mb-12 text-center"
          variants={itemVariants}
        >
          Us vs. Quizlet: <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-yellow-500 z-50">Why Stay in Notion?</span>
        </motion.h2>
        <motion.div 
          className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border glass border-white/10 shadow-lg"
          variants={itemVariants}
        >
          <table className="w-full z-40">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-2xl font-bold pb-4 text-left text-purple-300">Feature</th>
                <th className="text-2xl font-bold pb-4 text-center text-purple-300">Us</th>
                <th className="text-2xl font-bold pb-4 text-center text-purple-300">Quizlet</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 text-lg font-semibold">
              {[
                ["Fully integrates with Notion", true, false],
                ["Create flashcards directly in Notion", true, false],
                ["No need to switch between apps", true, false],
                ["Customized learning experience", true, true],
                ["Interactive embedded flashcards", true, false],
                ["Variety of study modes", true, true],
              ].map(([feature, ourSolution, quizlet], index) => (
                <motion.tr 
                  key={index} 
                  className={`border-b border-white/10 last:border-b-0 transition-colors duration-300 ${hoveredFeature === index ? 'bg-white/20' : ''}`}
                  onMouseEnter={() => setHoveredFeature(index)} 
                  onMouseLeave={() => setHoveredFeature(null)}
                  variants={itemVariants}
                >
                  <td className="py-4">{feature}</td>
                  <td className="py-4 text-center">
                    {ourSolution ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    {quizlet ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
      <motion.div 
        className="mt-12 flex justify-center z-10"
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <button 
          className="px-9 py-5 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600 shadow-lg"
          onClick={handleButtonClick}
        >
          <p className="text-white font-semibold text-xl">
            Take your learning to the next level
          </p>
        </button>
      </motion.div>
      <div className="absolute w-screen pointer-events-none">
        <motion.div
          style={{ transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)` }}
        >
          <Image
            src={Term}
            alt="Term logo"
            className="absolute -top-[600px] left-10 filter blur-sm w-24 sm:w-48 lg:w-72 xl:w-96 opacity-30 hidden md:inline z-20"
          />
        </motion.div>
        <motion.div
          style={{ transform: `translate(${mouse.x * 0.01}px, ${mouse.y * 0.01}px)` }}
        >
          <Image
            src={Definition}
            alt="Definition logo"
            className="absolute -top-0 right-24 filter blur-sm w-24 sm:w-48 lg:w-72 xl:w-96 opacity-30 hidden md:inline z-20"
          />
        </motion.div>
      </div>
      <WaitlistModal 
        modalId="cta2" 
        onClose={() => document.getElementById('cta2').close()} 
      />
    </section>
  )
}

export default Versus