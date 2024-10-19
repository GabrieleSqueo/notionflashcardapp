"use client"
import { useState, useEffect } from 'react'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { calculateScore, getScoreLabel, getScoreColor } from './scoringLogic'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useSearchParams, usePathname } from 'next/navigation'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function EmbeddedComponent({ embed_id }) {
  const [flashcards, setFlashcards] = useState([])
  const [error, setError] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [scores, setScores] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [revealedWords, setRevealedWords] = useState([])

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

    // Check URL for dark mode parameter
    const mode = searchParams.get('mode')
    if (mode === 'dark') {
      setIsDarkMode(true)
    }
  }, [embed_id, searchParams])

  const handleWordClick = (index) => {
    if (!revealedWords.includes(index)) {
      setRevealedWords([...revealedWords, index])
    }
  }

  const resetCard = () => {
    setRevealedWords([])
    setIsFlipped(false)
  }

  const nextCard = (score) => {
    setScores(prevScores => [...prevScores, score])
    resetCard()

    if (currentCardIndex === flashcards.length - 1) {
      setShowResults(true)
      saveScores([...scores, score]) // Save scores including the last one
    } else {
      setCurrentCardIndex(prevIndex => prevIndex + 1)
    }
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    // Update URL with new mode
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('mode', newMode ? 'dark' : 'light')
    window.history.pushState(null, '', `${pathname}?${newSearchParams.toString()}`)
  }

  const saveScores = async (finalScores) => {
    try {
      const response = await fetch('/api/save-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardSetId: embed_id,
          scores: finalScores,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save scores');
      }

      console.log('Scores saved successfully');
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  };

  const handleScoreClick = (score) => {
    nextCard(score);
  };

  const resetQuiz = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setScores([])
    setShowResults(false)
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>
  }

  if (flashcards.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center w-full h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-white'}`}>
        <div className="text-center max-w-md">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>It seems a bit empty here...</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            This flashcard set doesn't have any cards yet. Why not add some to start learning?
          </p>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="mt-8 p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none"
        >
          {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
      </div>
    )
  }

  if (showResults) {
    const scoreCounts = scores.reduce((acc, score) => {
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {});

    const labels = ["Don't know", "Need to review", "Almost got it", "Know it!"];
    const data = {
      labels,
      datasets: [
        {
          label: 'Number of Cards',
          data: labels.map((_, index) => scoreCounts[index + 1] || 0),
          backgroundColor: labels.map((_, index) => getScoreColor(index + 1)),
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            font: {
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // This line removes the legend
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} cards`;
            }
          }
        }
      }
    }

    return (
      <div className={`flex flex-col items-center justify-between w-full min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-white'}`}>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Your Results</h2>
        <div className="w-full h-[70vh] sm:h-[80vh]">
          <Bar data={data} options={options} />
        </div>
        <button 
          onClick={resetQuiz}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-700"
        >
          Restart Quiz
        </button>
      </div>
    )
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className={`relative flex flex-col items-center justify-between w-full min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-white'}`}>
      {/* Dark/Light mode toggle button */}
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-2 right-2 p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
      >
        {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>

      {/* Card number */}
      <p className={`mt-8 mb-2 text-center text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Card {currentCardIndex + 1} of {flashcards.length}
      </p>

      <div className="w-full max-w-3xl flex-grow flex flex-col justify-center items-center">
        {currentCard.type === 'flashcard' ? (
          <div 
            className={`relative w-full max-w-2xl h-[40vh] sm:h-[50vh] cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} 
            onClick={toggleFlip}
          >
            <div className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-gray-800 shadow-[0_5px_0_rgb(59,130,246)]' 
                : 'bg-gray-100 shadow-[0_5px_0_rgb(34,197,94)]'
            }`}>
              <p className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {currentCard.front}
              </p>
            </div>
            <div className={`absolute w-full h-full backface-hidden rounded-xl p-6 flex items-center justify-center rotate-y-180 ${
              isDarkMode 
                ? 'bg-gray-800 shadow-[0_5px_0_rgb(59,130,246)]' 
                : 'bg-gray-100 shadow-[0_5px_0_rgb(34,197,94)]'
            }`}>
              <p className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {currentCard.back}
              </p>
            </div>
          </div>
        ) : (
          <div className={`w-full max-w-2xl h-[40vh] sm:h-[50vh] rounded-xl p-6 flex items-center justify-center ${
            isDarkMode 
              ? 'bg-gray-800 shadow-[0_5px_0_rgb(59,130,246)]' 
              : 'bg-gray-100 shadow-[0_5px_0_rgb(34,197,94)]'
          }`}>
            <p className={`text-2xl md:text-4xl lg:text-5xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {currentCard.content.split('___').map((part, index) => (
                <span key={index}>
                  {part}
                  {index < currentCard.hiddenWords.length && (
                    <span 
                      onClick={() => handleWordClick(index)}
                      className={`
                        inline-block cursor-pointer rounded px-2 py-1 mx-1
                        transition-all duration-300 ease-in-out
                        ${revealedWords.includes(index) 
                          ? 'bg-green-500 text-white' 
                          : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} text-transparent`}
                        hover:scale-110 hover:shadow-lg
                        animate-wiggle
                      `}
                    >
                      {currentCard.hiddenWords[index].word}
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-4 sm:mt-8 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => handleScoreClick(1)}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-xl shadow-[0_3px_0_rgb(185,28,28)] text-sm font-bold transition-all duration-300 active:shadow-[0_0_0_rgb(185,28,28)] active:translate-y-[3px] hover:bg-red-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Don't know 😕
        </button>
        <button
          onClick={() => handleScoreClick(2)}
          className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-xl shadow-[0_3px_0_rgb(194,65,12)] text-sm font-bold transition-all duration-300 active:shadow-[0_0_0_rgb(194,65,12)] active:translate-y-[3px] hover:bg-orange-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Need to review 🤔
        </button>
        <button
          onClick={() => handleScoreClick(3)}
          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-xl shadow-[0_3px_0_rgb(161,98,7)] text-sm font-bold transition-all duration-300 active:shadow-[0_0_0_rgb(161,98,7)] active:translate-y-[3px] hover:bg-yellow-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
        >
          Almost got it 🙂
        </button>
        <button
          onClick={() => handleScoreClick(4)}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-xl shadow-[0_3px_0_rgb(21,128,61)] text-sm font-bold transition-all duration-300 active:shadow-[0_0_0_rgb(21,128,61)] active:translate-y-[3px] hover:bg-green-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Know it! 😄
        </button>
      </div>
    </div>
  )
}
