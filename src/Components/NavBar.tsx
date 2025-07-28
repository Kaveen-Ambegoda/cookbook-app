'use client';

import { usePathname, useRouter } from 'next/navigation';

import { FaSearch, FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { inter } from '@/utils/fonts';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/authContext';

interface NavBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setIsOpen }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  console.log("Auth status:", isAuthenticated, user?.username);
  
  const isLoginPage = pathname?.toLowerCase().includes('/login_register/login');
  const isRegisterPage = pathname?.toLowerCase().includes('/login_register/register');

  const buttonText = isRegisterPage ? 'Sign In' : isLoginPage ? 'Sign Up' : null;
  const targetUrl = isRegisterPage ? '/Login_Register/Login' : isLoginPage ? '/Login_Register/Register' : '#';

  const ButtonClick = () => router.push(targetUrl);

  if (isLoginPage || isRegisterPage) {
    return (
      <nav className="bg-[#FFD476] w-full lg:h-[10vh] flex items-center px-6 relative z-20">
        <div className="flex items-center space-x-4 mr-10">
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
          <h1 className={`text-[1.4rem] sm:text-[1.8rem] font-medium text-black ${inter.className}`}>
            CookBook
          </h1>
        </div>

        <div className="flex ml-auto gap-4 sm:gap-8">
          {buttonText && (
            <button
              className={`text-white rounded-xl  outline-2 outline-[#F25019] font-[500] bg-[#F25019] px-4 py-2 hover:bg-[#C93E0F] cursor-pointer ${inter.className}`}
              onClick={ButtonClick}
            >
              {buttonText}
            </button>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-yellow-400 px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center space-x-3">
        <button className="text-gray-800 text-xl" onClick={() => setIsOpen((prev) => !prev)}>
          <FaBars />
        </button>
        <div className="relative w-8 h-8 mr-1 ml-4">
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

      <div className="flex items-center space-x-4 p-2">


        {/* Removed Notification Bell Button */}

        <div className="relative">
          <button className="text-gray-800 text-xl cursor-pointer" onClick={toggleDropdown}>
            <FaUserCircle />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50 text-sm">
              {isAuthenticated && user?.username ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-gray-800 border-b">{user.username}</div>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/User/Profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      toast.success("Logged out!");
                      setDropdownOpen(false);
                      router.replace("/Login_Register/Login");
                    }}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/Login_Register/Login");
                      setDropdownOpen(false);
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/Login_Register/Register");
                      setDropdownOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
