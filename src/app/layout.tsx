import "./globals.css";
import Sidebar from "./Components/SideBar";
import Navbar from "./Components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">

        <div>
          <Navbar/>
        </div>

        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}








