'use client';

/**
 * @file frontend/app/(admin)/page.tsx
 * @description Main dashboard overview with real stats and recent activity.
 */

import { useState, useEffect } from 'react';
import { FileText, MessageSquare, Users, Eye, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/axios'; // Adjust relative path if necessary

// Helper function to format relative time (e.g., "2 hours ago")
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};

// Helper to format large numbers
const formatNumber = (num: string | number) => {
    const n = Number(num);
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();
};

export default function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch both dashboard stats and activity logs in parallel for speed
                const [dashboardRes, activityRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/activity')
                ]);

                setDashboardData(dashboardRes.data.data);
                setRecentActivity(activityRes.data.data.slice(0, 5)); // Grab only the 5 most recent logs
            } catch (err: any) {
                console.error('Failed to load dashboard:', err);
                setError('Failed to load dashboard statistics.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3 max-w-2xl mt-8">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error || 'An unexpected error occurred.'}</p>
            </div>
        );
    }

    // Map the real data to your stats array format
    const stats = [
        { label: 'Total Posts', value: formatNumber(dashboardData.overview.posts.total), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Comments', value: formatNumber(dashboardData.overview.comments.total), icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    if (Number(dashboardData.overview.comments.total) > 0 || Number(dashboardData.overview.users.total) > 0) {
        stats.push({ label: 'Views', value: formatNumber(dashboardData.overview.views.total_views), icon: Eye, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' });
        stats.push({ label: 'Active Users', value: formatNumber(dashboardData.overview.users.total), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' });
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back. Here is what's happening with your content today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/posts/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                        <Plus className="h-4 w-4" /> New Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Top Posts Table (Takes up 2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Top Performing Posts</h2>
                        <Link href="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Post Title</th>
                                    <th className="px-6 py-3">Author</th>
                                    <th className="px-6 py-3 text-right">Views</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dashboardData.topPosts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No posts available.</td>
                                    </tr>
                                ) : (
                                    dashboardData.topPosts.map((post: any) => (
                                        <tr key={post.post_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 line-clamp-1">{post.title}</td>
                                            <td className="px-6 py-4 capitalize">{post.author || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-right font-medium">{formatNumber(post.view_count)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Activity Log (Takes up 1/3 width) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">System Activity</h2>
                        <Link href="/admin/activity" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            All Logs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
                        ) : (
                            recentActivity.map((log: any, index: number) => {
                                // Determine timeline dot color based on action type
                                const action = log.action.toUpperCase();
                                let dotColor = 'bg-slate-500 ring-slate-50';
                                if (action.includes('CREATE') || action.includes('ADD')) dotColor = 'bg-emerald-500 ring-emerald-50';
                                if (action.includes('UPDATE') || action.includes('EDIT')) dotColor = 'bg-blue-500 ring-blue-50';
                                if (action.includes('DELETE') || action.includes('REMOVE')) dotColor = 'bg-red-500 ring-red-50';

                                return (
                                    <div key={log.log_id || index} className="flex gap-4">
                                        <div className={`mt-1 shrink-0 h-2.5 w-2.5 rounded-full ring-4 ${dotColor}`}></div>
                                        <div>
                                            <p className="text-sm text-slate-900 font-medium">
                                                <span className="font-bold capitalize">{log.username || 'System'}</span> {log.description.toLowerCase()}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{timeAgo(log.created_at)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}