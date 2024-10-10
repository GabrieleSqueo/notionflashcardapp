'use client';

import { useState, useEffect } from 'react';
import { MdAddCircle, MdCheck, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const [status, setStatus] = useState('');
  const [pages, setPages] = useState([]); // Ensure this is initialized as an empty array
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedPageName, setSelectedPageName] = useState(''); // New state for selected page name
  const [isLoading, setIsLoading] = useState(true);
  const [embedMode, setEmbedMode] = useState('light'); // New state for embed mode
  const router = useRouter();

  useEffect(() => {
    const fetchPages = async () => {
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
        console.log("----RESULT: ", JSON.stringify(result, null, 2));
        setPages(result.pages); // Set pages directly from the result
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
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
          selectedPageName: selectedPageName,
          embedMode: embedMode // Pass the selected embed mode
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      setStatus(result.message);
      
      // Redirect to the new project page using the flashcardSet id
      if (result.success && result.flashcardSet && result.flashcardSet.set_id) {
        router.push(`/latest/projects/${result.flashcardSet.set_id}`);
      } else {
        setStatus('Project created, but no flashcard set ID was returned.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const handlePageSelect = (pageId, pageName) => {
    setSelectedPageId(pageId);
    setSelectedPageName(pageName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl">
        <h1 className="text-3xl text-indigo-600 font-bold mb-6 text-center">Create New Flashcard Page</h1>
        {status && <p className="mb-6 text-center text-gray-600">{status}</p>}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Select a page:</h2>
              <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-2 p-2">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handlePageSelect(page.id, page.title)}
                      className={`text-black w-full p-4 text-left transition-all duration-200 border rounded-lg ${
                        selectedPageId === page.id
                          ? 'bg-indigo-100 border-indigo-500'
                          : 'bg-white hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {page.icon && <span className="mr-2">{page.icon}</span>}
                          {page.title || 'Untitled'}
                        </span>
                        {selectedPageId === page.id && <MdCheck className="text-indigo-500 flex-shrink-0 ml-2" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-4">Select embed mode:</h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setEmbedMode('light')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    embedMode === 'light' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <MdLightMode className="mr-2" />
                  Light Mode
                </button>
                <button
                  onClick={() => setEmbedMode('dark')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    embedMode === 'dark' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <MdDarkMode className="mr-2" />
                  Dark Mode
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateNotionPage}
              disabled={!selectedPageId}
              className={`w-full text-white px-6 py-3 rounded-xl shadow-[0_5px_0_rgb(67,56,202)] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] transition-all duration-150 font-medium text-lg flex items-center justify-center ${
                selectedPageId ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <MdAddCircle className="mr-2 h-6 w-6" />
              Create Notion Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}
