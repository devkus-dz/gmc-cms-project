/**
 * @file frontend/app/(admin)/posts/new/page.tsx
 * @description Page for creating a new post.
 */

import { JSX } from 'react';
import PostEditor from '../../../../components/admin/posts/PostEditor';

/**
 * @function CreatePostPage
 * @description Renders the PostEditor in creation mode.
 * @returns {JSX.Element} The rendered page.
 */
export default function CreatePostPage(): JSX.Element {
    return <PostEditor />;
}