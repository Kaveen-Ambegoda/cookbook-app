// src/app/layout.tsx
import AdminLayout from '@/app/Components/layout/AdminLayout';
import '@/styles/globals.css';

export const metadata = {
  title: 'Cookbook Admin Panel',
  description: 'Admin panel for managing cookbook application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}