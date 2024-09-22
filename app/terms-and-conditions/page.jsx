import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>Welcome to our Flashcard App. By using our service, you agree to these terms and conditions.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">1. Use of Service</h2>
            <p>Our flashcard app is designed to help you study and learn. You agree to use it only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the app.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">2. User Accounts</h2>
            <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers and symbols) with your account.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">3. Content</h2>
            <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">4. Intellectual Property</h2>
            <p>The service and its original content, features and functionality are and will remain the exclusive property of our company and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">5. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">6. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-4">7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;