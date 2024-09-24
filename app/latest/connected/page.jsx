'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectedPage() {
  const [status, setStatus] = useState('Processing...');
  const router = useRouter();

  useEffect(() => {
    const handleNotionCallback = async () => {
      // Extract the code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setStatus('Error: No code found in URL');
        return;
      }

      try {
        // Make a POST request to the /api/notiontoken endpoint
        const response = await fetch('/api/notiontoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to connect to Notion');
        }

        const { message } = await response.json();

        setStatus(message || 'Successfully connected to Notion!');
        // Redirect to dashboard or home page after a short delay
        setTimeout(() => router.push('/latest'), 2000);
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    handleNotionCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connecting to Notion</h1>
      <p>{status}</p>
    </div>
  );
}
