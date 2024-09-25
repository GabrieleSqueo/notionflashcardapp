'use client';

import { useState, useEffect } from 'react';

export default function NewProjectPage() {
  const [status, setStatus] = useState('');
  const [pages, setPages] = useState([]); // Ensure this is initialized as an empty array
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedPageName, setSelectedPageName] = useState(''); // New state for selected page name

  useEffect(() => {
    const fetchPages = async () => {
      setStatus('Fetching pages...');
      try {
        const response = await fetch('/api/create-notion-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'fetchPages' }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        setPages(result.pages); // Set pages directly from the result
        setStatus('');
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    fetchPages();
  }, []);

  const handleCreateNotionPage = async () => {
    if (!selectedPageId) {
      setStatus('Please select a page first.');
      return;
    }

    setStatus('Creating Notion page...');
    try {
      const response = await fetch('/api/create-notion-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'createPage', 
          pageId: selectedPageId,
          selectedPageName: selectedPageName // Pass the selected page name
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      setStatus(result.message);
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">Create New Notion Page</h1>
        {status && <p className="mb-4 text-center text-gray-600">{status}</p>}
        
        <div className="mb-4">
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700">Select a page:</label>
          <select
            id="pages"
            name="pages"
            className="text-black mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedPageId}
            onChange={(e) => {
              const selectedPage = pages.find(page => page.id === e.target.value);
              setSelectedPageId(e.target.value);
              setSelectedPageName(selectedPage ? selectedPage.title : ''); // Set the selected page name
            }}
          >
            <option value="">-- Select a page --</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title || 'Untitled'} {/* Access the title directly */}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateNotionPage}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Notion Page
        </button>
      </div>
    </div>
  );
}
