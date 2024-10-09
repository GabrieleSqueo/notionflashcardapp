'use client'

import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { useSearchParams, usePathname } from 'next/navigation'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

export default function InsightComponent({ embed_id }) {
  const [insightData, setInsightData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeChart, setActiveChart] = useState('overall')
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/get_datas?flashcardSetId=${embed_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setInsightData(data.scoresData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Check URL for dark mode parameter
    const mode = searchParams.get('mode')
    if (mode === 'dark') {
      setIsDarkMode(true)
    }
  }, [embed_id, searchParams]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    // Update URL with new mode
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('mode', newMode ? 'dark' : 'light')
    window.history.pushState(null, '', `${pathname}?${newSearchParams.toString()}`)
  }

  if (loading) return (
    <div className={`flex items-center justify-center w-full h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col items-center">
        <div className="loader"></div>
        <p className="mt-4 text-lg">Loading, please wait...</p>
      </div>
      <style jsx>{`
        .loader {
          border: 16px solid ${isDarkMode ? '#444' : '#f3f3f3'};
          border-top: 16px solid ${isDarkMode ? '#3498db' : '#3498db'};
          border-radius: 50%;
          width: 80px;
          height: 80px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )

  if (error) return (
    <div className={`flex items-center justify-center w-full h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="text-red-500 text-center p-4">Error: {error}</div>
    </div>
  )

  if (!insightData || insightData.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center w-full h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No data available yet</h2>
          <p className="mb-6">
            Complete some flashcard sessions to see your insights here!
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

  // Process data for charts
  const processedData = insightData.map(session => ({
    date: new Date(session.date),
    scores: session.scores,
    averageScore: session.scores.reduce((a, b) => a + b, 0) / session.scores.length,
    percentageRight: session.scores.filter(score => score >= 3).length / session.scores.length * 100
  })).sort((a, b) => a.date - b.date);

  // Overall performance data
  const overallData = {
    labels: ['Correct (3-4)', 'Incorrect (1-2)'],
    datasets: [{
      data: [
        processedData.reduce((sum, session) => sum + session.scores.filter(score => score >= 3).length, 0),
        processedData.reduce((sum, session) => sum + session.scores.filter(score => score < 3).length, 0)
      ],
      backgroundColor: ['#4CAF50', '#FF5252']
    }]
  };

  // Today's performance data
  const today = new Date().setHours(0, 0, 0, 0);
  const todayData = processedData.find(session => session.date.setHours(0, 0, 0, 0) === today);
  const todayPerformance = todayData ? {
    labels: ['Correct (3-4)', 'Incorrect (1-2)'],
    datasets: [{
      data: [
        todayData.scores.filter(score => score >= 3).length,
        todayData.scores.filter(score => score < 3).length
      ],
      backgroundColor: ['#4CAF50', '#FF5252']
    }]
  } : null;

  // Line chart data
  const lineData = {
    labels: processedData.map(session => session.date.toLocaleDateString()),
    datasets: [{
      label: 'Average Score',
      data: processedData.map(session => session.averageScore),
      borderColor: '#2196F3',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDarkMode ? 'white' : 'black'
        }
      },
      title: {
        display: true,
        text: activeChart === 'overall' ? 'Overall Performance' : 'Performance Over Time',
        color: isDarkMode ? 'white' : 'black'
      }
    },
    scales: activeChart === 'line' ? {
      y: {
        beginAtZero: true,
        max: 4,
        ticks: {
          color: isDarkMode ? 'white' : 'black'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? 'white' : 'black'
        }
      }
    } : {}
  };

  return (
    <div className={`relative flex flex-col items-center justify-between w-full h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-white text-gray-900'}`}>
      {/* Dark/Light mode toggle button */}
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-4 right-4 p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
      >
        {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>

      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center">
        {activeChart === 'overall' ? (
          <div className="w-full flex justify-between">
            <div className="w-1/2 h-[60vh]">
              <h3 className="text-center mb-2 text-xl font-bold">Overall Performance</h3>
              <Pie data={overallData} options={chartOptions} />
            </div>
            <div className="w-1/2 h-[60vh]">
              <h3 className="text-center mb-2 text-xl font-bold">Today's Performance</h3>
              {todayPerformance ? (
                <Pie data={todayPerformance} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No data available for today</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-[60vh]">
            <Line data={lineData} options={chartOptions} />
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setActiveChart('overall')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeChart === 'overall'
              ? 'bg-blue-500 text-white shadow-[0_3px_0_rgb(37,99,235)]'
              : 'bg-gray-200 text-gray-700 shadow-[0_3px_0_rgb(156,163,175)]'
          }`}
        >
          Overall Performance
        </button>
        <button
          onClick={() => setActiveChart('line')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeChart === 'line'
              ? 'bg-blue-500 text-white shadow-[0_3px_0_rgb(37,99,235)]'
              : 'bg-gray-200 text-gray-700 shadow-[0_3px_0_rgb(156,163,175)]'
          }`}
        >
          Performance Over Time
        </button>
      </div>
    </div>
  )
}