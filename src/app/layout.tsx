"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "react-hot-toast"; 
import SideBar from "@/Components/SideBar";
import Navbar from "../Components/NavBar";
import { AuthProvider } from "./context/authContext";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;

}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const isAuthPage =
    pathname?.toLowerCase().includes("/login_register/login") ||
    pathname?.toLowerCase().includes("/login_register/register");

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
        <Toaster position="bottom-right" reverseOrder={false} />

        {isAuthPage ? (
          <>
            {/* Login/Register layout: only Navbar */}
            <Navbar setIsOpen={() => {}} />
            <main className="flex-1">{children}</main>
          </>
        ) : (
          <>
            <Navbar setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-1">
              <SideBar isOpen={isSidebarOpen} />
              <main
                className={`flex-1 p-4 transition-all duration-300 ${
                  isSidebarOpen ? "pl-16" : "pl-4"
                }`}
              >
                {children}
              </main>
            </div>
          </>
        )}
        </AuthProvider>
      </body>
    </html>
  );
}