'use client';

import { useState, useMemo } from 'react';
import { Edit, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

export interface CategoryItem {
    category_id: string;
    name: string;
    slug: string;
    description: string;
    parent_id: string | null;
    parent_name?: string;
    display_order: number;
}

interface CategoriesTableProps {
    data: CategoryItem[];
    isLoading: boolean;
    editingId: string | null;
    onEdit: (category: CategoryItem) => void;
    onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<CategoryItem>();

export default function CategoriesTable({ data, isLoading, editingId, onEdit, onDelete }: CategoriesTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: (info) => (
                <div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        {info.row.original.parent_id && <CornerDownRight className="w-4 h-4 text-slate-400" />}
                        {info.getValue()}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 ml-5">/{info.row.original.slug}</p>
                </div>
            ),
        }),
        columnHelper.accessor('parent_name', {
            header: 'Parent Category',
            cell: (info) => (
                <span className="text-sm text-slate-600">
                    {info.getValue() ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {info.getValue()}
                        </span>
                    ) : (
                        <span className="text-slate-400 italic">None</span>
                    )}
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
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(info.row.original.category_id)}
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
            {/* Search Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Table */}
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
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className={`transition-colors ${editingId === row.original.category_id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
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