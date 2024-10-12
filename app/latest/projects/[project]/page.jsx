'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdContentCopy, MdCheck, MdDelete, MdPlayArrow, MdRefresh, MdInfo, MdLightMode, MdDarkMode } from 'react-icons/md';
import Link from 'next/link';

// Updated ActionButton component
const ActionButton = ({ icon: Icon, text, onClick, bgColor, shadowColor }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center ${bgColor} px-4 py-2 rounded-xl text-white hover:bg-opacity-90 shadow-[0_3px_0_${shadowColor}] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_${shadowColor}] hover:shadow-[0_2px_0_${shadowColor}] hover:translate-y-[1px] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        <Icon className="mr-2 h-5 w-5" />
        {text}
    </button>
);

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

// Updated Switch component
const Switch = ({ isOn, onToggle }) => (
    <div 
        onClick={onToggle}
        className={`relative inline-block w-14 h-7 transition-colors duration-300 ease-in-out rounded-full cursor-pointer ${
            isOn ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
    >
        <div
            className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform ${
                isOn ? 'translate-x-7' : 'translate-x-0'
            }`}
        >
            {isOn ? (
                <MdDarkMode className="w-3 h-3 text-indigo-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
                <MdLightMode className="w-3 h-3 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
        </div>
    </div>
);

// Updated FlashcardList component
const FlashcardList = ({ flashcards }) => {
    if (!flashcards || flashcards.length === 0) {
        return <p className="text-center text-gray-600 mt-8">No flashcards available.</p>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcards</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {flashcards.map((flashcard, index) => (
                        <li key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                            <div className="flex justify-between">
                                <p className="text-indigo-600 font-medium">{flashcard.front}</p>
                                <p className="text-gray-600">{flashcard.back}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

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

    const copyLink = (link, setCopied) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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

    const getEmbedUrl = (isInsights = false) => {
        const baseUrl = `https://notionflashcard.com/embed/${project}`;
        const mode = isInsights ? (insightsDarkMode ? 'dark' : 'light') : (embedDarkMode ? 'dark' : 'light');
        if (isInsights) {
            return `${baseUrl}?insight=true&mode=${mode}`;
        } else {
            return `${baseUrl}?mode=${mode}`;
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {flashcardSet && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{flashcardSet.set_name}</h2>
                                    <p className="text-black mb-6">Created on: {formatDate(flashcardSet.created_at)}</p>
                                </div>
                                <Link href={flashcardSet.set_link}>
                                    <ActionButton 
                                        icon={MdPlayArrow} 
                                        text="Start Learning" 
                                        bgColor="bg-green-500"
                                        shadowColor="rgb(34,197,94)"
                                    />
                                </Link>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                                <div className="p-6">
                                    {/* Flashcard Set Embed */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Embed This Flashcard Set</h3>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="relative flex-grow mb-4">
                                                    <input 
                                                        type="text" 
                                                        value={getEmbedUrl()}
                                                        readOnly
                                                        className="w-full p-3 pr-24 border-2 text-black border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                                    />
                                                    <button 
                                                        onClick={() => copyLink(getEmbedUrl(), setCopiedEmbed)}
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
                                                <div className="flex items-center mb-4">
                                                    <span className="mr-2 text-sm font-medium text-gray-700">Light</span>
                                                    <Switch 
                                                        isOn={embedDarkMode} 
                                                        onToggle={() => setEmbedDarkMode(prevMode => !prevMode)} 
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-gray-700">Dark</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="border-2 border-indigo-200 rounded-xl overflow-hidden" style={{height: '300px'}}>
                                                    <iframe
                                                        src={getEmbedUrl()}
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        key={embedDarkMode ? 'dark' : 'light'}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Insights Embed */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Embed Insights</h3>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="relative flex-grow mb-4">
                                                    <input 
                                                        type="text" 
                                                        value={getEmbedUrl(true)}
                                                        readOnly
                                                        className="w-full p-3 pr-24 border-2 text-black border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                                    />
                                                    <button 
                                                        onClick={() => copyLink(getEmbedUrl(true), setCopiedInsights)}
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
                                                <div className="flex items-center mb-4">
                                                    <span className="mr-2 text-sm font-medium text-gray-700">Light</span>
                                                    <Switch 
                                                        isOn={insightsDarkMode} 
                                                        onToggle={() => setInsightsDarkMode(prevMode => !prevMode)} 
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-gray-700">Dark</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="border-2 border-indigo-200 rounded-xl overflow-hidden" style={{height: '300px'}}>
                                                    <iframe
                                                        src={getEmbedUrl(true)}
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        key={insightsDarkMode ? 'dark' : 'light'}
                                                    ></iframe>
                                                </div>
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

                            <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-200">
                                <h3 className="text-xl font-semibold mb-3 text-red-600">Danger Zone</h3>
                                <p className="text-gray-700 mb-4">Deleting this flashcard set is irreversible. Please be certain.</p>
                                <ActionButton 
                                    icon={MdDelete} 
                                    text="Delete Set" 
                                    onClick={() => setIsModalOpen(true)} 
                                    bgColor="bg-red-500"
                                    shadowColor="rgb(239,68,68)"
                                />
                            </div>
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