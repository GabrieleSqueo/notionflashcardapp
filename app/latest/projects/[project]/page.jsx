'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdContentCopy, MdCheck, MdEdit, MdDelete, MdPlayArrow, MdRefresh } from 'react-icons/md';

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
        return <p>No flashcards available.</p>;
    }

    const flashcardArray = Array.isArray(flashcards) ? flashcards : Object.values(flashcards);

    if (flashcardArray.length === 0) {
        return <p>No flashcards available.</p>;
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
    <div className="flex justify-center items-center h-screen">
        <MdRefresh className="animate-spin text-4xl text-indigo-500" />
    </div>
);

// ErrorMessage component
const ErrorMessage = ({ message }) => (
    <div className="text-red-600 text-center mt-8 bg-red-100 border border-red-400 rounded-xl p-4">
        {message}
    </div>
);

export default function FlashcardSetDetails() {
    const { project } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

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
        const embedLink = `${window.location.origin}/embed/${project}`;
        navigator.clipboard.writeText(embedLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {flashcardSet && (
                        <>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">{flashcardSet.title}</h2>
                            
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6">{flashcardSet.description}</p>
                                    
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <ActionButton 
                                            icon={MdPlayArrow} 
                                            text="Start Learning" 
                                            onClick={() => {/* Add logic to start learning */}} 
                                            bgColor="bg-green-500"
                                        />
                                        <ActionButton 
                                            icon={MdEdit} 
                                            text="Edit Set" 
                                            onClick={() => {/* Add logic to edit set */}} 
                                            bgColor="bg-blue-500"
                                        />
                                        <ActionButton 
                                            icon={MdDelete} 
                                            text="Delete Set" 
                                            onClick={() => {/* Add logic to delete set */}} 
                                            bgColor="bg-red-500"
                                        />
                                    </div>

                                    <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
                                        <h3 className="text-xl font-semibold mb-3 text-indigo-600">Embed This Flashcard Set</h3>
                                        <p className="text-gray-600 mb-4">Copy the link below to embed this flashcard set on your website:</p>
                                        <div className="flex items-center">
                                            <div className="relative flex-grow">
                                                <input 
                                                    type="text" 
                                                    value={`${window.location.origin}/embed/${project}`}
                                                    readOnly
                                                    className="w-full p-3 pr-24 border-2 text-black border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                                                />
                                                <button 
                                                    onClick={copyEmbedLink}
                                                    className="absolute right-0 top-0 bottom-0 px-4 bg-indigo-500 text-white rounded-r-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    {copied ? (
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
                                        {copied && (
                                            <p className="text-green-600 mt-2 flex items-center">
                                                <MdCheck className="h-5 w-5 mr-2" />
                                                Copied to clipboard!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <FlashcardList flashcards={flashcards} />
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}