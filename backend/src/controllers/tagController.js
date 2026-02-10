import Tag from '../models/Tag.js';
import { successResponse, errorResponse, generateSlug } from '../utils/helpers.js';

/**
 * @desc    Get all tags
 * @route   GET /api/v1/tags
 * @access  Public
 * @returns {Object} List of all tags
 */
export const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(successResponse(tags));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Create a new tag
 * @route   POST /api/v1/tags
 * @access  Protected (Admin/Editor)
 * @returns {Object} The created tag
 */
export const createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Generate URL-friendly slug
        const slug = generateSlug(name);

        const tag = await Tag.create({ name, slug, description });

        res.status(201).json(successResponse(tag, 'Tag created successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete a tag
 * @route   DELETE /api/v1/tags/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} Success message
 */
export const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.delete(req.params.id);

        if (!tag) {
            return res.status(404).json(errorResponse('Tag not found'));
        }

        res.json(successResponse(null, 'Tag deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};