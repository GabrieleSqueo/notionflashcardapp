import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signup } from './actions'; // Import the signup function

export default async function Signup({ searchParams }) {
  const signUp = async (formData) => {
    'use server'; // This line marks the function as a server action

    try {
      const result = await signup(formData); // Call the signup function
      return redirect(`/confirm?message=${result.message}`);
    } catch (error) {
      return redirect(`/signup?message=${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form
          className="space-y-6"
          action={signUp} // This will call the signUp function on form submission
        >
          <div>
            <label className="text-md" htmlFor="username">
              Username
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              name="username"
              placeholder="Your username"
              required
            />
          </div>
          <div>
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="text-md" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="text-md" htmlFor="notionKey">
              Notion Key (optional)
            </label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              type="text"
              name="notionKey"
              placeholder="Your Notion integration key"
            />
          </div>
          <button className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-200">
            Sign up
          </button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-red-100 text-red-600 text-center rounded-md">
              {searchParams.message}
            </p>
          )}
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}