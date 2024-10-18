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
      color: "#4b4b4b",
    },
    {
      icon: "💡",
      title: "Maximize Your Learning",
      description: "Leverage proven techniques to remember more and study smarter.",
      color: "#4b4b4b",
    },
    {
      icon: "⏱️",
      title: "Save Time and Effort",
      description: "Enjoy a streamlined process that simplifies your study routine.",
      color: "#4b4b4b",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-100 via-blue-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-12">
          Why You Need This:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-[0_5px_0_rgb(203,213,225)] border hover:shadow-md hover:translate-y-[3px] transition-all duration-150">
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className={`text-2xl font-bold text-${benefit.color} block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600`}>{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Revolutionize Your Study Habits?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our exclusive waitlist and be the first to experience a learning platform that adapts to you, 
            not the other way around. Don't just study harder — study smarter.
          </p>
          <button 
            onClick={handleButtonClick} 
            className="px-8 py-4 bg-indigo-500 text-white font-bold text-xl rounded-xl shadow-[0_3px_0_rgb(67,56,202)] hover:bg-indigo-600 transition-colors duration-300 transform hover:scale-105"
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
