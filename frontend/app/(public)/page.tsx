/**
 * @file frontend/app/(public)/page.tsx
 * @description Main landing page for EduCMS.
 */

import TrustedBySection from '@/components/landing/TrustedBySection';
import HeroSection from '../../components/landing/HeroSection';
import KeyFeatures from '../../components/landing/KeyFeatures';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CtaSection from '@/components/landing/CtaSection';

export default function LandingPage() {
    return (
        <div className="bg-white font-sans selection:bg-blue-100 selection:text-blue-900">


            <HeroSection />
            <TrustedBySection />
            <KeyFeatures />
            <TestimonialsSection />
            <CtaSection />

        </div>
    );
}