"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import Sidebar from "./Components/SideBar"; // Assuming path is correct
import Navbar from "./Components/NavBar";   // Assuming path is correct

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  
  // *** THIS IS THE FIX FOR THE HYDRATION ERROR ***
  // We use a state to ensure the content only renders on the client side,
  // preventing the server/client mismatch caused by browser extensions.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body>
        <div style={{ visibility: !isClient ? 'hidden' : 'visible' }}>
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
        </div>
      </body>
    </html>
  );
}