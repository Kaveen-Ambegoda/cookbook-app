"use client";

import "./globals.css";
import { useState } from "react";
import Sidebar from "./Components/SideBar";
import Navbar from "./Components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <div className="relative z-30">
          <Navbar setIsOpen={setIsOpen} />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <Sidebar isOpen={isOpen} />
          
          {/* Main content */}
          <main 
            className={`flex-1 transition-all duration-300 ${
              isOpen ? 'lg:ml-64' : 'ml-16'
            }`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}