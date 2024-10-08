'use client'

import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { MdLightMode, MdDarkMode } from 'react-icons/md'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

export default function InsightComponent({ embed_id }) {
  const [insightData, setInsightData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeChart, setActiveChart] = useState('pie')

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
  }, [embed_id]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  if (loading) return (
    <div className={`flex items-center justify-center w-full h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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

  // Pie chart data
  const pieData = {
    labels: ['Correct (3-4)', 'Incorrect (1-2)'],
    datasets: [{
      data: [
        processedData.reduce((sum, session) => sum + session.scores.filter(score => score >= 3).length, 0),
        processedData.reduce((sum, session) => sum + session.scores.filter(score => score < 3).length, 0)
      ],
      backgroundColor: ['#4CAF50', '#FF5252']
    }]
  };

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
        text: activeChart === 'pie' ? 'Overall Performance' : 'Performance Over Time',
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
    <div className={`flex flex-col items-center justify-between w-full h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#191919] text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-4">Flashcard Insights</h1>
      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center">
        <div className="w-full h-[60vh]">
          {activeChart === 'pie' ? (
            <Pie data={pieData} options={chartOptions} />
          ) : (
            <Line data={lineData} options={chartOptions} />
          )}
        </div>
      </div>
      <div className="w-full max-w-4xl mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setActiveChart('pie')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeChart === 'pie'
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
      <button 
        onClick={toggleDarkMode} 
        className="mt-4 p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none"
      >
        {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>
    </div>
  )
}