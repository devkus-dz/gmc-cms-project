'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen, LayoutDashboard, FileText, Image as ImageIcon,
    Tags, FolderTree, Users, Activity, Settings, LogOut, MessageSquare, Menu, X, User as UserIcon
} from 'lucide-react';
import { authService } from '../../services/authService';
import api from '../../lib/axios';

const menuGroups = [
    {
        label: 'Core',
        items: [
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'editor', 'author'] },
            { href: '/admin/posts', icon: FileText, label: 'Posts', roles: ['admin', 'editor', 'author'] },
            { href: '/admin/media', icon: ImageIcon, label: 'Media Library', roles: ['admin', 'editor', 'author'] },
            { href: '/admin/comments', icon: MessageSquare, label: 'Comments', roles: ['admin', 'editor'] },
        ]
    },
    {
        label: 'Taxonomy',
        items: [
            { href: '/admin/categories', icon: FolderTree, label: 'Categories', roles: ['admin', 'editor'] },
            { href: '/admin/tags', icon: Tags, label: 'Tags', roles: ['admin', 'editor'] },
        ]
    },
    {
        label: 'System',
        items: [
            { href: '/admin/users', icon: Users, label: 'Users', roles: ['admin'] },
            { href: '/admin/activity', icon: Activity, label: 'Activity Log', roles: ['admin'] },
            { href: '/admin/profile', icon: Settings, label: 'My Profile', roles: ['admin', 'editor', 'author', 'subscriber'] },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                setCurrentUser(res.data.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isActive = (path: string) => {
        if (path === '/admin') return pathname === '/admin';
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
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
        <>
            {/* 👇 NEW: Full Width Mobile Header instead of a floating button */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 text-white z-40 flex items-center justify-between px-4 border-b border-slate-800 shadow-md">
                <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                    <span className="text-xl font-bold tracking-tight">EduCMS</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 bg-slate-800 text-white rounded-lg shadow-sm hover:bg-slate-700 transition-colors"
                    aria-label="Open Menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>

                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900 shrink-0">
                    <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                        <span className="text-xl font-bold tracking-tight">EduCMS</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    {currentUser && menuGroups.map((group, groupIndex) => {
                        const allowedItems = group.items.filter(item => item.roles.includes(currentUser.role));
                        if (allowedItems.length === 0) return null;

                        return (
                            <div key={groupIndex} className={groupIndex > 0 ? "mt-8" : ""}>
                                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    {group.label}
                                </p>
                                {allowedItems.map((item, itemIndex) => (
                                    <NavItem key={itemIndex} href={item.href} icon={item.icon} label={item.label} />
                                ))}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0 flex flex-col gap-2">
                    {currentUser && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-800/50 rounded-lg border border-slate-800">
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                {currentUser.avatar ? (
                                    <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <UserIcon className="h-4 w-4 text-slate-400" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{currentUser.username}</p>
                                <p className="text-xs text-slate-400 capitalize truncate">{currentUser.role}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}