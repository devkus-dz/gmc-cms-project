/**
 * @file frontend/app/(admin)/page.tsx
 * @description Main dashboard overview with stats and recent activity.
 */

import { FileText, FolderTree, Users, Eye, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    // In a real scenario, you would fetch these stats from your Express backend
    const stats = [
        { label: 'Total Posts', value: '124', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Categories', value: '12', icon: FolderTree, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Total Views', value: '45.2K', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Active Users', value: '89', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

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
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
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

                {/* Recent Posts Table (Takes up 2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Recently Published</h2>
                        <Link href="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Post Title</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {/* Placeholder Data */}
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">The Future of AI in Education</td>
                                        <td className="px-6 py-4">Technology</td>
                                        <td className="px-6 py-4">Oct 24, 2024</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Published</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Activity Log (Takes up 1/3 width) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">System Activity</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Timeline Item 1 */}
                        <div className="flex gap-4">
                            <div className="mt-1 shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                            <div>
                                <p className="text-sm text-slate-900 font-medium">Admin User updated a post</p>
                                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                            </div>
                        </div>
                        {/* Timeline Item 2 */}
                        <div className="flex gap-4">
                            <div className="mt-1 shrink-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                            <div>
                                <p className="text-sm text-slate-900 font-medium">New image uploaded to Media</p>
                                <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                            </div>
                        </div>
                        {/* Timeline Item 3 */}
                        <div className="flex gap-4">
                            <div className="mt-1 shrink-0 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-orange-50"></div>
                            <div>
                                <p className="text-sm text-slate-900 font-medium">Server backup completed</p>
                                <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}