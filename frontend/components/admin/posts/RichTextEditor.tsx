'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading2, Image as ImageIcon, X } from 'lucide-react';
import MediaLibrary, { MediaItem } from '../MediaLibrary';

/**
 * @interface RichTextEditorProps
 * @description Properties for the RichTextEditor component.
 */
interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * @interface MenuBarProps
 * @description Properties for the MenuBar component.
 */
interface MenuBarProps {
    editor: any;
    onOpenMedia: () => void;
}

/**
 * @function MenuBar
 * @description Renders the formatting toolbar for the Tiptap editor.
 * @param {MenuBarProps} props - Component properties.
 * @returns {JSX.Element|null} The toolbar component.
 */
const MenuBar = ({ editor, onOpenMedia }: MenuBarProps) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-slate-600'}`}
                title="Numbered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>

            <button
                type="button"
                onClick={onOpenMedia}
                className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-600"
                title="Insert Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

/**
 * @function RichTextEditor
 * @description A modern, Tailwind-styled WYSIWYG editor using Tiptap with Media Library integration.
 * @param {RichTextEditorProps} props - Component properties.
 * @returns {JSX.Element} The rendered editor.
 */
export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [showMediaModal, setShowMediaModal] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4 border border-slate-200 shadow-sm', // Beautiful styling for embedded images
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none p-4 focus:outline-none min-h-[350px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    /**
     * @function handleMediaSelect
     * @description Inserts the selected image URL directly into the editor.
     * @param {MediaItem} media - The media item selected from the library.
     * @returns {void}
     */
    const handleMediaSelect = (media: MediaItem) => {
        if (editor) {
            editor.chain().focus().setImage({ src: media.file_path, alt: media.original_name }).run();
        }
        setShowMediaModal(false);
    };

    return (
        <>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all relative">
                <MenuBar editor={editor} onOpenMedia={() => setShowMediaModal(true)} />
                <EditorContent editor={editor} className="cursor-text bg-white" onClick={() => editor?.chain().focus().run()} />
            </div>

            {showMediaModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Insert Image</h3>
                            <button
                                type="button"
                                onClick={() => setShowMediaModal(false)}
                                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <MediaLibrary onSelect={handleMediaSelect} isModal={true} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}