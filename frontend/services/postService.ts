/**
 * @file frontend/services/postService.ts
 * @description API service for fetching and managing blog posts and announcements.
 */

import api from '../lib/axios';
import { Post, ApiResponse } from '../types';

export const postService = {
  /**
   * Fetches a paginated list of published posts.
   * @param {number} page - The page number to fetch.
   * @param {number} limit - Number of posts per page.
   * @returns {Promise<ApiResponse<Post[]>>} A promise resolving to the list of posts.
   */
  async getAllPosts(page = 1, limit = 10): Promise<ApiResponse<Post[]>> {
    const response = await api.get<ApiResponse<Post[]>>(`/posts`, {
      params: { page, limit, status: 'published' }
    });
    return response.data;
  },

  /**
   * Fetches a single post by its unique slug.
   * @param {string} slug - The URL-friendly slug of the post.
   * @returns {Promise<ApiResponse<Post>>} A promise resolving to the post details.
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    const response = await api.get<ApiResponse<Post>>(`/posts/${slug}`);
    return response.data;
  }
};