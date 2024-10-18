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
    <div id='solution' className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-100 to-white p-8" ref={ref}>
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div 
          className="max-w-6xl mx-auto relative z-10 flex flex-wrap justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-extrabold mb-12 text-center w-full text-gray-900"
            variants={itemVariants}
          >
            Why Our Solution is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Perfect for You</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center w-full">
            {[
              {
                title: "All-in-One Solution",
                description: "Create and review flashcards directly within Notion.",
                icon: "🚀",
                color: "#4b4b4b"
              },
              {
                title: "Effortless Conversion",
                description: "Transform your Notion notes into interactive flashcards with just a few clicks.",
                icon: "🔄",
                color: "#4b4b4b"
              },
              {
                title: "Enhanced Learning",
                description: "Boost retention with spaced repetition and customizable quizzes.",
                icon: "📈",
                color: "#4b4b4b"
              },
              {
                title: "Proven Effectiveness",
                description: "Our method is based on educational research that enhances memory retention and learning outcomes.",
                icon: "🏆",
                color: "#4b4b4b"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="w-full max-w-md bg-white border rounded-xl shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden"
                variants={itemVariants}
              >
                <div className="px-8 py-6">
                  <div className="flex items-center flex-col mb-4">
                    <div className="text-6xl mb-3">{item.icon}</div>
                    <h3 className={`text-2xl font-bold text-${item.color} block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600`}>{item.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 text-center">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Solution;
