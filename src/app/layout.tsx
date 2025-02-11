import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Maple ARP - 메이플스토리 만능주머니',
  description: '메이플스토리 캐릭터 정보, 랭킹, 길드 정보를 한눈에 확인하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
  // return (
  //   <html lang="ko" className="h-full">
  //     <body className={`${inter.className} h-full`}>
  //       <div className="min-h-full">
  //         <Providers>
  //           <Navbar />
  //           <main>{children}</main>
  //           <footer className="bg-white border-t">
  //             <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  //               <p className="text-center text-sm text-gray-500">
  //                 &copy; {new Date().getFullYear()} Maple ARP. All rights reserved.
  //               </p>
  //             </div>
  //           </footer>
  //         </Providers>
  //       </div>
  //     </body>
  //   </html>
  // );
}
