"use client"
import IframeComponent from './iFrameComponent';
import WaitlistModal from './WaitlistModal';

const WhyThis = () => {

  const handleButtonClick = () => {
    document.getElementById('cta3').showModal();
  };

  const benefits = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Solve Your Study Struggles",
      description: "End the frustration of juggling multiple tools and ineffective study methods.",
      color: "#60A5FA",
    },
    {
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      title: "Maximize Your Learning",
      description: "Leverage proven techniques to remember more and study smarter.",
      color: "#4ADE80",
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Save Time and Effort",
      description: "Enjoy a streamlined process that simplifies your study routine.",
      color: "#FACC15",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#050520] to-[#0a0a40] rounded-[45px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12">
          Why You Need This:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div style={{ backgroundColor: `${benefit.color}33` }} className="p-3 rounded-full mb-6">
                  <svg style={{ color: benefit.color }} className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <h3 style={{ color: benefit.color }} className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-300 text-lg">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Revolutionize Your Study Habits?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our exclusive waitlist and be the first to experience a learning platform that adapts to you, 
            not the other way around. Don't just study harder — study smarter.
          </p>
          <button onClick={handleButtonClick} className="px-9 py-5 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 bg-[length:100%_100%] bg-[linear-gradient(45deg,theme(colors.purple.500),theme(colors.yellow.500))] hover:bg-[linear-gradient(45deg,theme(colors.purple.600),theme(colors.yellow.600))]">
            <p className="text-white font-semibold text-xl">
              Join the Waitlist Now
            </p>
          </button>
        </div>
      </div>

      <WaitlistModal 
        modalId="cta3" 
        onClose={() => document.getElementById('cta3').close()} 
      />

    </section>
  );
};

export default WhyThis;