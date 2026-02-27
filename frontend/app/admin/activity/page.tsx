'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';
import ActivityTable, { ActivityItem } from '../../../components/admin/activity/ActivityTable';
// 👇 Import your Role Guard hook (adjust the path if your hooks folder is somewhere else)
import { useRoleGuard } from '../../../hooks/useRoleGuard';

/**
 * @file frontend/app/(admin)/activity/page.tsx
 * @description Activity log page displaying paginated system events. Strictly for Admins.
 */
export default function ActivityLogPage() {
    // 🔒 1. Apply the Role Guard FIRST to restrict access to Admins only
    const { isAuthorized, isLoading: isAuthLoading } = useRoleGuard(['admin']);

    const [logs, setLogs] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {

        if (!isAuthorized) return;

        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/activity?page=${page}&limit=${limit}`);
                setLogs(response.data.data.items || []);
                setTotalPages(response.data.data.pagination.totalPages || 1);
                setTotalItems(response.data.data.pagination.total || 0);
            } catch (err: any) {
                setError('Could not load the activity log.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [page, limit, isAuthorized]); // Re-run when authorization clears

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    // Show a loading state while checking roles to prevent page flashing
    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Verifying permissions...</p>
            </div>
        );
    }

    // If they are an Editor or Author, return nothing (the hook is redirecting them)
    if (!isAuthorized) return null;

    // If they are an Admin, render the page normally
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
                <p className="text-slate-500 text-sm mt-1">Audit trail of system events and user actions.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <ActivityTable
                data={logs}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
            />
        </div>
    );
}