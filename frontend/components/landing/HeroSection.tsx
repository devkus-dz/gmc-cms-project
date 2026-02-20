import { PlayCircle, ArrowRight } from 'lucide-react';
import { JSX } from 'react';

/**
 * @file frontend/components/landing/HeroSection.tsx
 * @description The main hero section featuring a centered headline and dashboard preview.
 * @returns {JSX.Element} The Hero Section component.
 */
export default function HeroSection(): JSX.Element {
    return (
        <section className="pt-24 pb-16 px-4 text-center bg-slate-50">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                    Unlock Your Potential <br />
                    <span className="text-blue-600">with EduCMS.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    The most engaging platform for modern learning. Interactive, accessible, and built for institutions that demand the best.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all">
                        Get Started for Free <ArrowRight className="h-4 w-4" />
                    </button>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all">
                        <PlayCircle className="h-4 w-4 text-blue-600" /> Watch Video
                    </button>
                </div>

                {/* Dashboard Mockup Placeholder */}
                <div className="relative mx-auto w-full max-w-5xl aspect-video bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-medium">
                        [ Dashboard Preview Image ]
                    </div>
                </div>
            </div>
        </section>
    );
}