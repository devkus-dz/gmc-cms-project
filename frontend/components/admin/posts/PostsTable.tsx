'use client';

/**
 * @file frontend/components/admin/posts/PostsTable.tsx
 * @description Presentation component for the Posts data table with server-side pagination.
 */

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, Edit, Trash2, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export interface PostItem {
    id?: string;
    post_id?: string;
    title: string;
    slug: string;
    status: 'published' | 'draft' | 'archived';
    category?: { name: string } | string;
    category_name?: string; // 👈 Add this line!
    created_at: string;
}

interface PostsTableProps {
    data: PostItem[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<PostItem>();

export default function PostsTable({
    data, isLoading, page, totalPages, totalItems, onPageChange, onSearch, onDelete
}: PostsTableProps) {
    const [localSearch, setLocalSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(localSearch);
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [localSearch, onSearch]);

    // Helpers
    const getPostId = (post: PostItem) => post.post_id || post.id || '';

    const getCategoryName = (post: PostItem) => {
        if (post.category_name) return post.category_name;
        if (typeof post.category === 'object' && post.category !== null) return post.category.name || 'Uncategorized';
        return post.category || 'Uncategorized';
    };

    const columns = useMemo(() => [
        columnHelper.accessor('title', {
            header: 'Post Title',
            cell: (info) => (
                <div>
                    <p className="font-semibold text-slate-900 line-clamp-1">{info.getValue()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">/{info.row.original.slug}</p>
                </div>
            ),
        }),
        columnHelper.accessor((row) => getCategoryName(row), {
            id: 'category',
            header: 'Category',
            cell: (info) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => {
                const status = info.getValue();
                return (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${status === 'published' ? 'bg-green-100 text-green-700' :
                            status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            }
        }),
        columnHelper.accessor('created_at', {
            header: 'Date',
            cell: (info) => (
                <span className="whitespace-nowrap text-slate-600 text-sm">
                    {new Date(info.getValue() || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: (info) => (
                <div className="flex items-center justify-end gap-2">
                    <Link href={`/blog/${info.row.original.slug}`} target="_blank" className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="View Live">
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/admin/posts/edit/${info.row.original.slug}`} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors" title="Edit Post">
                        <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => onDelete(getPostId(info.row.original))} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete Post">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }),
    ], [onDelete]);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: { pageIndex: page - 1, pageSize: 10 }
        },
        pageCount: totalPages,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
                <div className="text-sm text-slate-500 font-medium px-4">
                    Total Posts: {totalItems}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-4">
                                            {header.isPlaceholder ? null : (
                                                <div className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-slate-700' : ''}`} onClick={header.column.getToggleSortingHandler()}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                        Loading posts...
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No posts found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 ml-auto">
                        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-slate-600 font-medium px-2">
                            Page {page} of {totalPages}
                        </span>
                        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}