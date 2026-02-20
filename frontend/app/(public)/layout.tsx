/**
 * @file frontend/app/(public)/layout.tsx
 * @description Layout wrapper for all public-facing pages.
 * Ensures the Navbar and Footer persist across navigations.
 */

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* main content flex-grow pushes the footer to the bottom of the screen if the page is short */}
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}