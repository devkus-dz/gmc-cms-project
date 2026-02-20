'use client';

/**
 * @file frontend/components/admin/Sidebar.tsx
 * @description Persistent left navigation for the Admin Panel.
 * Uses a clean API call to let the backend clear the HttpOnly session.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen, LayoutDashboard, FileText, Image as ImageIcon,
    Tags, FolderTree, Users, Activity, Settings, LogOut
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    /**
     * Calls the backend API to clear the HttpOnly cookie, then redirects.
     */
    const handleLogout = async () => {
        try {
            // 1. Tell the backend to destroy the HttpOnly cookie
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // 2. Clear basic client storage just to reset application state
            localStorage.clear();
            sessionStorage.clear();

            // 3. Force a hard reload to the login page
            window.location.href = '/auth/login';
        }
    };

    const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
            >
                <Icon className="h-5 w-5" />
                {label}
            </Link>
        );
    };

    return (
        <aside className="w-64 bg-slate-950 text-slate-300 shrink-0 flex-col hidden md:flex border-r border-slate-800">
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
                <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold tracking-tight">EduCMS</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Core</p>
                <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                <NavItem href="/admin/posts" icon={FileText} label="Posts" />
                <NavItem href="/admin/media" icon={ImageIcon} label="Media Library" />

                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-3">Taxonomy</p>
                <NavItem href="/admin/categories" icon={FolderTree} label="Categories" />
                <NavItem href="/admin/tags" icon={Tags} label="Tags" />

                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-3">System</p>
                <NavItem href="/admin/users" icon={Users} label="Users" />
                <NavItem href="/admin/activity" icon={Activity} label="Activity Log" />
                <NavItem href="/admin/settings" icon={Settings} label="Settings" />
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut className="h-5 w-5" /> Logout
                </button>
            </div>
        </aside>
    );
}