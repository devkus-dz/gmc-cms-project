import { supabase } from '../config/supabase.js';
import Media from '../models/Media.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * @desc    Upload file to Supabase Storage and save metadata in DB
 * @route   POST /api/v1/media/upload
 * @access  Protected (Admin/Author)
 * @returns {Object} The created media record with public URL
 */
export const uploadMedia = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json(errorResponse('No file provided'));

        // Generate unique filename
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('media')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (storageError) {
            return res.status(403).json(errorResponse(`Storage Error: ${storageError.message}`));
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

        // Save metadata to Database
        const mediaRecord = await Media.create({
            filename: fileName,
            original_name: req.file.originalname,
            file_path: publicUrl,
            file_type: req.file.mimetype.split('/')[0],
            file_size: req.file.size,
            mime_type: req.file.mimetype,
            uploaded_by: req.user.user_id
        });

        res.status(201).json(successResponse(mediaRecord, 'File uploaded successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Get all media records
 * @route   GET /api/v1/media
 * @access  Protected (Admin/Author)
 * @returns {Object} List of all uploaded media files
 */
export const getAllMedia = async (req, res) => {
    try {
        const media = await Media.findAll();
        res.json(successResponse(media));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete media from Database and Supabase Storage
 * @route   DELETE /api/v1/media/:id
 * @access  Protected (Admin only)
 * @returns {Object} Success message
 */
export const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from Database first to get the file path
        const media = await Media.delete(id);

        if (!media) return res.status(404).json(errorResponse('Media not found'));

        // Extract filename from the public URL to delete from cloud storage
        const urlParts = media.file_path.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const storagePath = `uploads/${fileName}`;

        // Remove from Supabase bucket
        await supabase.storage.from('media').remove([storagePath]);

        res.json(successResponse(null, 'Media deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};