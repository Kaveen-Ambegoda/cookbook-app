import AdminLayout from './layout/AdminLayout';
import './globals.css';
export const metadata = {
  title: 'Cookbook Admin Panel',
  description: 'Admin panel for managing cookbook application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen bg-gray-50">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
