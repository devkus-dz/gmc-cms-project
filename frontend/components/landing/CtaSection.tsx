import { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * @file frontend/components/landing/CtaSection.tsx
 * @description A high-impact Call to Action section targeting developers and learners.
 * @returns {JSX.Element} The CTA Section component.
 */
export default function CtaSection(): JSX.Element {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Modern Floating Card Design 
                    Uses a deep slate background with a subtle blue/purple gradient overlay 
                */}
                <div className="bg-slate-900 rounded-3xl py-16 px-8 md:px-16 text-center shadow-2xl overflow-hidden relative">

                    {/* Decorative Background Glow */}
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none"></div>

                    {/* Content (Z-10 ensures it sits above the background glow) */}
                    <div className="relative z-10 flex flex-col items-center">

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                            Ready to Level Up Your Code?
                        </h2>

                        <p className="text-slate-300 mb-10 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Join our community of developers today. Get instant access to expert tutorials, backend deep dives, and the latest tech insights—100% free.
                        </p>

                        {/* Changed to a Next.js Link instead of a button so it actually routes the user! 
                            Added hover:-translate-y-1 for a premium "lift" effect.
                        */}
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 bg-white text-slate-900 hover:text-blue-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 text-blue-600" />
                        </Link>

                        <p className="text-slate-500 text-sm mt-6">
                            No credit card required. Cancel anytime.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}