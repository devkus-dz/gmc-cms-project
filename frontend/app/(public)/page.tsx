/**
 * @file frontend/app/(public)/page.tsx
 * @description Main landing page for EduCMS.
 */

import HeroSection from '../../components/landing/HeroSection';
import KeyFeatures from '../../components/landing/KeyFeatures';

export default function LandingPage() {
    return (
        <div className="bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar is now handled by layout.tsx */}

            {/* 1. Hero Section */}
            <HeroSection />

            {/* Trust Badges */}
            <section className="border-y border-slate-100 bg-white py-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 opacity-60 grayscale">
                    <span className="font-semibold text-slate-500">Trusted by:</span>
                    <span className="font-bold text-xl">Harvard University</span>
                    <span className="font-bold text-xl">MIT</span>
                    <span className="font-bold text-xl">Stanford</span>
                </div>
            </section>

            {/* 2. Key Features */}
            <KeyFeatures />

            {/* CTA Section */}
            <section className="bg-blue-600 py-20 px-4 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Energize Learning?</h2>
                    <p className="text-blue-100 mb-8 text-lg">Join thousands of educators building the future of online education today.</p>
                    <button className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all">
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* Footer is now handled by layout.tsx */}
        </div>
    );
}