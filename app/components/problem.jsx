"use client"
import { motion } from 'framer-motion';
import { MdAddCircle } from 'react-icons/md';
import WaitlistModal from './WaitlistModal';

const Problem = () => {
  const handleButtonClick = () => {
    document.getElementById('cta1').showModal();
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50 to-purple-100 overflow-hidden" id="problem">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Feeling Overwhelmed by Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Study Routine?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            If you're like many students and professionals, your Notion workspace is full of notes, but studying and retaining that information feels like a struggle. You've tried different methods—flashcard apps, separate tools, even traditional notecards— <strong className="text-indigo-600">but nothing sticks.</strong> Constantly switching between tools adds frustration, making the process disjointed.
          </p>
          <div className="mb-10 p-8 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto">
            <p className="text-lg text-gray-800 mb-4">
              Despite your organized Notion notes, switching between apps to study feels frustrating and time-consuming. Traditional flashcard methods seem outdated, and managing multiple tools breaks your flow. Study sessions become a juggling act—re-reading notes here, creating flashcards there, and no real retention in the end.
            </p>
            <p className="text-xl text-gray-800 font-semibold">
              Now, imagine <span className="text-indigo-600">staying in Notion and instantly turning your notes into interactive flashcards.</span> No more switching between apps or wasting time on manual processes. With just a few clicks, you can convert Notion pages into dynamic learning tools, making your study sessions smoother and more effective.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <button 
              className="px-8 py-4 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] overflow-hidden flex items-center justify-center mx-auto"
              onClick={handleButtonClick}
            >
              <MdAddCircle className="mr-2 h-6 w-6" />
              Take your learning to the next level
            </button>
          </motion.div>
        </motion.div>
      </div>
      <WaitlistModal 
        modalId="cta1" 
        onClose={() => document.getElementById('cta1').close()} 
      />
    </section>
  )
}

export default Problem
