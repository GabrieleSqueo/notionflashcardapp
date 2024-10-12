'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdFolderOpen, MdRefresh, MdArrowBack, MdAdd } from 'react-icons/md';

export default function UserFlashcardSets() {
	const [flashcardSets, setFlashcardSets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchFlashcardSets() {
			try {
				const response = await fetch('/api/get-user-flashcards', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch flashcard sets');
				}

				const data = await response.json();
				console.log(data);
				setFlashcardSets(data);
			} catch (error) {
				console.error('Error fetching flashcard sets:', error);
				setError('Failed to fetch flashcard sets');
			} finally {
				setLoading(false);
			}
		}

		fetchFlashcardSets();
	}, []);

	const ButtonLink = ({ href, icon: Icon, title, description }) => (
		<Link href={href} className="block">
			<button className="w-full text-left bg-white rounded-xl shadow-[0_5px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[3px] transition-all duration-150 overflow-hidden">
				<div className="px-6 py-5">
					<div className="flex items-center">
						<div className="flex-shrink-0 bg-indigo-500 rounded-xl p-3">
							<Icon className="h-8 w-8 text-white" />
						</div>
						<div className="ml-5 w-0 flex-1">
							<dl>
								<dt className="text-sm font-medium text-gray-500 truncate">
									{title}
								</dt>
								<dd className="text-lg font-bold text-indigo-600">
									{description}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</button>
		</Link>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center">
							<Link href="/latest" className="mr-4">
								<button className="p-2 rounded-xl bg-white text-indigo-600 hover:bg-indigo-200 transition-colors shadow-[0_2px_0_rgb(203,213,225)] hover:shadow-[0_1px_0_rgb(203,213,225)] hover:translate-y-[1px]">
									<MdArrowBack size={24} />
								</button>
							</Link>
							<h2 className="text-3xl font-bold text-gray-900">Your Flashcard Sets</h2>
						</div>
						<Link href="/latest/new-project">
							<button className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_3px_0_rgb(126,34,206)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
								<MdAdd size={20} className="mr-2" />
								<span>New Set</span>
							</button>
						</Link>
					</div>
					
					{error && (
						<div className="mb-6 text-red-600 text-sm bg-red-100 border border-red-400 rounded-lg p-4">{error}</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{loading ? (
							<div className="col-span-full flex justify-center items-center">
								<MdRefresh className="animate-spin text-4xl text-indigo-500" />
							</div>
						) : (
							flashcardSets.map((set) => (
								<ButtonLink 
									key={set.id}
									href={`/latest/projects/${set.id}`}
									icon={MdFolderOpen}
									title="Flashcard Set"
									description={set.title}
								/>
							))
						)}
					</div>

					{!loading && flashcardSets.length === 0 && (
						<p className="text-center text-gray-600 mt-8">You haven't created any flashcard sets yet. Create your first set to get started!</p>
					)}
				</div>
			</main>
		</div>
	);
}
