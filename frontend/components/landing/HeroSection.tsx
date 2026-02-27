import { PlayCircle, ArrowRight } from 'lucide-react';
import { JSX } from 'react';
import Image from 'next/image';

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
                    Explore expertly crafted articles on programming, software development, and modern tech. Free resources to fuel your coding journey.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all">
                        Get Started for Free <ArrowRight className="h-4 w-4" />
                    </button>

                </div>

                {/* Dashboard Mockup Placeholder */}
                <div className="mx-auto w-full max-w-5xl bg-white rounded-xl shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden flex items-center justify-center">
                    <Image
                        src="/images/educms.JPG"
                        alt="EduCMS Dashboard Preview"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}