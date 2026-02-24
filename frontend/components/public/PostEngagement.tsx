'use client';

/**
 * @file frontend/components/public/PostEngagement.tsx
 * @description Client component handling post views, likes, and comments.
 */

import { useState, useEffect } from 'react';
import { Heart, MessageSquare, User as UserIcon } from 'lucide-react';
import api from '../../lib/axios';
import { format } from 'date-fns';

interface PostEngagementProps {
    postId: string;
    initialLikes: number;
    allowComments: boolean;
}

export default function PostEngagement({ postId, initialLikes, allowComments }: PostEngagementProps) {
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes || 0);
    const [comments, setComments] = useState<any[]>([]);

    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        // 1. Record the view (runs only once per browser session per post)
        const recordView = async () => {
            const viewedKey = `viewed_post_${postId}`;
            if (!sessionStorage.getItem(viewedKey)) {
                try {
                    await api.post(`/posts/${postId}/view`);
                    sessionStorage.setItem(viewedKey, 'true');
                } catch (err) {
                    console.error('Failed to record view', err);
                }
            }
        };

        // 2. Fetch approved comments
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/post/${postId}`);
                setComments(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch comments', err);
            }
        };

        recordView();
        if (allowComments) fetchComments();
    }, [postId, allowComments]);

    /**
     * @function handleLike
     * @description Optimistically increments the like count and updates the backend.
     */
    const handleLike = async () => {
        if (hasLiked) return;

        setHasLiked(true);
        setLikeCount(prev => prev + 1);

        try {
            await api.post(`/posts/${postId}/like`);
        } catch (err) {
            setHasLiked(false);
            setLikeCount(prev => prev - 1);
            console.error('Failed to like post:', err);
        }
    };

    /**
     * @function handleCommentSubmit
     * @description Submits a new comment to the backend for moderation.
     */
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            await api.post('/comments', {
                post_id: postId,
                content: newComment
            });

            setNewComment('');
            setMessage({ type: 'success', text: 'Your comment has been submitted and is awaiting moderation.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit comment.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-12">

            {/* LIKES SECTION */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Did you enjoy this article?</h3>
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${hasLiked
                        ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount} Likes</span>
                </button>
            </div>

            {/* COMMENTS SECTION */}
            {allowComments && (
                <section className="space-y-8">
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Comments ({comments.length})
                    </h3>

                    {/* Comment Form */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="text-lg font-bold text-slate-800 mb-4">Leave a Reply</h4>

                        {message && (
                            <div className={`p-4 mb-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                placeholder="Share your thoughts..."
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors"
                            >
                                {isSubmitting ? 'Submitting...' : 'Post Comment'}
                            </button>
                        </form>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-6 mt-8">
                        {comments.length === 0 ? (
                            <p className="text-slate-500 text-center italic py-4">No comments yet. Be the first to share your thoughts!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.comment_id} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300 overflow-hidden">
                                        {comment.author_avatar ? (
                                            <img src={comment.author_avatar} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-5 w-5 text-slate-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-slate-900">{comment.author_name}</span>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(comment.created_at), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}