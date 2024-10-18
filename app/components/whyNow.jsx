"use client"
import { useState } from 'react'
import { motion } from 'framer-motion';
import WaitlistModal from './WaitlistModal';

const WhyNow = () => {
  const [selectedPlan, setSelectedPlan] = useState('lifetime');

  const handleButtonClick = () => {
    document.getElementById('cta3').showModal();
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8">
          🚀 <span className="text-[#58CC02]">Unlock Your Learning Potential</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className={`bg-white p-6 rounded-xl shadow-lg transform transition duration-300 border-2 ${selectedPlan === 'lifetime' ? 'border-[#58CC02] scale-105' : 'border-gray-200 hover:scale-105'}`}
               onClick={() => setSelectedPlan('lifetime')}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, loop: Infinity }} className="text-5xl mb-4">🌟</motion.div>
            <h3 className="text-2xl font-bold mb-2 text-[#4b4b4b]">Lifetime Deal</h3>
            <p className="text-4xl font-bold mb-2 text-[#58CC02]">
              <span className="line-through text-gray-400 text-2xl">$50</span> $20
            </p>
            <p className="text-lg mb-4 text-gray-600">One-time payment for lifetime access</p>
            <ul className="text-left text-sm mb-4 text-gray-600">
              <li>✅ Unlimited flashcard creation</li>
              <li>✅ Advanced study analytics</li>
              <li>✅ Priority customer support</li>
              <li>✅ All future updates included</li>
            </ul>
            <p className="text-[#58CC02] font-bold">Best Value!</p>
          </div>
          
          <div className={`bg-white p-6 rounded-xl shadow-lg transform transition duration-300 border-2 ${selectedPlan === 'yearly' ? 'border-[#58CC02] scale-105' : 'border-gray-200 hover:scale-105'}`}
               onClick={() => setSelectedPlan('yearly')}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1, loop: Infinity }} className="text-5xl mb-4">📚</motion.div>
            <h3 className="text-2xl font-bold mb-2 text-[#4b4b4b]">Yearly Subscription</h3>
            <p className="text-4xl font-bold mb-2 text-[#58CC02]">$30/year</p>
            <p className="text-lg mb-4 text-gray-600">Billed annually</p>
            <ul className="text-left text-sm mb-4 text-gray-600">
              <li>✅ Unlimited flashcard creation</li>
              <li>✅ Basic study analytics</li>
              <li>✅ Standard customer support</li>
            </ul>
            <p className="text-[#58CC02] font-bold">Great for students!</p>
          </div>
        </div>
        
        <button 
          className="px-8 py-4 bg-[#58CC02] text-white font-bold text-xl rounded-2xl shadow-md hover:bg-[#46a302] transition-colors duration-300 transform hover:scale-105"
          onClick={handleButtonClick}
        >
          🚀 Get {selectedPlan === 'lifetime' ? 'Lifetime Access' : 'Yearly Subscription'} Now!
        </button>
        
        <p className="mt-6 text-lg text-gray-600">
          Don't miss out on these amazing pricing options. Supercharge your learning today!
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
