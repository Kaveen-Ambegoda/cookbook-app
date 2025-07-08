'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaSearch, FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { inter } from '@/app/utils/fonts';
import Image from 'next/image';

interface NavBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Navbar component for login/register page
export default function Navbar({ setIsOpen }: NavBarProps) {

  const pathname = usePathname();
  const router = useRouter();


  
//Pass the paths to the variables for If-Else
  const isLoginPage = pathname?.toLowerCase().includes('/login_register/login');
  const isRegisterPage = pathname?.toLowerCase().includes('/login_register/register');

  // Button text and target URL based on the current page
  const buttonText = isRegisterPage ? 'Sign In' : isLoginPage ? 'Sign Up' : null;
  const targetUrl = isRegisterPage ? '/Pages/Login_Register/Login' : isLoginPage ? '/Pages/Login_Register/Register' : '#';


 //Onclick redirect to targetUrl 
  const ButtonClick = () => {
    router.push(targetUrl);
  };



  // Render the navbar for login or register pages
  if (isLoginPage || isRegisterPage) {
    return (
      <nav className="bg-[#FFD476] w-full lg:h-[10vh] sm:h-[10vh] flex items-center px-6 relative z-20">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4 sm:space-x-5 mr-10">
          {/* Logo */}
          <div className="relative w-16 h-16 sm:w-24 sm:h-24">
            <Image
              src="/image/cookbook_app.png"
              alt="CookBook Logo"
              layout="responsive"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          </div>

          {/* Cookbook Title */}
          <h1 className={`text-[1.4rem] sm:text-[1.8rem] sm:py-2 font-medium text-black ${inter.className}`}>
            CookBook
          </h1>
        </div>

        {/* Button */}
        <div className="flex ml-auto gap-4 sm:gap-8">
          {buttonText && (
            <button
              className={`text-white rounded-xl outline outline-2 outline-[#F25019] font-[500] text-[0.9rem] sm:text-[1rem] text-medium bg-[#F25019] px-4 py-2 sm:px-5 sm:py-3  hover:bg-[#C93E0F]  active:bg-[#C93E0F] cursor-pointer transition-colors duration-400 ease-in-out ${inter.className}`}
              onClick={ButtonClick}
            >
              {buttonText}
            </button>
          )}
        </div>
      </nav>
    );
  }

  // Default navbar (for other pages)
  return (
    <nav className="bg-yellow-400 px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50">
      {/* Left - Logo and Title */}
      <div className="flex items-center space-x-3">
        <button className="text-gray-800 text-xl" onClick={() => setIsOpen((prev) => !prev)}>
          <FaBars />
        </button>

        <div className="relative w-8 h-8 mr-1 ml-4" >
          <Image 
            src="/image/logo.jpg" 
            alt="Logo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        <h1 className="text-xl font-bold pl-2 text-gray-900">CookBook</h1>
      </div>

      {/* Right - Search Bar and Icons */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-full border bg-gray-50 border-gray-300 focus:outline-none w-96"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>

        <button className="text-gray-800 text-xl">
          <FaBell />
        </button>
        <button className="text-gray-800 text-xl">
          <FaUserCircle />
        </button>
      </div>
    </nav>
  );
}
