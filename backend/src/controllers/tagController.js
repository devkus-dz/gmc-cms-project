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
 * @function updateTag
 * @description Updates an existing tag by its ID.
 * @route PUT /api/v1/tags/:id
 */
export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        const updatedTag = await Tag.update(id, { name, slug, description });

        if (!updatedTag) {
            return res.status(404).json(errorResponse('Tag not found'));
        }

        res.json(successResponse(updatedTag, 'Tag updated successfully'));
    } catch (error) {
        // Handle unique constraint errors (e.g., user tries to use a slug that already exists)
        if (error.code === '23505') {
            return res.status(400).json(errorResponse('A tag with this name or slug already exists.'));
        }
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @function deleteTag
 * @description Deletes a tag from the database.
 * @route DELETE /api/v1/tags/:id
 */
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the tag exists before deleting
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json(errorResponse('Tag not found'));
        }

        await Tag.delete(id);
        res.json(successResponse(null, 'Tag deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};