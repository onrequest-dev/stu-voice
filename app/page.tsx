"use client"
import React from 'react';
import Link from 'next/link';
import WelcomeHeader from '../components/WelcomeHeader';
import FeaturesSection from '../components/FeaturesSection';
import ContributionSection from '../components/ContributionSection';
const page = () => {
   return (
    <div className="flex flex-col min-h-screen">
      {/* الهيدر الترحيبي */}
      <div className="flex-grow">
        <WelcomeHeader />
      </div>
      
      {/* قسم الميزات */}
      <div className="flex-grow">
        <FeaturesSection />
      </div>

      {/*قسم ساهم */}
      <div className="flex-grow">
        <ContributionSection />
      </div>

    </div>
  );
};

export default page;
