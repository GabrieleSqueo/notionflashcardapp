import Image from 'next/image'
import Link from 'next/link'
import us from '../assets/us.png'
import { FaInstagram } from 'react-icons/fa'

const AboutUsOne = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-purple-100 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-900 mb-16 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Meet the Creators</span>
        </h2>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_5px_0_rgb(203,213,225)] border border-gray-200 group">
              <Image
                src={us}
                alt="Gabriele and Luca"
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                <h3 className="text-3xl font-bold text-white text-center">
                  Gabriele & Luca
                </h3>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-8">
            <h3 className="text-4xl font-semibold text-gray-900 mb-6">
              Our Story
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're two friends from Apulia, Italy, who met in high school and bonded over our shared passion for coding and business. As we grew, our conversations evolved from typical teenage topics to exciting discussions about entrepreneurship, coding, and marketing.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              In 2024, we decided to embark on a journey together, building our SaaS products in public. Crammate is our first creation, and while we're uncertain about its future or what we'll build next, we're thrilled about the learning experience and the adventures that lie ahead.
            </p>
            <div className="pt-6">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6">Follow Our Journey</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <SocialLink 
                  href="https://www.instagram.com/sololandri/" 
                  icon={<FaInstagram />} 
                  label="Luca's Instagram" 
                  color="bg-[#FF4B4B]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SocialLink = ({ href, icon, label, color }) => (
  <Link 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`group relative overflow-hidden rounded-xl ${color} p-1 transition-all duration-300 hover:opacity-90 hover:scale-105`}
    aria-label={label}
  >
    <div className="relative flex items-center space-x-3 px-4 py-2">
      <span className="text-2xl text-white group-hover:animate-bounce">{icon}</span>
      <span className="font-semibold text-white">{label}</span>
    </div>
  </Link>
)

export default AboutUsOne
