"use client"
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Solution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r p-8" ref={ref}>
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="solution">
        <motion.div 
          className="max-w-6xl mx-auto relative z-10 flex flex-wrap justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-12 text-center w-full"
            variants={itemVariants}
          >
            Why Our Solution is <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-yellow-500">Perfect for You</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center w-full">
            {[
              {
                title: "All-in-One Solution",
                description: "Delete juggling multiple tools. Create and review flashcards directly within Notion.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                color: "text-blue-300"
              },
              {
                title: "Effortless Conversion",
                description: "Transform your Notion notes into interactive flashcards with just a few clicks—no extra software needed.",
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                color: "text-green-300"
              },
              {
                title: "Enhanced Learning",
                description: "Boost retention with spaced repetition and customizable quizzes, making your study sessions more effective and engaging.",
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707-.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                color: "text-purple-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white/10 max-w-xl rounded-xl p-6 backdrop-blur-sm border border-white/10 transform transition duration-300 hover:scale-105"
                variants={itemVariants}
              >
                <div className="flex items-center flex-col mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-md mb-3">
                    <svg className={`w-8 h-8 ${item.color} bg-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-semibold ${item.color}`}>{item.title}</h3>
                </div>
                <p className="text-gray-200">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center mt-8 w-full">
            {[
              {
                title: "No More App-Switching",
                description: "Unlike other tools that require additional software or complex processes, our solution allows you to convert your Notion notes into interactive flashcards with just a few clicks. It's designed to save you time and reduce frustration, making your study routine more efficient.",
                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                color: "text-pink-300"
              },
              {
                title: "Proven Effectiveness",
                description: "Our method is based on educational research that enhances memory retention and learning outcomes. With our solution, studying becomes more interactive, effective, and engaging—giving you the results other methods simply can't.",
                icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
                color: "text-purple-300"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white/10 max-w-xl rounded-xl p-6 backdrop-blur-sm border border-white/10 transform transition duration-300 hover:scale-105"
                variants={itemVariants}
              >
                <div className="flex items-center flex-col mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-md mb-3">
                    <svg className={`w-8 h-8 ${item.color} bg-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-semibold ${item.color}`}>{item.title}</h3>
                </div>
                <p className="text-gray-200">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Solution;
