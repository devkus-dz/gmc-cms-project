'use client';

/**
 * @file frontend/components/admin/posts/PostEditor.tsx
 * @description The core unified form for creating and editing posts.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, X, AlertCircle, Trash2 } from 'lucide-react';
import api from '../../../lib/axios';
import MediaLibrary, { MediaItem } from '../MediaLibrary';
import RichTextEditor from './RichTextEditor';

/**
 * @interface PostFormData
 * @description Data structure for the post editor state including SEO and meta fields.
 */
export interface PostFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'published' | 'draft' | 'archived';
    category_id: string;
    featured_image: string | null;
    published_at: string;
    tags: string[];
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    allow_comments: boolean;
    reading_time: number;
}

/**
 * @interface PostEditorProps
 * @description Props for the PostEditor component.
 */
interface PostEditorProps {
    initialData?: PostFormData;
    postId?: string;
    isEdit?: boolean;
}

/**
 * @interface Category
 * @description Data structure for category selection.
 */
interface Category {
    category_id: string;
    name: string;
}

/**
 * @interface Tag
 * @description Data structure for tag selection.
 */
interface Tag {
    tag_id: string;
    name: string;
}

/**
 * @function PostEditor
 * @description Unified form component for creating and updating blog posts.
 * @param {PostEditorProps} props - Component properties.
 * @returns {JSX.Element} The rendered Post Editor component.
 */
export default function PostEditor({ initialData, postId, isEdit = false }: PostEditorProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<PostFormData>(
        initialData || {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            status: 'draft',
            category_id: '',
            featured_image: null,
            published_at: new Date().toISOString().slice(0, 16),
            tags: [],
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            allow_comments: true,
            reading_time: 0,
        }
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showMediaModal, setShowMediaModal] = useState(false);

    useEffect(() => {
        fetchTaxonomies();
    }, []);

    /**
     * @function fetchTaxonomies
     * @description Retrieves the lists of categories and tags from the API simultaneously.
     * @returns {Promise<void>}
     */
    const fetchTaxonomies = async () => {
        try {
            const [catRes, tagRes] = await Promise.all([
                api.get('/categories').catch(() => ({ data: { data: [] } })),
                api.get('/tags').catch(() => ({ data: { data: [] } }))
            ]);
            setCategories(catRes.data?.data || []);
            setAvailableTags(tagRes.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch taxonomies:', err);
        }
    };

    /**
     * @function generateSlug
     * @description Converts a title string into a URL-friendly slug.
     * @param {string} title - The input title.
     * @returns {string} The formatted slug.
     */
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    /**
     * @function handleTitleChange
     * @description Updates the title and auto-generates the slug if not editing.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     * @returns {void}
     */
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title: newTitle,
            slug: !isEdit && prev.slug === generateSlug(prev.title) ? generateSlug(newTitle) : prev.slug,
        }));
    };

    /**
     * @function handleTagToggle
     * @description Toggles the selection state of a specific tag ID.
     * @param {string} tagId - The ID of the tag to toggle.
     * @returns {void}
     */
    const handleTagToggle = (tagId: string | number): void => {
        const idStr = String(tagId); // Force to string
        setFormData((prev) => {
            const isSelected = prev.tags.includes(idStr);
            return {
                ...prev,
                tags: isSelected
                    ? prev.tags.filter(id => id !== idStr)
                    : [...prev.tags, idStr]
            };
        });
    };

    /**
     * @function calculateReadingTime
     * @description Auto-calculates reading time based on a 225 words/minute average.
     * @returns {void}
     */
    const calculateReadingTime = () => {
        const text = formData.content.replace(/<[^>]+>/g, '');
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const minutes = Math.ceil(wordCount / 225);
        setFormData(prev => ({ ...prev, reading_time: minutes || 1 }));
    };

    /**
     * @function handleSubmit
     * @description Validates and submits the post data to the API.
     * @param {React.FormEvent} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title || !formData.content || !formData.category_id) {
            setError('Title, content, and category are required.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEdit && postId) {
                await api.put(`/posts/${postId}`, formData);
            } else {
                await api.post('/posts', formData);
            }
            router.push('/admin/posts');
        } catch (err: any) {
            console.error('Submission failed:', err);
            setError(err.response?.data?.message || 'Failed to save post.');
            setIsSubmitting(false);
        }
    };

    /**
     * @function handleMediaSelect
     * @description Updates the featured image state and closes the modal.
     * @param {MediaItem} media - The selected media item.
     * @returns {void}
     */
    const handleMediaSelect = (media: MediaItem) => {
        setFormData((prev) => ({ ...prev, featured_image: media.file_path }));
        setShowMediaModal(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isEdit ? 'Update your content details below.' : 'Draft a new article for your CMS.'}
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Post'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- MAIN CONTENT COLUMN (LEFT) --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Primary Editor Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Post Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Enter an engaging title..."
                                className="w-full px-4 py-2 text-lg bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                            <div className="flex items-center">
                                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 text-sm">
                                    /blog/
                                </span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                    </div>

                    {/* SEO & Excerpt Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Search Engine Optimization</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Post Excerpt (Summary)</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none"
                                placeholder="A brief summary of the post. Also used for social media sharing..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.meta_title}
                                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                    placeholder="SEO Title (Leave blank to use Post Title)"
                                />
                                <p className="text-xs text-slate-400 mt-1">Recommended: 50-60 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={formData.meta_keywords}
                                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                    placeholder="react, nextjs, seo..."
                                />
                                <p className="text-xs text-slate-400 mt-1">Comma separated keywords</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                            <textarea
                                rows={2}
                                value={formData.meta_description}
                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none"
                                placeholder="A compelling description for search engine results..."
                            />
                            <p className={`text-xs mt-1 ${formData.meta_description.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                                {formData.meta_description.length}/160 characters
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SIDEBAR COLUMN (RIGHT) --- */}
                <div className="space-y-6">
                    {/* Publishing Options Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
                            <input
                                type="datetime-local"
                                value={formData.published_at}
                                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.category_id} value={cat.category_id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">No tags available.</p>
                                ) : (
                                    availableTags.map((tag) => {
                                        // Force the tag_id to a string for a perfect match!
                                        const tagIdStr = String(tag.tag_id);
                                        const isSelected = formData.tags.includes(tagIdStr);

                                        return (
                                            <button
                                                key={tag.tag_id}
                                                type="button"
                                                onClick={() => handleTagToggle(tag.tag_id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${isSelected
                                                        ? 'bg-blue-100 border-blue-200 text-blue-700'
                                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {tag.name}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Post Options Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Post Options</h3>

                        {/* Reading Time */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">Reading Time (mins)</label>
                                <button type="button" onClick={calculateReadingTime} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Auto-calc
                                </button>
                            </div>
                            <input
                                type="number"
                                min="1"
                                value={formData.reading_time}
                                onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            />
                        </div>

                        {/* Allow Comments Toggle */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="text-sm font-medium text-slate-700 cursor-pointer" htmlFor="allow_comments">
                                Allow Comments
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    id="allow_comments"
                                    checked={formData.allow_comments}
                                    onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out z-10"
                                    style={{ transform: formData.allow_comments ? 'translateX(100%)' : 'translateX(0)', borderColor: formData.allow_comments ? '#2563eb' : '#cbd5e1' }}
                                />
                                <label htmlFor="allow_comments" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${formData.allow_comments ? 'bg-blue-600' : 'bg-slate-300'}`}></label>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Featured Image</label>
                        {formData.featured_image ? (
                            <div className="space-y-3">
                                <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 relative group">
                                    <img src={formData.featured_image} alt="Featured" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, featured_image: null })}
                                            className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(true)}
                                className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all"
                            >
                                <ImageIcon className="h-8 w-8" />
                                <span className="text-sm font-medium">Select Image</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Select Media</h3>
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(false)}
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <MediaLibrary onSelect={handleMediaSelect} isModal={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}