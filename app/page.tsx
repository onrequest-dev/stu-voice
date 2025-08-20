"use client"
import React from 'react';
import WelcomeHeader from '../components/WelcomeHeader';
import FeaturesSection from '../components/FeaturesSection';
import ContributionSection from '../components/ContributionSection';
import Head from 'next/head';
const page = () => {
   return (

    <>
    <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My App" />
      </Head>
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
    </>
  );
};

export default page;
