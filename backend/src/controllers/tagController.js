import Tag from '../models/Tag.js';
import { successResponse, errorResponse, generateSlug } from '../utils/helpers.js';

export const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(successResponse(tags));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const createTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = generateSlug(name);
        const tag = await Tag.create({ name, slug, description });
        res.status(201).json(successResponse(tag, 'Tag created successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

// NEW: Update Tag function
export const updateTag = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = generateSlug(name); // Regenerate slug based on new name

        const tag = await Tag.update(req.params.id, { name, slug, description });

        if (!tag) {
            return res.status(404).json(errorResponse('Tag not found'));
        }
        res.json(successResponse(tag, 'Tag updated successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

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