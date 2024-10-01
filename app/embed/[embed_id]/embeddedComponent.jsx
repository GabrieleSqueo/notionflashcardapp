"use client"
import { useState, useEffect } from 'react'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

export default function EmbeddedComponent({ embed_id }) {
  const [flashcards, setFlashcards] = useState([])
  const [error, setError] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/get-flashcards?set_id=${embed_id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards')
        }
        const data = await response.json()
        setFlashcards(data.content)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchContent()
  }, [embed_id])

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleButtonClick = (e, action) => {
    const button = e.currentTarget;
    button.classList.add('active');
    
    const removeActiveClass = () => {
      button.classList.remove('active');
    };

    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        removeActiveClass();
        action();
      });
    });

    // Fallback timeout in case the button is still in the DOM
    setTimeout(removeActiveClass, 150);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>
  }

  if (flashcards.length === 0) {
    return <div className="text-gray-500 text-center p-4">It seems a bit empty here...</div>
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className={`flex flex-col items-center justify-between w-full h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#2F3438] text-white' : 'bg-white'}`}>
      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center perspective">
        <div 
          className={`relative w-full h-full max-h-[70vh] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={toggleFlip}
        >
          <div className={`absolute w-full h-full backface-hidden rounded-lg shadow-xl p-6 flex items-center justify-center cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {currentCard.front}
            </p>
          </div>
          <div className={`absolute w-full h-full backface-hidden rounded-lg shadow-xl p-6 flex items-center justify-center rotate-y-180 cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 w-full max-w-4xl">
        <button 
          onClick={(e) => handleButtonClick(e, prevCard)} 
          className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-[0_5px_0_rgb(18,142,63)] text-xl md:text-2xl font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(18,142,63)] active:translate-y-[5px]"
        >
          ← Prev
        </button>
        <p className={`text-center text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Card {currentCardIndex + 1} of {flashcards.length}
        </p>
        <button 
          onClick={(e) => handleButtonClick(e, nextCard)} 
          className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-[0_5px_0_rgb(18,142,63)] text-xl md:text-2xl font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(18,142,63)] active:translate-y-[5px]"
        >
          Next →
        </button>
      </div>
      <button 
        onClick={(e) => handleButtonClick(e, toggleDarkMode)} 
        className="mt-4 p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none transition-all duration-150 active:shadow-[0_0_0_rgb(202,138,4)] active:translate-y-[5px]"
      >
        {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>
    </div>
  )
}