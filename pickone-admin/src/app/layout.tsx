import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/providers/StoreProvider';

import { Toaster } from 'react-hot-toast';
const lexend = Lexend_Deca({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ekhoni Kinbo - Dashboard',
    description: 'Welcome to the Ekhoni Kinbo Dashboard',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={lexend.className}>
                <Toaster position="bottom-right" />
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
