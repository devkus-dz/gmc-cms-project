'use client';

import { AlertTriangle, X, Loader2 } from 'lucide-react';

/**
 * @interface DeleteConfirmationModalProps
 * @description Props for the reusable delete confirmation modal.
 */
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    itemName: string;
    isDeleting?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * @function DeleteConfirmationModal
 * @description A stylized modal to confirm destructive actions.
 * @param {DeleteConfirmationModalProps} props - Component properties.
 * @returns {JSX.Element | null}
 */
export default function DeleteConfirmationModal({ isOpen, itemName, isDeleting = false, onClose, onConfirm }: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="text-lg font-bold">Confirm Deletion</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-600">
                        Are you sure you want to delete <span className="font-bold text-slate-900">"{itemName}"</span>?
                        This action cannot be undone and will permanently remove it from the database.
                    </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400"
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>

            </div>
        </div>
    );
}