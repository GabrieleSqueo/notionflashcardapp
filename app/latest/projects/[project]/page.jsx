'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdContentCopy, MdCheck, MdDelete, MdPlayArrow, MdRefresh, MdInfo, MdLightMode, MdDarkMode } from 'react-icons/md';

// ActionButton component
const ActionButton = ({ icon: Icon, text, onClick, bgColor }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center ${bgColor} text-white px-4 py-2 rounded-xl shadow-[0_5px_0_rgb(0,0,0,0.1)] hover:shadow-[0_2px_0_rgb(0,0,0,0.1)] hover:translate-y-[3px] transition-all duration-150 text-sm font-bold`}
    >
        <Icon className="mr-2 h-5 w-5" />
        {text}
    </button>
);

// FlashcardList component
const FlashcardList = ({ flashcards }) => {
    if (!flashcards || typeof flashcards !== 'object') {
        return <p className="text-center text-black mt-8">No flashcards available.</p>;
    }

    const flashcardArray = Array.isArray(flashcards) ? flashcards : Object.values(flashcards);

    if (flashcardArray.length === 0) {
        return <p className="text-center text-black mt-8">No flashcards available.</p>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcards</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {flashcardArray.map((flashcard, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-[0_5px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[3px] transition-all duration-150">
                        <h3 className="font-semibold mb-2 text-indigo-600">Front</h3>
                        <p className="mb-4 text-gray-700">{flashcard.front}</p>
                        <h3 className="font-semibold mb-2 text-indigo-600">Back</h3>
                        <p className="text-gray-700">{flashcard.back}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// LoadingSpinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// ErrorMessage component
const ErrorMessage = ({ message }) => (
    <div className="text-red-600 text-center mt-8 bg-red-100 border border-red-400 rounded-xl p-4">
        {message}
    </div>
);

// DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p>Are you sure you want to delete this flashcard set?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
                </div>
            </div>
        </div>
    );
};

// New Switch component
const Switch = ({ isOn, onToggle }) => (
    <div 
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out cursor-pointer ${isOn ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
        <span className={`inline-block w-4 h-4 transform transition-transform duration-200 ease-in-out bg-white rounded-full ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
);

export default function FlashcardSetDetails() {
    const { project } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [copiedInsights, setCopiedInsights] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [embedDarkMode, setEmbedDarkMode] = useState(false);
    const [insightsDarkMode, setInsightsDarkMode] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch flashcard set details
                const setResponse = await fetch(`/api/get-flashcard-set/${project}`);
                if (!setResponse.ok) {
                    throw new Error('Failed to fetch flashcard set');
                }
                const setData = await setResponse.json();
                setFlashcardSet(setData);

                // Fetch flashcards
                const cardsResponse = await fetch(`/api/get-flashcards?set_id=${project}`);
                if (!cardsResponse.ok) {
                    throw new Error('Failed to fetch flashcards');
                }
                const cardsData = await cardsResponse.json();
                setFlashcards(cardsData.content || []); // Assuming the flashcards are in a 'content' field
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [project]);

    const copyEmbedLink = () => {
        const embedLink = `${window.location.origin}/embed/${project}?mode=${embedDarkMode ? 'dark' : 'light'}`;
        navigator.clipboard.writeText(embedLink).then(() => {
            setCopiedEmbed(true);
            setTimeout(() => setCopiedEmbed(false), 2000);
        });
    };

    const copyInsightsLink = () => {
        const insightsLink = `${window.location.origin}/embed/${project}/insights?mode=${insightsDarkMode ? 'dark' : 'light'}`;
        navigator.clipboard.writeText(insightsLink).then(() => {
            setCopiedInsights(true);
            setTimeout(() => setCopiedInsights(false), 2000);
        });
    };

    const handleDelete = () => {
        // Add logic to delete the flashcard set
        console.log("Flashcard set deleted");
        setIsModalOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {flashcardSet && (
                        <>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{flashcardSet.set_name}</h2>
                            
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                                <div className="p-6">
                                    <p className="text-black mb-6">Created on: {formatDate(flashcardSet.created_at)}</p>
                                    
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <ActionButton 
                                            icon={MdPlayArrow} 
                                            text="Start Learning" 
                                            onClick={() => window.location.href = flashcardSet.set_link}
                                            bgColor="bg-green-500"
                                        />
                                        <ActionButton 
                                            icon={MdDelete} 
                                            text="Delete Set" 
                                            onClick={() => setIsModalOpen(true)} 
                                            bgColor="bg-red-500"
                                        />
                                    </div>

                                    <div className="bg-gray-100 p-6 rounded-xl shadow-inner mb-6">
                                        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Embed This Flashcard Set</h3>
                                        <p className="text-gray-600 mb-4">Copy the link below to embed this flashcard set on your Notion page:</p>
                                        <div className="flex items-center mb-4">
                                            <div className="relative flex-grow">
                                                <input 
                                                    type="text" 
                                                    value={`https://www.notionflashcards.com/embed/${project}?mode=${embedDarkMode ? 'dark' : 'light'}`}
                                                    readOnly
                                                    className="w-full p-3 pr-24 border-2 text-black border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                                />
                                                <button 
                                                    onClick={copyEmbedLink}
                                                    className="absolute right-0 top-0 bottom-0 px-4 bg-indigo-500 text-white rounded-r-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    {copiedEmbed ? (
                                                        <>
                                                            <MdCheck className="h-5 w-5 mr-2" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdContentCopy className="h-5 w-5 mr-2" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-sm font-medium text-gray-700">Light</span>
                                                <Switch isOn={embedDarkMode} onToggle={() => setEmbedDarkMode(!embedDarkMode)} />
                                                <span className="ml-2 text-sm font-medium text-gray-700">Dark</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Embed Insights</h3>
                                        <p className="text-gray-600 mb-4">Copy the link below to embed insights for this flashcard set:</p>
                                        <div className="flex items-center mb-4">
                                            <div className="relative flex-grow">
                                                <input 
                                                    type="text" 
                                                    value={`https://www.notionflashcards.com/embed/${project}/insights?mode=${insightsDarkMode ? 'dark' : 'light'}`}
                                                    readOnly
                                                    className="w-full p-3 pr-24 border-2 text-black border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                                />
                                                <button 
                                                    onClick={copyInsightsLink}
                                                    className="absolute right-0 top-0 bottom-0 px-4 bg-indigo-500 text-white rounded-r-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    {copiedInsights ? (
                                                        <>
                                                            <MdCheck className="h-5 w-5 mr-2" />
                                                            <span>Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdContentCopy className="h-5 w-5 mr-2" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="mr-2 text-sm font-medium text-gray-700">Light</span>
                                                <Switch isOn={insightsDarkMode} onToggle={() => setInsightsDarkMode(!insightsDarkMode)} />
                                                <span className="ml-2 text-sm font-medium text-gray-700">Dark</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
                                        <MdInfo className="h-5 w-5 mr-2" />
                                        <span className="text-sm">You can only modify your flashcards on Notion.</span>
                                    </div>
                                </div>
                            </div>

                            <FlashcardList flashcards={flashcards} />
                        </>
                    )}
                </div>
            </main>
            <DeleteConfirmationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleDelete} 
            />
        </div>
    );
}