'use client';

import { useState, useMemo } from 'react';
import { Edit, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight, User as UserIcon, Shield, Edit3, PenTool, UserCheck } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export interface UserItem {
    user_id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'author' | 'subscriber';
    is_active: boolean;
    avatar: string | null;
    last_login: string | null;
}

interface UsersTableProps {
    data: UserItem[];
    isLoading: boolean;
    editingId: string | null;
    onEdit: (user: UserItem) => void;
    onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<UserItem>();

export default function UsersTable({ data, isLoading, editingId, onEdit, onDelete }: UsersTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(() => [
        columnHelper.accessor('username', {
            header: 'User',
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {info.row.original.avatar ? (
                            <img src={info.row.original.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon className="h-4 w-4 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{info.getValue()}</p>
                        <p className="text-xs text-slate-500">{info.row.original.email}</p>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('role', {
            header: 'Role',
            cell: (info) => {
                const role = info.getValue();
                const roleConfig = {
                    admin: { bg: 'bg-purple-100 text-purple-700', icon: Shield },
                    editor: { bg: 'bg-blue-100 text-blue-700', icon: Edit3 },
                    author: { bg: 'bg-emerald-100 text-emerald-700', icon: PenTool },
                    subscriber: { bg: 'bg-slate-100 text-slate-700', icon: UserCheck },
                };
                const config = roleConfig[role] || roleConfig.subscriber;
                const Icon = config.icon;

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${config.bg}`}>
                        <Icon className="w-3 h-3" />
                        {role}
                    </span>
                );
            },
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: (info) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.getValue() ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${info.getValue() ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {info.getValue() ? 'Active' : 'Locked'}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: (info) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(info.row.original)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(info.row.original.user_id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }),
    ], [onEdit, onDelete]);

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
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
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
                                        Loading users...
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className={`transition-colors ${editingId === row.original.user_id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
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