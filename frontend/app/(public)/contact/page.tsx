'use client';

/**
 * @file frontend/app/(public)/contact/page.tsx
 * @description Contact page with a validation form for user inquiries.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        // TODO: Connect to backend endpoint to send email
        console.log('Contact Data:', data);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate sending
    };

    return (
        <div className="min-h-[80vh] bg-slate-50 py-16">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions about EduCMS? Want to request a feature? Our team is here to help you build better educational experiences.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">

                    {/* Contact Information (Left Column) */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Email Us</h3>
                                    <p className="text-slate-500 text-sm mt-1">support@educms.com</p>
                                    <p className="text-slate-500 text-sm">sales@educms.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Call Us</h3>
                                    <p className="text-slate-500 text-sm mt-1">+1 (555) 123-4567</p>
                                    <p className="text-slate-500 text-sm">Mon-Fri, 9am - 5pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Office</h3>
                                    <p className="text-slate-500 text-sm mt-1">123 Education Lane<br />Innovation City, Tech 10101</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (Right Column) */}
                    <div className="md:col-span-2">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            {isSubmitSuccessful ? (
                                <div className="text-center py-12">
                                    <div className="bg-green-100 text-green-600 p-4 rounded-full inline-block mb-4">
                                        <Send className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                    <p className="text-slate-600">Thank you for reaching out. We will get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                            <input
                                                type="text"
                                                {...register('name')}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                {...register('email')}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                                placeholder="you@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            {...register('subject')}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                            placeholder="How can we help you?"
                                        />
                                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            {...register('message')}
                                            rows={5}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                                            placeholder="Write your message here..."
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>Send Message <Send className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}