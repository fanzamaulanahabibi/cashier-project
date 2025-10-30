import { SHOP } from '../config/shop.js';
import { Poppins } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: SHOP.name + ' POS',
};

const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} min-h-screen font-display`}>
        {children}
      </body>
    </html>
  );
}
