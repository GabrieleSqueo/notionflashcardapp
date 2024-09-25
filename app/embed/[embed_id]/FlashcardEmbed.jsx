"use client"
import { useState, useEffect } from 'react'

export default function FlashcardEmbed({ embed_id }) {
  const [flashcards, setFlashcards] = useState([])
  const [error, setError] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

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

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>
  }

  if (flashcards.length === 0) {
    return <div className="text-gray-500 text-center p-4">Loading flashcards...</div>
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center perspective">
        <div 
          className={`relative w-full h-full max-h-[70vh] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={toggleFlip}
        >
          <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-xl p-6 flex items-center justify-center cursor-pointer">
            <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center text-black">
              {currentCard.front}
            </p>
          </div>
          <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-xl p-6 flex items-center justify-center rotate-y-180 cursor-pointer">
            <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center text-black">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 w-full max-w-4xl">
        <button onClick={prevCard} className="text-blue-600 hover:text-blue-800 focus:outline-none text-xl md:text-2xl">
          ← Prev
        </button>
        <p className="text-center text-sm md:text-base text-gray-600">
          Card {currentCardIndex + 1} of {flashcards.length}
        </p>
        <button onClick={nextCard} className="text-blue-600 hover:text-blue-800 focus:outline-none text-xl md:text-2xl">
          Next →
        </button>
      </div>
    </div>
  )
}