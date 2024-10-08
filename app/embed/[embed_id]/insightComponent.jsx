'use client'

import { useState, useEffect } from 'react'

export default function InsightComponent({ embed_id }) {
  const [insightData, setInsightData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/get-notion-data?flashcardSetId=${embed_id}`);
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Insights for Flashcard Set</h1>
      {insightData && insightData.length > 0 ? (
        <div>
          <h2>Study Sessions:</h2>
          {insightData.map((session, index) => (
            <div key={index}>
              <h3>Date: {session.date}</h3>
              <p>Scores: {JSON.stringify(session.scores)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No study data available yet.</p>
      )}
    </div>
  )
}