'use client';

/**
 * @file frontend/components/admin/MediaLibrary.tsx
 * @description Reusable Media Library component matched to Supabase/Express backend.
 */

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

// Mapped exactly to your Express backend model
export interface MediaItem {
    id?: string;
    media_id?: string;
    file_path: string;     // The Supabase publicUrl
    original_name: string; // The original name uploaded by the user
    filename: string;      // The hashed name saved in DB
    created_at?: string;
}

interface MediaLibraryProps {
    onSelect?: (media: MediaItem) => void;
    isModal?: boolean;
}

export default function MediaLibrary({ onSelect, isModal = false }: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper function to safely get the ID whether your DB uses 'id' or 'media_id'
    const getItemId = (item: MediaItem) => item.media_id || item.id || '';

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/media');
            // Assuming your successResponse helper wraps data in 'data'
            setMedia(response.data.data || []);
        } catch (err: any) {
            console.error('Failed to fetch media:', err);
            setError('Could not load media. Please check your backend connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            // Since backend uses upload.single('image'), we send concurrent requests for multiple files
            const uploadPromises = Array.from(files).map((file) => {
                const formData = new FormData();
                formData.append('image', file); // Matches 'upload.single("image")'

                return api.post('/media/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            // Wait for all uploads to finish
            await Promise.all(uploadPromises);

            // Refresh the gallery
            fetchMedia();
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.message || 'Failed to upload image(s).');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (item: MediaItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const itemId = getItemId(item);

        try {
            // Calls your DELETE /api/v1/media/:id route
            await api.delete(`/media/${itemId}`);
            setMedia(media.filter((m) => getItemId(m) !== itemId));
        } catch (err: any) {
            console.error('Delete failed:', err);
            alert(err.response?.data?.message || 'Failed to delete image.');
        }
    };

    const copyToClipboard = (url: string, id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 w-full">

            {/* Header & Upload Action */}
            {!isModal && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Media Library</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your images and file uploads.</p>
                    </div>

                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            multiple // Allowed! Our frontend splits them into individual requests automatically
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                        >
                            {isUploading ? (
                                <span className="animate-pulse">Uploading...</span>
                            ) : (
                                <>
                                    <UploadCloud className="h-5 w-5" /> Upload Image
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 ${isModal ? 'border-none shadow-none p-0' : ''}`}>

                {isModal && (
                    <div className="mb-6 flex justify-end">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-slate-300">
                            <UploadCloud className="h-4 w-4" /> {isUploading ? 'Uploading...' : 'Upload New'}
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p>Loading your media...</p>
                    </div>
                ) : media.length === 0 && !error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <ImageIcon className="h-12 w-12 text-slate-300 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No media found</h3>
                        <p className="text-sm text-slate-500 max-w-sm mt-1">
                            Upload some images to use them in your articles.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {media.map((item) => (
                            <div
                                key={getItemId(item)}
                                onClick={() => onSelect && onSelect(item)}
                                className={`group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm ${onSelect ? 'cursor-pointer hover:ring-2 hover:ring-blue-500' : ''}`}
                            >
                                {/* Maps to the Supabase publicUrl */}
                                <img
                                    src={item.file_path}
                                    alt={item.original_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={(e) => copyToClipboard(item.file_path, getItemId(item), e)}
                                        className="p-2 bg-white text-slate-700 hover:text-blue-600 rounded-lg shadow-sm transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedId === getItemId(item) ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(item, e)}
                                        className="p-2 bg-white text-slate-700 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                                        title="Delete Image"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8 pointer-events-none">
                                    <p className="text-xs text-white truncate font-medium">{item.original_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}