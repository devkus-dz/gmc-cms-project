'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, User as UserIcon } from 'lucide-react';
import api from '../../../lib/axios';

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        avatar_url: '',
    });

    const [userRole, setUserRole] = useState('');
    const [username, setUsername] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/me');
                const user = response.data.data;

                // These are editable
                setFormData({
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    bio: user.bio || '',
                    avatar_url: user.avatar || '',
                });

                // These are read-only for the user
                setUserRole(user.role);
                setUsername(user.username);

            } catch (err: any) {
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await api.put('/users/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Refresh the page so the sidebar avatar updates immediately
            setTimeout(() => window.location.reload(), 1500);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-slate-500">Loading profile...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your personal information and biography.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                    <p>{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">

                {/* Read Only Info */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon className="h-8 w-8 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{username}</h3>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold capitalize">
                            Role: {userRole}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
                    <input
                        type="url"
                        placeholder="https://example.com/my-photo.jpg"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-1">Provide a direct link to an image. (You can copy an image URL from the Media Library)</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Author Biography</label>
                    <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-none"
                        placeholder="Tell your readers a little about yourself..."
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>

            </form>
        </div>
    );
}