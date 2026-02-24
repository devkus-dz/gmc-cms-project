'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import api from '../../../lib/axios';
import ActivityTable, { ActivityItem } from '../../../components/admin/activity/ActivityTable';

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/activity');
                setLogs(response.data.data || []);
            } catch (err: any) {
                setError('Could not load the activity log.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

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

            {/* Render the full-width TanStack table */}
            <ActivityTable data={logs} isLoading={isLoading} />
        </div>
    );
}