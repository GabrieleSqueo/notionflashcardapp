'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdLinkOff, MdInfo } from 'react-icons/md';

export default function NotionSettings() {
    const [notionLinked, setNotionLinked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkNotionLink() {
            try {
                const response = await fetch('/api/check-notion-link');
                if (!response.ok) {
                    throw new Error('Failed to check Notion link status');
                }
                const data = await response.json();
                setNotionLinked(data.isLinked);
            } catch (error) {
                console.error('Error checking Notion link:', error);
                setError('Failed to check Notion link status. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        checkNotionLink();
    }, []);

    const handleUnlink = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/unlink-notion', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to unlink Notion account');
            }

            setNotionLinked(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error unlinking Notion account:', error);
            setError('Failed to unlink Notion account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Settings</div>
                    <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Notion Integration</h1>
                    <p className="mt-2 text-gray-500">Manage your Notion integration settings here.</p>

                    <div className="mt-6">
                        {notionLinked ? (
                            <>
                                <p className="text-green-600 mb-4">Your Notion account is currently linked.</p>
                                <button
                                    onClick={handleUnlink}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-[0_3px_0_rgb(185,28,28)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(185,28,28)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(185,28,28)] hover:translate-y-[3px] overflow-hidden"
                                    disabled={loading}
                                >
                                    <MdLinkOff className="mr-2 h-5 w-5" />
                                    {loading ? 'Unlinking...' : 'Unlink Notion Account'}
                                </button>
                            </>
                        ) : (
                            <p className="text-yellow-600 mb-4">Your Notion account is not linked. Please link your account to use Notion Flashcards.</p>
                        )}

                        {error && (
                            <div className="mt-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-2 text-sm text-green-600">
                                Notion account unlinked successfully!
                            </div>
                        )}
                    </div>

                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <MdInfo className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Unlinking your Notion account will remove access to your Notion pages. You can always link your account again later.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
