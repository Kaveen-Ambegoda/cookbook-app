import { adlam } from '@/app/utils/fonts';
import { roboto } from '@/app/utils/fonts';
import { abeezee } from '@/app/utils/fonts';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from 'react-icons/fa';




export default function LoginPage() {

  return (

    
    <div
      className="lg:min-h-[90vh]  bg-cover bg-center flex items-center overflow-y-hidden "
      style={{ backgroundImage: "url('/image/background_image3.png')" }}
    >
      {/* Login Container */}
      <div className="lg:w-full lg:h-[37rem] lg:max-w-[35rem] rounded-xl bg-[#FFDC8F]/90 backdrop-blur lg:p-5 shadow-lg lg:pl-[4rem] 
lg:ml-[20rem] lg:mt-2 md:ml-[10rem] md:mt-[-2rem] sm:max-w-[20rem] sm:h-[25rem] sm:p-4 sm:pl-[2rem] sm: ">
        <h1 className={`mb-4 text-[2.5rem] font-semibold text-left text-[#F25019] ${adlam.className}`}>Login</h1>

        {/* form starts here */}
        <form className="lg:w-[26rem] space-y-6">

          {/* username */}
          <div className="space-y-1 pt-5">
            <label htmlFor="email" className={`block text-sm font-medium ${abeezee.className}`}>
              Email
            </label>
            <input
              id="email"
              type="text"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="username@gmail.com"
            />
          </div>

          {/* password */}
          <div className="space-y-1">
            <label htmlFor="password" className={`block text-sm font-medium ${abeezee.className}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-[26rem] rounded-[3px] bg-white px-3 py-2 outline-none focus:ring"
              placeholder="enter password"
            />
          </div>

          {/* forgot-password helper */}
          <div className="text-right">
            <a className={`text-[#AE4700] font-medium text-[0.8rem] ${roboto.className}`}>Forgot&nbsp;Password?</a>
          </div>

          {/* submit button */}
          <button
            type="submit"
            className={`mt-2 w-[26rem] rounded-md bg-[#F25019] py-2 text-white hover:bg-blue-700 ${roboto.className}`}
          >
            Log&nbsp;In
          </button>

          {/* divider helper */}
          <div className="w-[26rem] -mt-4 text-center">
            <div className={`text-[#333333] text-[0.9rem] mt-5 ${abeezee.className}`}>
              or continue with
            </div>
          </div>

          
          {/* social login icons */}

            {/* Google*/}
            <div className="mt-4 flex justify-center gap-5">
              <button
                type="button"
                aria-label="Continue with Google"
                className="p-2 px-9 rounded-full bg-white shadow"
              >
                <FcGoogle className="w-4 h-4 text-[#EA4335]" />
              </button>


              {/* Facebook*/}
              <button
                type="button"
                aria-label="Continue with Facebook"
                className="p-2 px-9 rounded-full bg-white shadow"
              >
                <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
              </button>

              {/* Apple*/}
              <button
                type="button"
                aria-label="Continue with Apple"
                className="p-2 px-9 rounded-full bg-white shadow"
              >
                <FaApple className="w-4 h-4 text-black" />
              </button>
              </div>

              {/* Register here */}
              <div className={`mt-4 text-center text-[0.9rem] ${roboto.className}`}>      
              <div className={`text-[#333333] `}> 
                Don't have an account yet? 
                <a className={`text-[#AE4700] font-bold`}>&nbsp;&nbsp; Register for free</a>
                </div>
              </div>
              
        </form>
      </div>
    </div>
  );
}
