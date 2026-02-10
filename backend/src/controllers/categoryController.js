import Category from '../models/Category.js';
import { successResponse, errorResponse, generateSlug } from '../utils/helpers.js';

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 * @returns {Object} JSON response with list of categories
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(successResponse(categories));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Protected (Admin/Editor)
 * @returns {Object} JSON response with the created category
 */
export const createCategory = async (req, res) => {
    try {
        const { name, description, parent_id } = req.body;

        // Generate URL-friendly slug from name
        const slug = generateSlug(name);

        const category = await Category.create({ name, slug, description, parent_id });

        res.status(201).json(successResponse(category, 'Category created successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update an existing category
 * @route   PUT /api/v1/categories/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} JSON response with the updated category
 */
export const updateCategory = async (req, res) => {
    try {
        const { name, description, parent_id, is_active } = req.body;

        // Only regenerate slug if name is updated
        const slug = name ? generateSlug(name) : undefined;

        const category = await Category.update(req.params.id, {
            name,
            slug,
            description,
            parent_id,
            is_active
        });

        if (!category) {
            return res.status(404).json(errorResponse('Category not found'));
        }

        res.json(successResponse(category, 'Category updated successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/v1/categories/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} JSON response with success message
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.delete(req.params.id);

        if (!category) {
            return res.status(404).json(errorResponse('Category not found'));
        }

        res.json(successResponse(null, 'Category deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};