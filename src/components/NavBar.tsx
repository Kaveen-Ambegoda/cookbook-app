'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaSearch, FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { inter } from '@/app/utils/fonts';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface NavBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface JwtPayload {
  sub: string;
}

export default function Navbar({ setIsOpen }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Run on route change: check token and set user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUsername(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Decoded:", decoded);
      setUsername(decoded.sub);
    } catch (err) {
      console.error("Token decode failed", err);
      localStorage.removeItem("token");
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const isLoginPage = pathname?.toLowerCase().includes('/login_register/login');
  const isRegisterPage = pathname?.toLowerCase().includes('/login_register/register');

  const buttonText = isRegisterPage ? 'Sign In' : isLoginPage ? 'Sign Up' : null;
  const targetUrl = isRegisterPage ? '/Pages/Login_Register/Login' : isLoginPage ? '/Pages/Login_Register/Register' : '#';

  const ButtonClick = () => {
    router.push(targetUrl);
  };

  // Optional: prevent flicker during loading
  if (isLoading) return null;

  // === Navbar for Login/Register Pages ===
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
              className={`text-white rounded-xl outline outline-2 outline-[#F25019] font-[500] bg-[#F25019] px-4 py-2 hover:bg-[#C93E0F] cursor-pointer ${inter.className}`}
              onClick={ButtonClick}
            >
              {buttonText}
            </button>
          )}
        </div>
      </nav>
    );
  }

  // === Navbar for All Other Pages ===
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

      <div className="flex items-center space-x-4">
        <SearchBar />
        <button className="text-gray-800 text-xl">
          <FaBell />
        </button>

        <div className="relative">
          <button className="text-gray-800 text-xl cursor-pointer" onClick={toggleDropdown}>
            <FaUserCircle />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50 text-sm">
              {username ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-gray-800 border-b">{username}</div>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/Pages/User/Profile");
                      setDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setUsername(null);
                      toast.success("Logged out!");
                      setDropdownOpen(false);
                      router.replace("/Pages/Login_Register/Login");
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
                      router.push("/Pages/Login_Register/Login");
                      setDropdownOpen(false);
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/Pages/Login_Register/Register");
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
