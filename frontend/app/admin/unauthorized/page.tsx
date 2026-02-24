'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
            <div className="h-24 w-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-200">
                <ShieldAlert className="h-12 w-12" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">403 - Access Denied</h1>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    You do not have the required permissions to view this page. If you believe this is a mistake, please contact an administrator.
                </p>
            </div>
            <Link href="/admin" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <ArrowLeft className="h-4 w-4" /> Return to Dashboard
            </Link>
        </div>
    );
}