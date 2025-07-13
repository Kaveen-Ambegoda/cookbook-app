"use client";
import "./globals.css";
import Sidebar from "./Components/SideBar";
import Navbar from "./Components/NavBar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">

        <div>
          <Navbar setIsOpen={setIsOpen} />
        </div>

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}








