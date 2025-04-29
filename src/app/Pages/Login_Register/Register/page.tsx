import { adlam } from '@/app/utils/fonts';
import { roboto } from '@/app/utils/fonts';
import { abeezee } from '@/app/utils/fonts';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from 'react-icons/fa';

export default function SignUpPage() {
  return (
    <div
      className="lg:min-h-[90vh] bg-cover bg-center flex items-center overflow-y-hidden"
      style={{ backgroundImage: "url('/image/background_image3.png')" }}
    >
      {/* Sign-up Container */}
      <div className="lg:w-full lg:h-[42rem] lg:max-w-[35rem] rounded-xl bg-[#FFDC8F]/90 backdrop-blur lg:p-5 shadow-lg lg:pl-[4rem]
                      lg:ml-[20rem] lg:mt-2 md:ml-[10rem] md:mt-[-2rem] sm:max-w-[20rem] sm:h-[30rem] sm:p-4 sm:pl-[2rem]">
        <h1 className={`mb-4 text-[2.5rem] font-semibold text-left text-[#F25019] ${adlam.className}`}>
          Sign Up
        </h1>

        <form className="lg:w-[26rem] space-y-5">
          {/* Full Name */}
          <div className="space-y-1 pt-2">
            <label htmlFor="fullName" className={`block text-sm font-medium ${abeezee.className}`}>
             Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className={`block text-sm font-medium ${abeezee.className}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="username@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className={`block text-sm font-medium ${abeezee.className}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${abeezee.className}`}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="Re-enter your password"
            />
          </div>

          {/* submit button */}
          <button
            type="submit"
            className={`mt-2 w-[26rem] rounded-md bg-[#F25019] py-2 text-white hover:bg-blue-700 ${roboto.className}`}
          >
            Sign Up
          </button>

          {/* divider */}
          <div className="w-[26rem] text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>
              or continue with
            </div>
          </div>

          {/* social login icons */}
          <div className="mt-4 flex justify-center gap-5">
            <button
              type="button"
              aria-label="Continue with Google"
              className="p-2 px-9 rounded-full bg-white shadow"
            >
              <FcGoogle className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Continue with Facebook"
              className="p-2 px-9 rounded-full bg-white shadow"
            >
              <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
            </button>
            <button
              type="button"
              aria-label="Continue with Apple"
              className="p-2 px-9 rounded-full bg-white shadow"
            >
              <FaApple className="w-4 h-4" />
            </button>
          </div>

          {/* Sign-in link */}
          <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>
            <div className="text-[#333333]">
              Already have an account?
              <a href="/login" className="text-[#AE4700] font-bold ml-1">
                Sign In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
