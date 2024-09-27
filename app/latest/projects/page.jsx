'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaBook, FaSpinner } from 'react-icons/fa';

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

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">Your Flashcard Sets</h2>
					
					{error && (
						<div className="mb-4 text-red-600 text-sm">{error}</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<Link href="/latest/new-project" className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
							<div className="px-4 py-5 sm:p-6">
								<div className="flex items-center">
									<div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
										<FaPlus className="h-6 w-6 text-white" />
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Create New Set
											</dt>
											<dd className="text-lg font-medium text-gray-900">
												Add a new flashcard set
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</Link>

						{loading ? (
							<div className="col-span-2 flex justify-center items-center">
								<FaSpinner className="animate-spin text-4xl text-indigo-500" />
							</div>
						) : (
							flashcardSets.map((set) => (
								<Link href={`/flashcard-set/${set.id}`} key={set.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
									<div className="px-4 py-5 sm:p-6">
										<div className="flex items-center">
											<div className="flex-shrink-0 bg-green-500 rounded-md p-3">
												<FaBook className="h-6 w-6 text-white" />
											</div>
											<div className="ml-5 w-0 flex-1">
												<dl>
													<dt className="text-sm font-medium text-gray-500 truncate">
														Flashcard Set
													</dt>
													<dd className="text-lg font-medium text-gray-900">
														{set.title}
													</dd>
												</dl>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-4 sm:px-6">
										<div className="text-sm">
											<span className="font-medium text-indigo-600 hover:text-indigo-500">
												View set <span aria-hidden="true">&rarr;</span>
											</span>
										</div>
									</div>
								</Link>
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