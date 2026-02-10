import Post from '../models/Post.js';
import cacheService from '../services/cacheService.js';
import {
    successResponse,
    errorResponse,
    generateSlug,
    paginate
} from '../utils/helpers.js';

/**
 * @desc    Get all posts with pagination and status filter.
 * Uses caching to improve performance for frequent requests.
 * @route   GET /api/v1/posts
 * @access  Public
 * @returns {Object} JSON response with list of posts
 */
export const getAllPosts = async (req, res) => {
    try {
        const { page, limit, offset } = paginate(req.query.page, req.query.limit);
        const status = req.query.status || 'published';

        // Generate unique cache key based on query parameters
        const cacheKey = `posts_${page}_${limit}_${status}`;

        // Check Cache
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(successResponse(cachedData));
        }

        // Database Query
        const posts = await Post.findAll({ status, limit, offset });

        // Save to Cache
        cacheService.set(cacheKey, posts);

        res.json(successResponse(posts));
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
 * Clears the cache to ensure new content is visible immediately.
 * @route   POST /api/v1/posts
 * @access  Protected (Admin/Editor/Author)
 * @returns {Object} JSON response with the created post
 */
export const createPost = async (req, res) => {
    try {
        const { title } = req.body;

        const postData = {
            ...req.body,
            author_id: req.user.user_id,
            slug: generateSlug(title)
        };

        const post = await Post.create(postData);

        // Clear all cache to update lists
        cacheService.flush();

        res.status(201).json(successResponse(post, 'Post created successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update an existing post.
 * Clears specific post cache and general list cache.
 * @route   PUT /api/v1/posts/:id
 * @access  Protected (Admin/Editor/Author)
 * @returns {Object} JSON response with the updated post
 */
export const updatePost = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = generateSlug(req.body.title);
        }

        const post = await Post.update(req.params.id, req.body);

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        // Clear specific post cache and global lists
        cacheService.del(`post_${post.slug}`);
        cacheService.flush();

        res.json(successResponse(post, 'Post updated successfully'));
    } catch (error) {
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