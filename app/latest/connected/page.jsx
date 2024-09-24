'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ConnectedPage() {
  const [status, setStatus] = useState('Processing...');
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleNotionCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("code: " + code);

      if (!code) {
        setStatus('Error: No code found in URL');
        return;
      }

      try {
        const response = await fetch('/api/notiontoken', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        console.log("data: " + data);

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        if (data.success) {
          setStatus(data.message);
          setTimeout(() => router.push('/latest'), 2000);
        } else {
          throw new Error(data.message || 'Unexpected response from server');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    handleNotionCallback();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Connecting to Notion</h1>
      <p>{status}</p>
    </div>
  );
}
