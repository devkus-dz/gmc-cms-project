/**
 * @file frontend/app/(public)/about/page.tsx
 * @description About page detailing the CMS project objectives, Terms of Service, and Privacy Policy.
 * Uses a clean, typography-focused layout for readability.
 */

import { Info, ShieldCheck, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'About & Legal | EduCMS',
    description: 'Learn about the EduCMS project, our objectives, and our data privacy policies.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        About <span className="text-blue-600">EduCMS</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        EduCMS is a modern, full-stack Content Management System designed to empower educational institutions to seamlessly publish and manage digital content.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Section 1: Project Objective */}
                    <section className="p-8 md:p-12 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <Info className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Project Objective</h2>
                        </div>
                        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                            <p>
                                This website is a comprehensive <strong>Content Management System (CMS) project</strong>.
                                The primary objective of this application is to provide a robust, scalable platform for creating, organizing, and distributing educational resources, articles, and campus announcements.
                            </p>
                            <p>
                                Unlike a traditional Learning Management System (LMS) that focuses on course enrollment and grading, this CMS is specialized for <strong>content publishing and taxonomy</strong>. It features a secure administrative dashboard, a dynamic media library, tag and category management, and an interactive public-facing blog.
                            </p>
                            <p>
                                Built with a modern tech stack—utilizing a Node.js/Express backend and a Next.js (React) Server Component frontend—it serves as a demonstration of secure authentication, RESTful API integration, and responsive UI design.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Privacy Data */}
                    <section className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Privacy & Data Handling</h2>
                        </div>
                        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                            <p>
                                We take data privacy seriously. Because this is an educational CMS project, we want to be fully transparent about how your data is processed:
                            </p>
                            <ul className="space-y-2 mt-4">
                                <li><strong>Authentication Data:</strong> User passwords are securely hashed using industry-standard cryptography (bcrypt) before being stored in our database. We never store plain-text passwords.</li>
                                <li><strong>Personal Information:</strong> We only collect the minimal information required for account creation (Username and Email). We do not sell, rent, or share this data with third-party advertisers.</li>
                                <li><strong>Cookies:</strong> This application uses HTTP-only cookies solely for maintaining secure, authenticated sessions. We do not use third-party tracking cookies.</li>
                                <li><strong>Content Ownership:</strong> Any articles, media, or comments uploaded to the platform remain the intellectual property of the original author.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Terms of Service */}
                    <section className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Terms of Service</h2>
                        </div>
                        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                            <p>
                                By accessing and using this CMS platform, you agree to the following terms:
                            </p>
                            <ol className="space-y-3 mt-4">
                                <li><strong>Acceptable Use:</strong> Users must not use the platform to upload, publish, or distribute any malicious code, spam, or unlawful material.</li>
                                <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. The system administrators reserve the right to suspend accounts that exhibit suspicious activity.</li>
                                <li><strong>Project Nature:</strong> Please note that as a demonstration project, data persistence, uptime, and continuous availability are not guaranteed. The database may be periodically reset for maintenance.</li>
                            </ol>
                            <p className="mt-6 text-sm text-slate-500">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </section>

                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        Create an Account
                    </Link>
                    <p className="mt-4 text-sm text-slate-500">
                        Or <Link href="/blog" className="text-blue-600 hover:underline">browse the public articles</Link>.
                    </p>
                </div>

            </div>
        </div>
    );
}