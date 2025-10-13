import './globals.css';
import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'BattleZone',
  description: 'BattleZone Website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-grow w-full px-6 py-10">{children}</main>
            {/* <Footer /> */}
          </div>
        </div>
      </body>
    </html>
  );
}
