import Post from '../models/Post.js';
import cacheService from '../services/cacheService.js';
import {
    successResponse,
    errorResponse,
    generateSlug,
    paginate
} from '../utils/helpers.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Get all posts with pagination, search, and status filter.
 * @route   GET /api/v1/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
    try {
        const { page, limit, offset } = paginate(req.query.page, req.query.limit);
        const status = req.query.status || 'published';
        const search = req.query.search || '';

        // Generate unique cache key
        const cacheKey = `posts_${page}_${limit}_${status}_${search}`;

        // Check Cache
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(successResponse(cachedData));
        }

        // Database Query
        const result = await Post.findAll({ status, limit, offset, search });

        const responseData = {
            items: result.posts,
            pagination: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        };

        // Save to Cache
        cacheService.set(cacheKey, responseData);

        res.json(successResponse(responseData));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Get a single post by its slug.
 * Checks cache first, then database. Increments view count on retrieval.
 * @route   GET /api/v1/posts/:slug
 * @access  Public
 * @returns {Object} JSON response with post details
 */
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const cacheKey = `post_${slug}`;

        // Check Cache
        const cachedPost = cacheService.get(cacheKey);
        if (cachedPost) {
            return res.json(successResponse(cachedPost));
        }

        // Database Query
        const post = await Post.findBySlug(slug);

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        // Increment view count (Side effect, does not block response)
        await Post.incrementViews(post.post_id);

        // Save to Cache
        cacheService.set(cacheKey, post);

        res.json(successResponse(post));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Create a new post.
 * @route   POST /api/v1/posts
 * @access  Protected (Admin/Editor/Author)
 */
export const createPost = async (req, res) => {
    try {
        // Auto-generate a slug if the frontend missed it
        if (!req.body.slug && req.body.title) {
            req.body.slug = generateSlug(req.body.title);
        }

        // Pass the body to our newly upgraded create method
        const postData = { ...req.body, author_id: req.user.user_id };
        const newPost = await Post.create(postData);

        // Log the activity
        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'CREATE_POST',
            entity_type: 'post',
            entity_id: newPost.post_id,
            description: `Created new post: "${newPost.title}"`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        // Clear the cache so the new post appears immediately
        cacheService.flush();

        res.status(201).json(successResponse(newPost, 'Post created successfully'));
    } catch (error) {
        console.error("Post Creation Error:", error);
        if (error.code === '23505') {
            return res.status(400).json(errorResponse('A post with this slug already exists.'));
        }
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update an existing post.
 * @route   PUT /api/v1/posts/:id
 */
export const updatePost = async (req, res) => {
    try {
        if (req.body.title && !req.body.slug) {
            req.body.slug = generateSlug(req.body.title);
        }
        const post = await Post.update(req.params.id, req.body);

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        // Log the activity
        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'UPDATE_POST',
            entity_type: 'post',
            entity_id: post.post_id,
            description: `Updated post: "${post.title}"`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        cacheService.del(`post_${post.slug}`);
        cacheService.flush();

        res.json(successResponse(post, 'Post updated successfully'));
    } catch (error) {
        console.error("Post Update Error:", error);
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete a post.
 * Clears cache to remove the deleted post from lists.
 * @route   DELETE /api/v1/posts/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} JSON response with success message
 */
export const deletePost = async (req, res) => {
    try {
        const post = await Post.delete(req.params.id);

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        // Clear cache
        cacheService.flush();

        res.json(successResponse(null, 'Post deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }


};

/**
 * @function incrementPostView
 * @description Records a new view for a post.
 */
export const incrementPostView = async (req, res) => {
    try {
        const { id } = req.params;
        await Post.incrementViews(id);
        cacheService.flush();

        res.json(successResponse(null, 'View recorded successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to record view'));
    }
};

/**
 * @function likePost
 * @description Adds a like to a post.
 */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        await Post.incrementLikes(id);
        cacheService.flush();

        res.json(successResponse(null, 'Post liked successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to like post'));
    }
};

/**
 * @function unlikePost
 * @description Decrements the like count and flushes the cache.
 */
export const unlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        await Post.decrementLikes(id);
        cacheService.flush();
        res.json(successResponse(null, 'Like removed successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to remove like'));
    }
};