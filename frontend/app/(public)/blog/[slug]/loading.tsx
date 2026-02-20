/**
 * @file frontend/app/(public)/blog/[slug]/loading.tsx
 * @description Automatic loading skeleton shown while the post data is being fetched.
 */

export default function LoadingPost() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 animate-pulse">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="w-32 h-4 bg-slate-200 rounded mb-10"></div>

                <div className="space-y-4 mb-10">
                    <div className="h-12 bg-slate-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-12 bg-slate-200 rounded w-1/2 mx-auto"></div>
                </div>

                <div className="flex justify-center gap-8 mb-12">
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                </div>

                <div className="w-full aspect-video bg-slate-200 rounded-2xl mb-12"></div>

                <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
            </div>
        </div>
    );
}