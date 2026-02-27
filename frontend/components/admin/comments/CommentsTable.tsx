'use client';

import { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, AlertOctagon, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight, MessageSquare, User } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export interface CommentItem {
    comment_id: string;
    post_title: string;
    username: string;
    avatar: string | null;
    content: string;
    status: 'pending' | 'approved' | 'spam' | 'trash';
    created_at: string;
}

/**
 * @interface CommentsTableProps
 * @description Properties including server-side hooks.
 */
interface CommentsTableProps {
    data: CommentItem[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    onStatusChange: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<CommentItem>();

export default function CommentsTable({
    data, isLoading, page, totalPages, totalItems, onPageChange, onSearch, onStatusChange, onDelete
}: CommentsTableProps) {
    const [localSearch, setLocalSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, onSearch]);

    const columns = useMemo(() => [
        columnHelper.accessor('username', {
            header: 'Author',
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {info.row.original.avatar ? (
                            <img src={info.row.original.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-4 w-4 text-slate-400" />
                        )}
                    </div>
                    <span className="font-semibold text-slate-900">{info.getValue() || 'Anonymous'}</span>
                </div>
            ),
        }),
        columnHelper.accessor('content', {
            header: 'Comment',
            cell: (info) => (
                <div className="max-w-md">
                    <p className="text-sm text-slate-700 line-clamp-2">{info.getValue()}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> on: <span className="font-medium text-slate-600 truncate">{info.row.original.post_title || 'Unknown Post'}</span>
                    </p>
                </div>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => {
                const status = info.getValue() || 'pending';
                const styles = {
                    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    spam: 'bg-red-100 text-red-700 border-red-200',
                    trash: 'bg-slate-200 text-slate-700 border-slate-300',
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${styles[status]}`}>
                        {status}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: (info) => (
                <div className="flex items-center justify-end gap-1">
                    {info.row.original.status !== 'approved' && (
                        <button onClick={() => onStatusChange(info.row.original.comment_id, 'approved')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                        </button>
                    )}
                    {info.row.original.status !== 'pending' && (
                        <button onClick={() => onStatusChange(info.row.original.comment_id, 'pending')} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Mark Pending">
                            <XCircle className="h-4 w-4" />
                        </button>
                    )}
                    {info.row.original.status !== 'spam' && (
                        <button onClick={() => onStatusChange(info.row.original.comment_id, 'spam')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Mark Spam">
                            <AlertOctagon className="h-4 w-4" />
                        </button>
                    )}
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button onClick={() => onDelete(info.row.original.comment_id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Permanently">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }),
    ], [onStatusChange, onDelete]);

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
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search comments..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                </div>
                <div className="text-sm text-slate-500 font-medium px-4">
                    Total Comments: {totalItems}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                                        Loading comments...
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No comments found.
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