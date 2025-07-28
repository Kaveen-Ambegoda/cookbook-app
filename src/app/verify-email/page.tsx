'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Use the environment variable you already have set up
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7205';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    console.log('Token from URL:', token);
    console.log('API_BASE_URL:', API_BASE_URL);

    // Construct the correct API endpoint using your environment variable
    const verifyUrl = `${API_BASE_URL}/api/Auth/verify-email?token=${encodeURIComponent(token)}`;
    console.log('Making request to:', verifyUrl);

    // Use GET request since we're passing token as query parameter
    fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(async (res) => {
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        // Check if response has content
        const contentType = res.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        // Handle different response scenarios
        if (res.status === 204) {
          // No content but success
          if (res.ok) {
            return { message: 'Email verified successfully!' };
          } else {
            throw new Error('Verification failed');
          }
        }

        // Try to get response text first
        const responseText = await res.text();
        console.log('Response text:', responseText);

        if (!responseText) {
          if (res.ok) {
            return { message: 'Email verified successfully!' };
          } else {
            throw new Error(`Verification failed - HTTP ${res.status}: ${res.statusText}`);
          }
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          console.log('Raw response:', responseText);
          
          if (res.ok) {
            return { message: 'Email verified successfully!' };
          } else {
            throw new Error(`Server error (${res.status}): ${responseText}`);
          }
        }
        
        if (!res.ok) {
          throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
        }
        
        return data;
      })
      .then((data) => {
        console.log('Success data:', data);
        setStatus('success');
        setMessage(data.message || 'Email successfully verified! Redirecting to login...');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/Login_Register/Login');
        }, 3000);
      })
      .catch((err) => {
        console.error('Verification error:', err);
        setStatus('error');
        
        // Provide more specific error messages
        let errorMessage = 'Email verification failed.';
        
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and ensure the backend is running.';
        } else if (err.message.includes('Invalid verification token')) {
          errorMessage = 'Invalid verification token. The link may be incorrect.';
        } else if (err.message.includes('expired')) {
          errorMessage = 'Verification token has expired. Please request a new verification email.';
        } else if (err.message.includes('already verified')) {
          errorMessage = 'Email is already verified. You can proceed to login.';
          setStatus('success'); // Change to success if already verified
        } else if (err.message.includes('ERR_CERT_AUTHORITY_INVALID')) {
          errorMessage = 'SSL certificate error. Try using HTTP instead of HTTPS for local development.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setMessage(errorMessage);
      });
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="text-green-500 text-6xl mb-4">✓</div>
          )}
          {status === 'error' && (
            <div className="text-red-500 text-6xl mb-4">✗</div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Verification</h2>
        <p className={`text-lg ${
          status === 'success' ? 'text-green-600' : 
          status === 'error' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {message}
        </p>

        {status === 'error' && (
          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/Login_Register/Login')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/Login_Register/Register')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Back to Registration
              </button>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Having trouble? Try:</p>
              <ul className="mt-2 text-left space-y-1">
                <li>• Check if the verification link is complete</li>
                <li>• Make sure the link hasn't expired (24 hours)</li>
                <li>• Ensure your backend server is running on port 7205</li>
                <li>• Try the verification link in an incognito window</li>
                <li>• Request a new verification email</li>
              </ul>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>API URL: {API_BASE_URL}</p>
                <p>Current Token: {searchParams.get('token')?.substring(0, 10)}...</p>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6">
            <button
              onClick={() => router.push('/Login_Register/Login')}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;