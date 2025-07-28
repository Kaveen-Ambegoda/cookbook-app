"use client"; 
import { useState } from "react"; 
import { adlam } from '@/utils/fonts'; 
import { roboto } from '@/utils/fonts'; 
import { abeezee } from '@/utils/fonts'; 
import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc"; 
import { FaFacebookF, FaApple } from 'react-icons/fa'; 

// Backend API base URL
const API_BASE_URL = "https://localhost:7205";

export default function SignUpPage() {
 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
  const router = useRouter();

  // Form submission handler for registering the user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setMessage("Passwords do not match"); 
      return; 
    }

    try {
      // Send data to the backend's register endpoint
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        //send data
        body: JSON.stringify({
          username, 
          email,   
          password, 
        }),
      });

      const data = await response.json(); 

      if (response.ok) {
        setMessage("User registered successfully"); 
        router.push(`/Login_Register/EmailSent?email=${encodeURIComponent(email)}`);; //redirect to email sent message 
      } else {
        setMessage(data.message || "Registration failed"); 
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="lg:min-h-[90vh] bg-cover bg-center flex items-center overflow-y-hidden pt-15 pb-10" style={{ backgroundImage: "url('/image/background_image3.png')" }}>
     
      {/* Sign-up Container */}
      
      <div className="lg:w-full lg:h-[41rem] lg:max-w-[35rem] rounded-xl bg-[#FFDC8F]/90 backdrop-blur lg:p-5 shadow-lg lg:pl-[4rem] lg:ml-[20rem] lg:mt-2 md:ml-[10rem] md:mt-[-2rem] sm:max-w-[20rem] sm:h-[30rem] sm:p-4 sm:pl-[2rem]">
       
        <h1 className={`mb-4 text-[2.5rem] font-semibold text-left text-[#F25019] ${adlam.className}`}>Sign Up</h1>

        {/* Form Starts here */}
        <form onSubmit={handleRegister} className="lg:w-[26rem] space-y-5">

          {/* Full Name input */}
          <div className="space-y-1 pt-2">
            <label htmlFor="fullName" className={`block text-sm font-medium ${abeezee.className}`}>Full Name</label>
            <input
              id="fullName"
              type="text"
              required
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Full name"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

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
              onChange={(e) => setEmail(e.target.value)} 
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
              placeholder="Create a password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${abeezee.className}`}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8} 
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Re-enter your password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`mt-2 w-[26rem] rounded-md bg-[#F25019] py-2 text-white active:bg-[#C93E0F] cursor-pointer transition-colors  transition-colors duration-400 ease-in-out  ${roboto.className}`}>
            Sign Up
          </button>

          <div className="w-[26rem] text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>or continue with</div>
          </div>

          {/* Social login icons */}
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

          {/* Sign-in link */}
          <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>
            <div className="text-[#333333]">
              Already have an account?
              <a href="/Login_Register/Login" className="text-[#AE4700] font-bold ml-1">Sign In</a>
            </div>
          </div>
        </form>

        {/* Display success or error message */}
        {message && (
          <div className="mt-4 text-center text-[0.9rem] text-red-600 font-semibold">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}
