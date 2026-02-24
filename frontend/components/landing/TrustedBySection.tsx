import { JSX } from 'react';
import { GraduationCap, BookOpen, Library, Award, Globe } from 'lucide-react';

/**
 * @file frontend/components/landing/TrustedBySection.tsx
 * @description Section showing logos of universities/institutions that trust EduCMS.
 * Uses Lucide icons and text to simulate real logos.
 * @returns {JSX.Element} The Trusted By Section component.
 */
export default function TrustedBySection(): JSX.Element {
    return (
        <section className="py-10 bg-slate-100 border-y border-slate-200 text-center">
            {/* The design shows a light blue/gray horizontal band */}
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">
                    Trusted by
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">

                    {/* Fake Logo 1 */}
                    <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-default">
                        <Library className="h-6 w-6" />
                        <span className="font-bold text-lg tracking-tight">State University</span>
                    </div>

                    {/* Fake Logo 2 */}
                    <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-default">
                        <GraduationCap className="h-7 w-7" />
                        <span className="font-bold text-lg tracking-tight">GlobalEdu</span>
                    </div>

                    {/* Fake Logo 3 */}
                    <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-default">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-bold text-lg tracking-tight">CodeAcademy</span>
                    </div>

                    {/* Fake Logo 4 */}
                    <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-default">
                        <Award className="h-6 w-6" />
                        <span className="font-bold text-lg tracking-tight">DevInstitute</span>
                    </div>

                    {/* Fake Logo 5 */}
                    <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 cursor-default">
                        <Globe className="h-6 w-6" />
                        <span className="font-bold text-lg tracking-tight">WebScholars</span>
                    </div>

                </div>
            </div>
        </section>
    );
}