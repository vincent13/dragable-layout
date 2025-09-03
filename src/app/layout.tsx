import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import MantineProviderWrapper from './mantine-provider-wrapper';

export const metadata = {
    title: 'Grid Layout App',
    description: 'Edit and View Saved Layouts',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body style={{ margin: 0, padding: '1rem', fontFamily: 'sans-serif' }}>
        <MantineProviderWrapper>
            <header style={{ marginBottom: '2rem' }}>
                <nav>
                    <Link href="/">Home</Link> |{' '}
                    <Link href="/editor">Editor</Link> |{' '}
                    <Link href="/viewer?layoutId=1">Viewer</Link>
                </nav>
            </header>

            <main>{children}</main>
        </MantineProviderWrapper>
        </body>
        </html>
    );
}
