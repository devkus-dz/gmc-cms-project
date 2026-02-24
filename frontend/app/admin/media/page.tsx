/**
 * @file frontend/app/(admin)/media/page.tsx
 * @description The main Media Library page layout for the Admin Dashboard.
 */

import MediaLibrary from '../../../components/admin/MediaLibrary';

export default function MediaPage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* We simply render our new reusable component here.
        Because we don't pass 'isModal=true', it will render with the full page headers. 
      */}
            <MediaLibrary />
        </div>
    );
}