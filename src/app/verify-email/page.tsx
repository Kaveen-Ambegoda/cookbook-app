'use client'

import React, { useEffect, useState } from 'react';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    setStatus('error');
    setMessage('Invalid or missing verification token.');
    return;
  }

  fetch(`https://localhost:7205/api/Auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }), // Optional body since you use query param
  })
    .then((res) => {
      if (!res.ok) throw new Error('Verification failed');
      return res.json();
    })
    .then((data) => {
      setStatus('success');
      setMessage(data.message || 'Email successfully verified. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/Login_Register/Login'; // Redirect after success
      }, 3000); // wait 3 seconds before redirect
    })
    .catch((err) => {
      setStatus('error');
      setMessage('Email verification failed or token expired.');
    });
}, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p className={`text-lg ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
    </div>
  );
};

export default VerifyEmailPage;
