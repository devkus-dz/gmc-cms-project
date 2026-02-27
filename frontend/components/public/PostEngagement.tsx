'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageSquare, User as UserIcon } from 'lucide-react';
import api from '../../lib/axios';
import { format } from 'date-fns';

interface PostEngagementProps {
    postId: string;
    initialLikes: number;
    allowComments: boolean;
}

/**
 * @function PostEngagement
 * @description Manages likes via localStorage and displays comments with author names.
 * @param {PostEngagementProps} props - The component props.
 */
export default function PostEngagement({ postId, initialLikes, allowComments }: PostEngagementProps) {
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes || 0);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const LIKED_STORAGE_KEY = `liked_post_${postId}`;

    useEffect(() => {
        /**
         * @function initEngagement
         * @description Checks localStorage for existing like and fetches comments.
         */
        const initEngagement = async () => {
            // Check if this browser has already liked the post
            if (localStorage.getItem(LIKED_STORAGE_KEY)) {
                setHasLiked(true);
            }

            if (allowComments) {
                try {
                    const res = await api.get(`/comments/post/${postId}`);
                    setComments(res.data.data || []);
                } catch (err) {
                    console.error('Failed to fetch comments', err);
                }
            }
        };

        initEngagement();
    }, [postId, allowComments, LIKED_STORAGE_KEY]);

    /**
     * @function handleToggleLike
     * @description Toggles the like state locally and updates the database.
     */
    const handleToggleLike = async () => {
        const currentlyLiked = hasLiked;

        // Optimistic UI update
        setHasLiked(!currentlyLiked);
        setLikeCount(prev => currentlyLiked ? prev - 1 : prev + 1);

        try {
            if (currentlyLiked) {
                await api.post(`/posts/${postId}/unlike`);
                localStorage.removeItem(LIKED_STORAGE_KEY);
            } else {
                await api.post(`/posts/${postId}/like`);
                localStorage.setItem(LIKED_STORAGE_KEY, 'true');
            }
        } catch (err) {
            // Revert UI on error
            setHasLiked(currentlyLiked);
            setLikeCount(prev => currentlyLiked ? prev + 1 : prev - 1);
            console.error('Like action failed', err);
        }
    };

    /**
     * @function handleCommentSubmit
     * @description Submits a comment for moderation.
     */
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post('/comments', { post_id: postId, content: newComment });
            setNewComment('');
            setMessage({ type: 'success', text: 'Comment submitted and awaiting moderation.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to submit comment.' });
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
                    onClick={handleToggleLike}
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

                    <form onSubmit={handleCommentSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        {message && (
                            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                            placeholder="Share your thoughts..."
                        />
                        <button type="submit" disabled={isSubmitting || !newComment.trim()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors">
                            {isSubmitting ? 'Submitting...' : 'Post Comment'}
                        </button>
                    </form>

                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.comment_id} className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300 overflow-hidden">
                                    {comment.avatar ? (
                                        <img src={comment.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-5 w-5 text-slate-500" />
                                    )}
                                </div>
                                <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        {/* Displaying Author Name mapped from join u.username */}
                                        <span className="font-bold text-slate-900">{comment.username || 'Anonymous'}</span>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(comment.created_at), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}