"use client"
import { motion } from 'framer-motion';
import WaitlistModal from './WaitlistModal';
import { FaRocket, FaBook, FaCheckCircle } from 'react-icons/fa';

const WhyNow = () => {
  const handleButtonClick = (plan) => {
    if (plan === "lifetime") {
      window.location.href = "https://buy.stripe.com/8wM7uX51TeEsdCU6oo";
    } else if (plan === "yearly") {
      window.location.href = "https://buy.stripe.com/bIY8z12TL0NC2YgfYZ";
    } else {
      document.getElementById('cta3').showModal();
    }
  };

  return (
    <section id='whyNow' className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-100 via-blue-50 to-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900">
          🚀 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Unlock Your Learning Potential</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-[0_5px_0_rgb(203,213,225)] border-2 border-indigo-600 scale-105 transition-all duration-150">
            <div className="flex items-center justify-center mb-4 text-indigo-600">
              <FaRocket className="text-5xl mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">Lifetime Deal</h3>
            </div>
            <p className="text-4xl font-bold mb-2 text-indigo-600">
              <span className="line-through text-gray-400 text-2xl">$50</span> $20
            </p>
            <p className="text-lg mb-4 text-gray-600">One-time payment for lifetime access</p>
            <ul className="text-left text-lg mb-4 text-gray-600">
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Unlimited flashcard creation</li>
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Advanced study analytics</li>
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Priority customer support</li>
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> All future updates included</li>
            </ul>
            <div className="mt-6">
              <button 
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-600 hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[1px]"
                onClick={() => handleButtonClick('lifetime')}
              >
                Select Lifetime Deal
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-[0_5px_0_rgb(203,213,225)] border-2 border-gray-200">
            <div className="flex items-center justify-center mb-4 text-indigo-600">
              <FaBook className="text-5xl mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">Yearly Subscription</h3>
            </div>
            <p className="text-4xl font-bold mb-2 text-indigo-600">$30/year</p>
            <p className="text-lg mb-4 text-gray-600">Billed annually</p>
            <ul className="text-left text-lg mb-4 text-gray-600">
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Unlimited flashcard creation</li>
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Basic study analytics</li>
              <li><FaCheckCircle className="inline text-indigo-600 mr-2" /> Standard customer support</li>
            </ul>
            <div className="mt-6">
              <button 
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-lg font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-600 hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[1px]"
                onClick={() => handleButtonClick('yearly')}
              >
                Select Yearly Subscription
              </button>
            </div>
          </div>
        </div>
        
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

export default WhyNow;
