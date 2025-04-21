import "./globals.css";
import Sidebar from "@/component/Sidebar";
import Navbar from "@/component/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">

        <Navbar/>

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








