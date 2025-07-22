"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast'; // Using toast for better user feedback
import API from "@/app/utils/axiosInstance"; // <-- IMPORT THE CENTRALIZED API INSTANCE

// Import your fonts
import { adlam, roboto, abeezee } from '@/app/utils/fonts';

// Import icons
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from 'react-icons/fa';

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Client-Side Validation ---
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      // --- THIS IS THE CORRECTED LOGIC ---
      // 1. Use the centralized API instance.
      // 2. Provide only the relative path.
      // 3. The data object must match the backend's RegisterModel.
      await API.post("/api/Auth/register", {
        username,
        email,
        password,
      });

      toast.dismiss(loadingToast);
      toast.success("Registration successful! Redirecting to login...");
      
      // Redirect to the login page after a short delay
      setTimeout(() => {
        router.push("/Login_Register/Login");
      }, 1500);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Registration error:", error);

      // Provide specific feedback based on the error from the backend
      if (error.response?.status === 409) {
        toast.error("An account with this email already exists.");
      } else if (error.response) {
        toast.error(error.response.data.message || "Registration failed. Please try again.");
      } else {
        toast.error("Network error. Could not connect to the server.");
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="lg:min-h-[90vh] bg-cover bg-center flex items-center overflow-y-hidden pt-15 pb-10" style={{ backgroundImage: "url('/image/background_image3.png')" }}>
      <div className="lg:w-full lg:h-[41rem] lg:max-w-[35rem] rounded-xl bg-[#FFDC8F]/90 backdrop-blur lg:p-5 shadow-lg lg:pl-[4rem] lg:ml-[20rem] lg:mt-2 md:ml-[10rem] md:mt-[-2rem] sm:max-w-[20rem] sm:h-[30rem] sm:p-4 sm:pl-[2rem]">
        <h1 className={`mb-4 text-[2.5rem] font-semibold text-left text-[#F25019] ${adlam.className}`}>Sign Up</h1>
        
        <form onSubmit={handleRegister} className="lg:w-[26rem] space-y-5">
          <div className="space-y-1 pt-2">
            <label htmlFor="username" className={`block text-sm font-medium ${abeezee.className}`}>Full Name</label>
            <input
              id="username"
              type="text"
              required
              className="w-full rounded-[3px] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className={`block text-sm font-medium ${abeezee.className}`}>Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-[3px] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="username@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className={`block text-sm font-medium ${abeezee.className}`}>Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-[3px] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Create a password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${abeezee.className}`}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              className="w-full rounded-[3px] bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full rounded-md bg-[#F25019] py-2 text-white font-semibold transition-colors duration-300 hover:bg-[#C93E0F] active:bg-[#a3330c] disabled:bg-gray-400 disabled:cursor-not-allowed ${roboto.className}`}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="w-full text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>or continue with</div>
          </div>

          <div className="mt-4 flex justify-center gap-5">
            <button type="button" aria-label="Continue with Google" className="p-2 px-9 rounded-full bg-white shadow">
              <FcGoogle className="w-4 h-4" />
            </button>
            <button type="button" aria-label="Continue with Facebook" className="p-2 px-9 rounded-full bg-white shadow">
              <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
            </button>
            <button type="button" aria-label="Continue with Apple" className="p-2 px-9 rounded-full bg-white shadow">
              <FaApple className="w-4 h-4" />
            </button>
          </div>

          <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>
            <div className="text-[#333333]">
              Already have an account?{' '}
              <Link href="/Login_Register/Login" className="text-[#AE4700] font-bold ml-1 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}