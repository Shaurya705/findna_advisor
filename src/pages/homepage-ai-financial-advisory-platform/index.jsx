import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import TrustSection from './components/TrustSection';
import FeaturesGrid from './components/FeaturesGrid';
import SocialProofSection from './components/SocialProofSection';
import ConversionSection from './components/ConversionSection';
import Header from '../../components/ui/Header';

const HomepageAIFinancialAdvisoryPlatform = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>FinDNA Advisor - Your Financial DNA, Decoded | AI-Powered Financial Advisory</title>
        <meta 
          name="description" 
          content="Transform your financial future with AI-powered advisory that speaks Hindi & English. Get personalized investment guidance, tax optimization, and retirement planning with cultural understanding." 
        />
        <meta name="keywords" content="AI financial advisor, Hindi financial planning, Indian investment, tax optimization, retirement planning, vernacular fintech" />
        <meta property="og:title" content="FinDNA Advisor - AI Financial Advisory Platform for Indians" />
        <meta property="og:description" content="Discover your Financial DNA with AI that understands Indian culture. Get personalized advice in Hindi & English." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/homepage-ai-financial-advisory-platform" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <HeroSection />
          <TrustSection />
          <FeaturesGrid />
          <SocialProofSection />
          <ConversionSection />
        </main>
      </div>
    </>
  );
};

export default HomepageAIFinancialAdvisoryPlatform;