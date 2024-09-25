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
      {/* ... (rest of the JSX remains the same) ... */}
    </div>
  )
}