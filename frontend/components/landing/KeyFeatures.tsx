import { Trophy, Users, Smartphone } from 'lucide-react';
import { JSX } from 'react';

/**
 * @file frontend/components/landing/KeyFeatures.tsx
 * @description Displays the top 3 features of the CMS in a card layout.
 * @returns {JSX.Element} The Key Features component.
 */
export default function KeyFeatures(): JSX.Element {
    const features = [
        {
            icon: <Trophy className="h-6 w-6 text-blue-600" />,
            title: 'Gamified Learning',
            description: 'Engage students with interactive leaderboards, badges, and achievement tracking.'
        },
        {
            icon: <Users className="h-6 w-6 text-blue-600" />,
            title: 'Social Collaboration',
            description: 'Built-in discussion forums and real-time messaging for students and instructors.'
        },
        {
            icon: <Smartphone className="h-6 w-6 text-blue-600" />,
            title: 'Mobile-First Design',
            description: 'Learn anywhere, anytime with a fully responsive platform optimized for all devices.'
        }
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-12">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow text-left">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}