/**
 * @file src/types/index.ts
 * @description Core type definitions for EduCMS.
 * Defines the shape of data for Users, Content, and Educational Resources.
 */

// ==========================================
// 🔐 Auth & Users
// ==========================================

/**
 * User Roles specifically for an Educational Context.
 */
export type UserRole = 'admin' | 'editor' | 'teacher' | 'student' | 'subscriber';

/**
 * Represents a User in the EduCMS system.
 */
export interface User {
    user_id: number;
    username: string;
    email: string;
    role: UserRole;
    avatar_url?: string; // Profile picture
    created_at: string;
    // We strictly exclude passwords from frontend types
}

/**
 * Payload returned upon successful login/registration.
 */
export interface AuthResponse {
    user: User;
    token: string;
}

// ==========================================
// 📚 Content Management (Blog & Articles)
// ==========================================

export type PostStatus = 'draft' | 'published' | 'archived';

/**
 * Represents a Blog Post, Article, or Announcement.
 */
export interface Post {
    post_id: number;
    title: string;
    slug: string;
    content: string; // HTML or Markdown content
    excerpt?: string;
    featured_image?: string;
    status: PostStatus;
    author_id: number;
    author?: User;
    views: number;
    created_at: string;
    updated_at: string;
    category_id?: number;
    category?: Category;
    tags?: Tag[];
}

/**
 * Represents a Comment on educational content.
 */
export interface Comment {
    comment_id: number;
    post_id: number;
    user_id: number;
    parent_id?: number | null;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    user?: User; // Joined User Data
    created_at: string;
}

// ==========================================
// 🎓 Educational Entities (Future Proofing)
// ==========================================

/**
 * Represents a Course or Subject.
 */
export interface Course {
    course_id: number;
    title: string;
    description: string;
    teacher_id: number;
    status: 'active' | 'inactive';
}

// ==========================================
// 🌐 API Utilities
// ==========================================

/**
 * Standard API Response wrapper.
 * @template T - The type of data returned (e.g., User, Post[])
 */
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


export interface Category {
    category_id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Tag {
    tag_id: number;
    name: string;
    slug: string;
}
