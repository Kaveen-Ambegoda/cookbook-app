"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { adlam } from '@/app/utils/fonts';
import { roboto } from '@/app/utils/fonts';
import { abeezee } from '@/app/utils/fonts';
import { useAuth } from '@/app/context/authContext';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from 'react-icons/fa';

// Backend API base URL (easily switch between HTTP & HTTPS here)
const API_BASE_URL = "https://localhost:7205"; 

export default function LoginPage() {
  // State hooks to store the form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const { login } = useAuth(); // Use the login function from auth context
  const router = useRouter();  

  // Function to handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      // Sending login data (email, password) to the backend for authentication
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

      const data = await response.json();  //get response
      console.log('Login response:', data);

      if (response.ok) {
        
        const {token , refreshToken} = data; // Destructure token and refreshToken from response
        login(token , refreshToken); // This updates context and localStorage
        setMessage("Login successful");

        
        
        // Redirect to frontend dashboard or homepage
         
        router.push("/");

      } else {
        console.log('Login failed:', data.message);
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="lg:min-h-[90vh] bg-cover bg-center flex items-center overflow-y-hidden" style={{ backgroundImage: "url('/image/background_image3.png')" }}>
      {/* Login Container */}
      <div className="lg:w-full lg:h-[35rem] lg:max-w-[35rem] rounded-xl bg-[#FFDC8F]/90 backdrop-blur lg:p-5 lg:py-10 shadow-lg lg:pl-[4rem] lg:ml-[20rem] lg:mt-2 md:ml-[10rem] md:mt-[-2rem] sm:max-w-[20rem] sm:h-[25rem] sm:p-4 sm:pl-[2rem]">

        <h1 className={`mb-4 text-[2.5rem] font-semibold text-left text-[#F25019] ${adlam.className}`}>Login</h1>

        <form onSubmit={handleLogin} className="lg:w-[26rem] space-y-7">
          {/* Email input */}
          <div className="space-y-1">
            <label htmlFor="email" className={`block text-sm font-medium ${abeezee.className}`}>Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="username@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Bind input value to state
            />
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label htmlFor="password" className={`block text-sm font-medium ${abeezee.className}`}>Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Bind input value to state
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`mt-2 w-[26rem] rounded-md bg-[#F25019] py-2 text-white  active:bg-[#C93E0F] cursor-pointer transition-colors duration-400 ease-in-out ${roboto.className}`}
          >
            Login
          </button>

          {/* Divider for social login options */}
          <div className="w-[26rem] text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>or continue with</div>
          </div>

          {/* Social Login Icons */}
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

          {/* Sign-up link */}
          <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>
            <div className="text-[#333333]">
              Don't have an account?
              <a href="/Login_Register/Register" className="text-[#AE4700] font-bold ml-1">Sign Up</a>
            </div>
          </div>
        </form>

        {/* Error or Success message (has to beautify) */}
        {message && (
          <div className="mt-4 text-center text-[0.9rem] text-red-600 font-semibold">
            {message}
          </div>
        )}
        
      </div>
    </div>
  );
}
