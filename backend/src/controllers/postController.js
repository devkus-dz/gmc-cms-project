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
 * @function getAllPosts
 * @description Retrieves posts. Bypasses status filter if 'all' is requested by admin.
 * @route GET /api/v1/posts
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the list of posts.
 */
export const getAllPosts = async (req, res) => {
    try {
        const status = req.query.status || 'all';
        const posts = await Post.findAll({ status });

        res.json(successResponse(posts));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function getPostBySlug
 * @description Retrieves a single post by its slug.
 * @route GET /api/v1/posts/:slug
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with post details.
 */
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const cacheKey = `post_${slug}`;

        const cachedPost = cacheService.get(cacheKey);
        if (cachedPost) {
            return res.json(successResponse(cachedPost));
        }

        const post = await Post.findBySlug(slug);

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        await Post.incrementViews(post.post_id);

        cacheService.set(cacheKey, post);

        res.json(successResponse(post));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function createPost
 * @description Creates a new post and formats dates for PostgreSQL strict constraints.
 * @route POST /api/v1/posts
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the created post.
 */
export const createPost = async (req, res) => {
    try {
        const postData = { ...req.body, author_id: req.user.user_id };
        const newPost = await Post.create(postData);

        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'CREATE_POST',
            entity_type: 'post',
            entity_id: newPost.post_id,
            description: `Created new post: "${newPost.title}"`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        cacheService.flush();

        res.status(201).json(successResponse(newPost, 'Post created successfully'));
    } catch (error) {
        if (error.code === '23505') return res.status(400).json(errorResponse('A post with this slug already exists.'));
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function updatePost
 * @description Updates an existing post and safely formats SQL dates.
 * @route PUT /api/v1/posts/:id
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response with the updated post.
 */
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPost = await Post.update(id, req.body);

        if (!updatedPost) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'UPDATE_POST',
            entity_type: 'post',
            entity_id: id,
            description: `Updated post: "${updatedPost.title}"`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        cacheService.flush();

        res.json(successResponse(updatedPost, 'Post updated successfully'));
    } catch (error) {
        if (error.code === '23505') return res.status(400).json(errorResponse('A post with this slug already exists.'));
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function deletePost
 * @description Deletes a post from the database and flushes the cache.
 * @route DELETE /api/v1/posts/:id
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} JSON response indicating successful deletion.
 */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id); // Fetch it first so we can log the title!

        if (!post) {
            return res.status(404).json(errorResponse('Post not found'));
        }

        await Post.delete(id);

        await ActivityLog.log({
            user_id: req.user.user_id,
            action: 'DELETE_POST',
            entity_type: 'post',
            entity_id: id,
            description: `Deleted post: "${post.title}"`,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

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
        res.json(successResponse(null, 'Post liked successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to like post'));
    }
};