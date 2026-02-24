'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, User as UserIcon, Monitor, Clock } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export interface ActivityItem {
    log_id: string;
    user_id: string | null;
    username: string | null;
    avatar: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    description: string;
    ip_address: string;
    created_at: string;
}

interface ActivityTableProps {
    data: ActivityItem[];
    isLoading: boolean;
}

const columnHelper = createColumnHelper<ActivityItem>();

export default function ActivityTable({ data, isLoading }: ActivityTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(() => [
        columnHelper.accessor('created_at', {
            header: 'Date & Time',
            cell: (info) => {
                const date = new Date(info.getValue());
                return (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                            <p className="font-medium">{date.toLocaleDateString()}</p>
                            <p className="text-xs text-slate-400">{date.toLocaleTimeString()}</p>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('username', {
            header: 'User',
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {info.row.original.avatar ? (
                            <img src={info.row.original.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon className="h-4 w-4 text-slate-400" />
                        )}
                    </div>
                    <span className="font-semibold text-slate-900">{info.getValue() || 'System'}</span>
                </div>
            ),
        }),
        columnHelper.accessor('action', {
            header: 'Action',
            cell: (info) => {
                const action = info.getValue().toUpperCase();
                let bg = 'bg-slate-100 text-slate-700'; // Default

                if (action.includes('CREATE') || action.includes('ADD') || action.includes('LOGIN')) bg = 'bg-emerald-100 text-emerald-700';
                if (action.includes('UPDATE') || action.includes('EDIT')) bg = 'bg-blue-100 text-blue-700';
                if (action.includes('DELETE') || action.includes('REMOVE') || action.includes('FAILED')) bg = 'bg-red-100 text-red-700';

                return (
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${bg}`}>
                        {action}
                    </span>
                );
            },
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: (info) => (
                <div>
                    <p className="text-sm text-slate-700">{info.getValue()}</p>
                    {info.row.original.entity_type && (
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                            {info.row.original.entity_type.toUpperCase()} #{info.row.original.entity_id}
                        </p>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('ip_address', {
            header: 'Network',
            cell: (info) => (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Monitor className="w-3 h-3 shrink-0" />
                    {info.getValue() || 'Unknown IP'}
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    return (
        <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs by action, user, or IP..."
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
                                        Loading audit trail...
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No activity logs found.
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