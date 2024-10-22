'use client';

import { useState, useEffect } from 'react';
import { createInitialUser, updateUserPassword } from './actions';
import { MdPersonAdd } from 'react-icons/md';
import { useSearchParams } from 'next/navigation';

export default function SignUp() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkoutSessionId = searchParams.get('session_id');
    if (checkoutSessionId) {
      createInitialUser(checkoutSessionId).then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setUserId(result.userId);
          setSuccessMessage('Account created. Please set your password.');
        }
      });
    } else {
      setError('No checkout session ID found');
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await updateUserPassword(userId, password);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage('Password set successfully. You can now log in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl p-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <MdPersonAdd className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set Your Password
          </h2>
        </div>
        {successMessage ? (
          <div className="mb-4 text-sm text-green-600 bg-green-100 border border-green-400 rounded-lg p-3">
            {successMessage}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-t-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-b-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2 bg-red-100 border border-red-400 rounded-lg p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:bg-indigo-700"
              >
                Set Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
