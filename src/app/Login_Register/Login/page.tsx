"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { adlam } from '@/utils/fonts';
import { roboto } from '@/utils/fonts';
import { abeezee } from '@/utils/fonts';
import { useAuth } from '@/app/context/authContext';

import GoogleLoginButton from "@/components/GoogleLoginButton";
import FacebookLoginButton from "@/components/FacebookLoginButton";
import { FaFacebookF, FaApple, FaUtensils, FaLock, FaEnvelope, FaTimes } from 'react-icons/fa';

import toast, { Toaster } from "react-hot-toast";

// Backend API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        const { token , refreshToken } = data;
        login(token , refreshToken);
        toast.success("Welcome back! Let's cook something delicious! 🍳");
        router.push("/");
      } else {
        console.log('Login failed:', data.message);
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        style={{ 
          backgroundImage: "url('/image/background_image3.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md transform transition-all duration-300 ease-out">
        {/* Main Modal Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-orange-50 to-red-50 p-8 text-center">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-orange-400"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-red-400"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-400"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
                <FaUtensils className="w-7 h-7 text-white" />
              </div>
              <h1 className={`text-2xl font-bold text-gray-800 mb-2 ${adlam.className}`}>
                Welcome Back Chef!
              </h1>
              <p className={`text-gray-600 text-sm ${abeezee.className}`}>
                Sign in to continue your culinary adventure
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className={`block text-sm font-semibold text-gray-700 ${abeezee.className}`}>
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-300 text-sm"
                    placeholder="chef@cookbook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className={`block text-sm font-semibold text-gray-700 ${abeezee.className}`}>
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-orange-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-300 text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="#" className={`text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors ${abeezee.className}`}>
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing you in...
                  </div>
                ) : (
                  "Sign In to CookBook"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 bg-white text-gray-500 ${abeezee.className}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center gap-4">
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <GoogleLoginButton />
                </div>
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <FacebookLoginButton />
                </div>
                <button 
                  type="button" 
                  aria-label="Continue with Apple" 
                  className="p-2 px-9 rounded-full bg-white shadow"
                >
                  <FaApple className="w-4 h-4" />
                </button>
              </div>

              {/* Sign-up Link */}
              <div className={`text-center pt-6 border-t border-gray-100 ${roboto.className}`}>
                <p className="text-gray-600 text-sm">
                  New to CookBook?{" "}
                  <a 
                    href="/Login_Register/Register" 
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Create your account
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-red-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      
    </div>
  );
}