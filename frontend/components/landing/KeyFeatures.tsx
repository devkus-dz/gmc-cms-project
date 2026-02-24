import { Terminal, Lightbulb, Code2 } from 'lucide-react';
import { JSX } from 'react';

/**
 * @file frontend/components/landing/KeyFeatures.tsx
 * @description Displays the top 3 features of the CMS in a mobile-styled card layout.
 * @returns {JSX.Element} The Key Features component.
 */
export default function KeyFeatures(): JSX.Element {
    const features = [
        {
            icon: <Terminal className="h-10 w-10 text-blue-700" strokeWidth={1.5} />,
            title: 'Expert Tutorials',
            description: 'Step-by-step guides on modern frameworks, web development, and software engineering.'
        },
        {
            icon: <Lightbulb className="h-10 w-10 text-blue-700" strokeWidth={1.5} />,
            title: 'Tech Insights',
            description: 'Stay updated with the latest industry trends, best practices, and deep dives into new tech.'
        },
        {
            icon: <Code2 className="h-10 w-10 text-blue-700" strokeWidth={1.5} />,
            title: 'Open Knowledge',
            description: '100% free resources designed by developers, for developers, to help you level up your skills.'
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-5xl text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">What We Offer</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        /* We use a standard div here instead of Shadcn's Card. 
                           'overflow-hidden' ensures the blue header respects the 'rounded-2xl' corners!
                        */
                        <div
                            key={index}
                            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            {/* Smartphone Top Bezel (The solid blue area) - Snaps flush to the top! */}
                            <div className="h-16 w-full bg-blue-700 flex justify-center pt-3 shrink-0">
                                {/* The tiny white notch/speaker line */}
                                <div className="w-16 h-1.5 bg-white/30 rounded-full"></div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 pb-10 pt-8 flex flex-col items-center text-center grow">
                                <div className="mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}