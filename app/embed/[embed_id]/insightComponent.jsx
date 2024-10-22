'use client'

import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'
import { MdLightMode, MdDarkMode, MdCheckCircle, MdStar, MdTrendingUp } from 'react-icons/md'
import { useSearchParams, usePathname } from 'next/navigation'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)

export default function InsightComponent({ embed_id }) {
  const [insightData, setInsightData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState('today')
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const chartRef = useRef(null);
  const [todayTasks, setTodayTasks] = useState({
    learningMode: { count: 0, completed: false },
    flashcardChecks: { count: 0, completed: false }
  })

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
        
        // Process today's tasks
        const today = new Date().setHours(0, 0, 0, 0);
        const todayData = data.scoresData.filter(session => new Date(session.date).setHours(0, 0, 0, 0) === today);
        const learningModeCount = todayData.length;
        const flashcardChecksCount = todayData.reduce((sum, session) => sum + session.scores.length, 0);

        setTodayTasks({
          learningMode: { count: learningModeCount, completed: learningModeCount >= 4 },
          flashcardChecks: { count: flashcardChecksCount, completed: flashcardChecksCount >= 4 }
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
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
  const processedData = insightData ? insightData.map(session => {
    return {
      date: new Date(session.date),
      scores: session.scores,
      averageScore: session.scores.reduce((a, b) => a + b, 0) / session.scores.length,
      percentageRight: session.scores.filter(score => score >= 3).length / session.scores.length * 100
    };
  }).sort((a, b) => a.date - b.date) : [];

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
        display: false,
      },
      title: {
        display: true,
        text: activeSection === 'today' ? "Today's Performance" : 'Performance Over Time',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: activeSection === 'performance' ? {
      y: {
        beginAtZero: true,
        max: 4,
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 12 }
        }
      }
    } : {}
  };

  const renderChart = (chartType, data, title) => {
    const ChartComponent = chartType === 'pie' ? Pie : Line;
    return (
      <div className="w-full h-[50vh]">
        <ChartComponent ref={chartRef} data={data} options={chartOptions} />
      </div>
    );
  };

  const SectionButton = ({ section, text }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
        activeSection === section
          ? 'bg-blue-500 text-white shadow-[0_3px_0_rgb(37,99,235)]'
          : 'bg-gray-200 text-gray-700 shadow-[0_3px_0_rgb(156,163,175)]'
      }`}
    >
      {text}
    </button>
  );

  const TodaysTasks = () => (
    <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-indigo-600">Today's Quests</h3>
      <ul className="space-y-4">
        <li className="flex items-center">
          <span className={`mr-2 text-3xl ${todayTasks.learningMode.completed ? 'text-yellow-400' : 'text-gray-300'}`}>
            <MdStar />
          </span>
          <span className="text-lg text-gray-700">
            Use learning mode 4 times ({todayTasks.learningMode.count}/4)
          </span>
        </li>
        <li className="flex items-center">
          <span className={`mr-2 text-3xl ${todayTasks.flashcardChecks.completed ? 'text-yellow-400' : 'text-gray-300'}`}>
            <MdStar />
          </span>
          <span className="text-lg text-gray-700">
            Check flashcards 4 times ({todayTasks.flashcardChecks.count}/4)
          </span>
        </li>
      </ul>
    </div>
  );

  const PerformanceStats = () => (
    <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-indigo-600">Your Stats</h3>
      <ul className="space-y-4">
        <li className="flex items-center">
          <span className="mr-2 text-3xl text-red-500">
            <MdTrendingUp />
          </span>
          <span className="text-lg text-gray-700">
            Learning Streak: {processedData.length} days
          </span>
        </li>
        <li className="flex items-center">
          <span className="mr-2 text-3xl text-green-500">
            <MdCheckCircle />
          </span>
          <span className="text-lg text-gray-700">
            Total Flashcards Reviewed: {processedData.reduce((sum, day) => sum + day.scores.length, 0)}
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={`relative flex flex-col items-center justify-between w-full min-h-screen p-4 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-900 text-white' : 'bg-indigo-100 text-gray-900'}`}>
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <SectionButton section="today" text="Today" />
          <SectionButton section="performance" text="Performance" />
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-yellow-400 text-gray-900 shadow-[0_5px_0_rgb(202,138,4)] focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          {isDarkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
      </div>

      <div className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center">
        <div className="w-full">
          {activeSection === 'today' ? (
            <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8">
              <div className="w-full md:w-1/2">
                {todayPerformance ? (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-600">Today's Performance</h3>
                    {renderChart('pie', todayPerformance)}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-lg p-6">
                    <p className="text-center text-lg text-gray-600">No data available for today</p>
                  </div>
                )}
              </div>
              <TodaysTasks />
            </div>
          ) : (
            <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8">
              <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-indigo-600">Performance Over Time</h3>
                {renderChart('line', lineData)}
              </div>
              <PerformanceStats />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
