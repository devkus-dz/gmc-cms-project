'use client';

/**
 * @file frontend/components/admin/posts/PostsTable.tsx
 * @description Presentation component for the Posts data table.
 * Handles sorting, searching, pagination, and rendering columns.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Edit, Trash2, Eye, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

// 1. Export the type so the parent page can use it
export interface PostItem {
    id?: string;
    post_id?: string;
    title: string;
    slug: string;
    status: 'published' | 'draft' | 'archived';
    category: { name: string } | string;
    created_at: string;
}

// 2. Define the props this component accepts
interface PostsTableProps {
    data: PostItem[];
    isLoading: boolean;
    onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<PostItem>();

export default function PostsTable({ data, isLoading, onDelete }: PostsTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');

    // Helpers
    const getPostId = (post: PostItem) => post.post_id || post.id || '';
    const getCategoryName = (post: PostItem) => {
        if (typeof post.category === 'object' && post.category !== null) return post.category.name || 'Uncategorized';
        return post.category || 'Uncategorized';
    };

    // Define Columns
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
                                'bg-slate-100 text-slate-700'}
          `}>
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
                    <Link
                        href={`/admin/posts/edit/${info.row.original.slug}`}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Edit Post"
                    >
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
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search all columns..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-4">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-slate-700' : ''}`}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
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
                                        {globalFilter ? 'No posts found matching your search.' : 'No posts created yet.'}
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

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{table.getRowModel().rows.length}</span> of <span className="font-medium text-slate-900">{table.getFilteredRowModel().rows.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-slate-600 font-medium px-2">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                        </span>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}