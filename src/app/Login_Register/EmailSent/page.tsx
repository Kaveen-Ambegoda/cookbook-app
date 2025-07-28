'use client';

import { useSearchParams } from 'next/navigation';

import { FaCheckCircle } from 'react-icons/fa';
import { roboto } from '@/utils/fonts';


export default function EmailSentPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <FaEnvelope className="text-green-500 text-6xl mb-4" />
      <h1 className={`text-3xl font-bold text-gray-800 mb-2 ${roboto.className}`}>Verify Your Email</h1>
      <p className="text-md text-gray-700 text-center max-w-md">
        We've sent a verification link to <strong>{email}</strong>. <br />
        Please check your inbox and click the verification link to activate your account.
      </p>

      <div className="mt-4 text-sm text-gray-500 text-center max-w-md">
        Didn't receive the email? Check your spam folder or{' '}
        <a href="#" className="text-blue-600 underline">resend</a>.
      </div>
    </div>
  );
}
