'use client';

import { useState, useEffect } from 'react';
import { MdAddCircle, MdCheck, MdLightMode, MdDarkMode, MdSearch, MdArrowBack } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const [status, setStatus] = useState('');
  const [pages, setPages] = useState([]); // Ensure this is initialized as an empty array
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedPageName, setSelectedPageName] = useState(''); // New state for selected page name
  const [isLoading, setIsLoading] = useState(true);
  const [embedMode, setEmbedMode] = useState('light'); // New state for embed mode
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPages, setFilteredPages] = useState([]);
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

  useEffect(() => {
    // Filter pages based on search term
    const filtered = pages.filter(page =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPages(filtered);
  }, [searchTerm, pages]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="w-full max-w-[1400px]">
        <div className="flex items-center mb-6">
          <Link href="/latest" className="mr-4">
            <button className="p-2 rounded-xl bg-white text-indigo-600 hover:bg-indigo-200 transition-colors shadow-[0_2px_0_rgb(203,213,225)] hover:shadow-[0_1px_0_rgb(203,213,225)] hover:translate-y-[1px]">
              <MdArrowBack size={24} />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-black flex-grow">Create New Flashcard Page</h1>
        </div>
        
        {status && <p className="mb-6 text-center text-gray-600">{status}</p>}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="lg:w-[60%]">
                <h2 className="text-xl font-semibold text-black mb-4">Select a page:</h2>
                <div className="relative mb-4 rounded-xl shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden">
                  <div className="overflow-y-auto max-h-[600px] border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                      {filteredPages.map((page) => (
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
              </div>

              <div className="lg:w-[40%]">
                <h2 className="text-xl font-semibold text-black mb-4">Select embed theme:</h2>
                <div className="flex items-center mb-4">
                  <label htmlFor="embed-mode-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="embed-mode-toggle"
                        className="sr-only"
                        checked={embedMode === 'dark'}
                        onChange={() => {
                          const newMode = embedMode === 'light' ? 'dark' : 'light';
                          setEmbedMode(newMode);
                          // Update the iframe src when the mode changes
                          const iframe = document.getElementById('example-embed');
                          if (iframe) {
                            const currentSrc = new URL(iframe.src);
                            currentSrc.searchParams.set('theme', newMode);
                            iframe.src = currentSrc.toString();
                          }
                        }}
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full shadow-inner transition-colors duration-300 ease-in-out">
                        <div
                          className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                            embedMode === 'dark' ? 'translate-x-7 bg-indigo-600' : ''
                          }`}
                        >
                          {embedMode === 'light' ? (
                            <MdLightMode className="w-3 h-3 text-yellow-500" />
                          ) : (
                            <MdDarkMode className="w-3 h-3 text-indigo-200" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="ml-3 text-md font-semibold text-gray-700">
                      {embedMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </label>
                </div>
                
                <h3 className="text-lg font-semibold text-black mb-2">Example:</h3>
                <div className={`border rounded-xl shadow-[0_5px_0_rgb(203,213,225)] transition-all duration-150 overflow-hidden ${embedMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <iframe
                    id="example-embed"
                    src={`https://www.notionflashcard.com/embed/18d32144-e5f5-448a-8be8-e55c34749c91?mode=${embedMode}`}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateNotionPage}
              disabled={!selectedPageId}
              className={`w-full text-white px-4 py-2 hover:shadow-lg flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(126,34,206)] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedPageId ? 'bg-indigo-500 hover:bg-indigo-600 shadow-[0_3px_0_rgb(126,34,206)]' : 'bg-gray-400 cursor-not-allowed shadow-[0_3px_0_rgb(125, 125, 125)]'
              }`}
            >
              <MdAddCircle className="mr-2 h-5 w-5" />
              Create Notion Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}
