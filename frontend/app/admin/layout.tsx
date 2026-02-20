/**
 * @file frontend/app/(admin)/layout.tsx
 * @description The main layout wrapper for the secure Admin area.
 */

import Sidebar from '../../components/admin/Sidebar';
import { Bell, Search } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">

            {/* 📱 Left Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <Search className="h-4 w-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search admin..."
                            className="bg-transparent text-sm w-full outline-none text-slate-700 placeholder-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                A
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}