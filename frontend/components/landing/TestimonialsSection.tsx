import { JSX } from 'react';
import { Quote, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Ensure this path matches your setup

/**
 * @file frontend/components/landing/TestimonialsSection.tsx
 * @description Section displaying user testimonials in a grid using Shadcn Cards.
 * @returns {JSX.Element} The Testimonials Section component.
 */
export default function TestimonialsSection(): JSX.Element {
    const testimonials = [
        {
            text: "EduCMS has become my daily read. The tutorials are incredibly detailed and the code snippets actually work out of the box. A must-read for any frontend developer.",
            name: "Alex Rivera",
            role: "Frontend Engineer",
            avatar: "AR" // Using initials for the fake avatar
        },
        {
            text: "Finding high-quality, free resources on advanced backend architecture is tough. This blog consistently delivers deep dives that help me in my actual job.",
            name: "Sarah Chen",
            role: "Backend Developer",
            avatar: "SC"
        },
        {
            text: "I love how clean and fast the platform is. The articles are formatted beautifully, making it so easy to follow along with the complex full-stack tutorials.",
            name: "Marcus Johnson",
            role: "Tech Lead",
            avatar: "MJ"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Readers Say</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join thousands of developers who are leveling up their skills every single day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                        >
                            <CardContent className="p-8 flex flex-col grow">
                                {/* Large Quote Icon matching the design */}
                                <Quote className="h-10 w-10 text-blue-200 mb-6 rotate-180" fill="currentColor" />

                                {/* Testimonial Text */}
                                <p className="text-slate-700 leading-relaxed mb-8 grow">
                                    "{testimonial.text}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                                    {/* Fake Avatar Circular Badge */}
                                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                        {testimonial.avatar}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
}