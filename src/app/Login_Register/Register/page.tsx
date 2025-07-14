"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation";
import { adlam } from '@/app/utils/fonts'; 
import { roboto } from '@/app/utils/fonts'; 
import { abeezee } from '@/app/utils/fonts'; 

import { FcGoogle } from "react-icons/fc"; 
import { FaFacebookF, FaApple } from 'react-icons/fa'; 

// Backend API base URL - try multiple endpoints
const API_BASE_URLS = [
  "http://localhost:5007",    // Current running port
  "https://localhost:7205",
  "http://localhost:5000",
  "https://localhost:5001"
];

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // Function to try different API URLs
  const tryApiCall = async (endpoint: string, options: RequestInit) => {
    for (const baseUrl of API_BASE_URLS) {
      try {
        console.log(`Trying API call to: ${baseUrl}${endpoint}`);
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        console.log(`Response status: ${response.status}`);
        return response;
      } catch (error) {
        console.error(`Failed to connect to ${baseUrl}:`, error);
        // Continue to next URL
      }
    }
    throw new Error("Could not connect to any API endpoint");
  };

  // Form submission handler for registering the user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setMessage("");

    // Validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match"); 
      setIsLoading(false);
      return; 
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Starting registration process...");
      
      // Send data to the backend's register endpoint
      const response = await tryApiCall("/api/Auth/register", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(), 
          email: email.trim(),   
          password: password, 
        }),
      });

      const data = await response.json(); 
      console.log("Registration response:", data);

      if (response.ok) {
        setMessage("User registered successfully! Redirecting to login..."); 
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/Pages/Login_Register/Login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to server. Please check if the backend is running and try again.");
    } finally {
      setIsLoading(false);
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
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring focus:ring-[#F25019]"
              placeholder="Full name"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={isLoading}
            />
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label htmlFor="email" className={`block text-sm font-medium ${abeezee.className}`}>Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring focus:ring-[#F25019]"
              placeholder="username@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isLoading}
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
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring focus:ring-[#F25019]"
              placeholder="Create a password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={isLoading}
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
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring focus:ring-[#F25019]"
              placeholder="Re-enter your password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-[26rem] rounded-md bg-[#F25019] py-2 text-white active:bg-[#C93E0F] cursor-pointer transition-colors duration-400 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="w-[26rem] text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>or continue with</div>
          </div>

          {/* Social login icons */}
          <div className="mt-4 flex justify-center gap-5">
            <button type="button" aria-label="Continue with Google" className="p-2 px-9 rounded-full bg-white shadow disabled:opacity-50" disabled={isLoading}>
              <FcGoogle className="w-4 h-4" />
            </button>
            <button type="button" aria-label="Continue with Facebook" className="p-2 px-9 rounded-full bg-white shadow disabled:opacity-50" disabled={isLoading}>
              <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
            </button>
            <button type="button" aria-label="Continue with Apple" className="p-2 px-9 rounded-full bg-white shadow disabled:opacity-50" disabled={isLoading}>
              <FaApple className="w-4 h-4" />
            </button>
          </div>

          {/* Sign-in link */}
          <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>
            <div className="text-[#333333]">
              Already have an account?
              <a href="/Pages/Login_Register/Login" className="text-[#AE4700] font-bold ml-1">Sign In</a>
            </div>
          </div>
        </form>

        {/* Display success or error message */}
        {message && (
          <div className={`mt-4 text-center text-[0.9rem] font-semibold ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
}