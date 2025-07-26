"use client";

import { useRouter } from "next/navigation";
import { FaFacebookF } from "react-icons/fa";

const FB_CLIENT_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;
const REDIRECT_URI = `${FRONTEND_URL}/Login_Register/FacebookCallback`;

export default function FacebookLoginButton() {
  const router = useRouter();

  const handleFacebookLogin = () => {
    const fbLoginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email,public_profile&response_type=token`;
    window.location.href = fbLoginUrl;
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      aria-label="Continue with Facebook"
      className="p-2 px-9 rounded-full bg-white shadow"
    >
      <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
    </button>
  );
}
