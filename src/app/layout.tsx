"use client";
import React, { useState } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast"; 
import Sidebar from "./Components/SideBar";
import Navbar from "./Components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
      
        <Toaster position="top-right" reverseOrder={false} />

        <div>
          <Navbar setIsOpen={setIsSidebarOpen} /> 
        </div>

        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} />
          
          <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? "pl-16" : "pl-4"}`}>
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
