import Marquee from 'react-fast-marquee';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="text-center py-4">
        made with love ❤️ by 
        <a href="https://www.instagram.com/landriluca_/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> Luca Landriscina </a> 
          and 
        <a href="https://www.instagram.com/squeogabriele/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> Gabriele Squeo </a>
      </div>
      <Marquee
        gradient={false}
        speed={50}
        className="py-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      >
        {[...Array(10)].map((_, index) => (
          <span key={index} className="text-3xl md:text-4xl font-black mx-6">
            📚 LEARNING MADE SIMPLE 🧠 •
          </span>
        ))}
      </Marquee>
    </footer>
  )
}

export default Footer