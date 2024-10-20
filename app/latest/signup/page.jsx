'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signup, updateUser } from './actions';
import { MdPersonAdd } from 'react-icons/md';
import { useSearchParams } from 'next/navigation';

export default function SignUp() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitialSignup, setIsInitialSignup] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkoutSessionId = searchParams.get('session_id');
    if (checkoutSessionId) {
      setIsInitialSignup(true);
    } else {
      setIsInitialSignup(false);
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    if (isInitialSignup) {
      formData.append('checkoutSessionId', searchParams.get('session_id'));
      const result = await signup(formData);
      if (result.error) {
        setError(result.error);
        setSuccessMessage('');
      } else {
        setSuccessMessage(result.message);
        setError('');
        setIsInitialSignup(false);
      }
    } else {
      const result = await updateUser(formData);
      if (result.error) {
        setError(result.error);
        setSuccessMessage('');
      } else {
        setSuccessMessage(result.message);
        setError('');
      }
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
            {isInitialSignup ? 'Create your account' : 'Complete your profile'}
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
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-t-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  minLength={3}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              {isInitialSignup && (
                <>
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
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                </>
              )}
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
                {isInitialSignup ? 'Sign up' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}
        {!isInitialSignup && (
          <div className="text-center space-y-4">
            <Link href="/latest/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Already have an account? Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
