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
 * @function updateCategory
 * @description Updates an existing category by its ID.
 * @route PUT /api/v1/categories/:id
 */
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.update(id, req.body);

        if (!updatedCategory) {
            return res.status(404).json(errorResponse('Category not found'));
        }

        res.json(successResponse(updatedCategory, 'Category updated successfully'));
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json(errorResponse('A category with this name or slug already exists.'));
        }
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @function deleteCategory
 * @description Deletes a category from the database.
 * @route DELETE /api/v1/categories/:id
 */
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json(errorResponse('Category not found'));
        }

        await Category.delete(id);
        res.json(successResponse(null, 'Category deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};