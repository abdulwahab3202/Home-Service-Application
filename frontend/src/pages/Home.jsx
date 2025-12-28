import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CtaSection from '../components/CtaSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';

const Home = ({ onReportClick }) => {
  return (
    <main>
      <HeroSection onReportClick={onReportClick} />
      <AboutSection/>
      <HowItWorksSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
};

export default Home;