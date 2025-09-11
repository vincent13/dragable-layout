import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
export const metadata = {
    title: 'Grid Layout App',
    description: 'Edit and View Saved Layouts',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <header className="mb-8">
            <nav className="flex gap-4">
                <Link href="/">Home</Link>
                <Link href="/editor?layoutId=1">Editor</Link>
                <Link href="/viewer?layoutId=1">Viewer</Link>
            </nav>
        </header>

        <main>{children}</main>
        </body>
        </html>
    );
}
