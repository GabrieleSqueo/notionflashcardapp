"use client"
import WaitlistModal from './WaitlistModal';

const WhyThis = () => {
  const handleButtonClick = () => {
    document.getElementById('cta3').showModal();
  };

  const benefits = [
    {
      icon: "🚀",
      title: "Solve Your Study Struggles",
      description: "End the frustration of juggling multiple tools and ineffective study methods.",
      color: "#58CC02",
    },
    {
      icon: "💡",
      title: "Maximize Your Learning",
      description: "Leverage proven techniques to remember more and study smarter.",
      color: "#FF4B4B",
    },
    {
      icon: "⏱️",
      title: "Save Time and Effort",
      description: "Enjoy a streamlined process that simplifies your study routine.",
      color: "#1CB0F6",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#4b4b4b] text-center mb-12">
          Why You Need This:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 transform hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 style={{ color: benefit.color }} className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#4b4b4b] mb-6">Ready to Revolutionize Your Study Habits?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our exclusive waitlist and be the first to experience a learning platform that adapts to you, 
            not the other way around. Don't just study harder — study smarter.
          </p>
          <button 
            onClick={handleButtonClick} 
            className="px-8 py-4 bg-[#58CC02] text-white font-bold text-xl rounded-2xl shadow-md hover:bg-[#46a302] transition-colors duration-300 transform hover:scale-105"
          >
            Join the Waitlist Now
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
