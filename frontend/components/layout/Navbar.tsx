'use client';

/**
 * @file frontend/components/layout/Navbar.tsx
 * @description Top navigation bar for the public-facing pages, responsive with Shadcn UI Sheet.
 */

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'; // Adjust this import path if your shadcn puts it elsewhere

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Helper to close the mobile menu when a link is clicked
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Articles', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* 1. Logo (Left Column) */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center gap-2 text-blue-700 hover:opacity-90 transition-opacity">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-xl font-bold text-slate-900">EduCMS</span>
                    </Link>
                </div>

                {/* 2. Desktop Navigation (Center Column) */}
                <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-medium text-slate-600">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:text-blue-600 transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* 3. CTA Buttons (Right Column - Desktop) */}
                <div className="hidden md:flex flex-1 justify-end items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/register"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                    >
                        Get Started
                    </Link>
                </div>

                {/* 4. Mobile Menu Toggle (Right Column - Mobile) */}
                <div className="md:hidden flex flex-1 justify-end items-center">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </button>
                        </SheetTrigger>
                        {/* Added overflow-y-auto so smaller phones can scroll if needed */}
                        <SheetContent side="right" className="w-[300px] flex flex-col overflow-y-auto">
                            <SheetHeader className="text-center mb-8 mt-4">
                                <SheetTitle className="flex items-center justify-center gap-2 text-blue-700">
                                    <BookOpen className="h-6 w-6" />
                                    <span className="text-xl font-bold text-slate-900">EduCMS</span>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-8 flex-1">
                                {/* Mobile Links (Centered text, larger tap targets) */}
                                <div className="flex flex-col gap-6 text-lg font-medium text-slate-600 items-center">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={closeMenu}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Auth Buttons (Directly below links so they are always visible) */}
                                <div className="flex flex-col gap-3 mt-4 border-t border-slate-100 pt-8 w-full px-2">
                                    <Link
                                        href="/auth/login"
                                        onClick={closeMenu}
                                        className="w-full text-center py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        onClick={closeMenu}
                                        className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </nav>
    );
}