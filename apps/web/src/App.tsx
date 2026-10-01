import React from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StarterSetConfigurator } from './components/StarterSetConfigurator';
import { CadenceComparison } from './components/CadenceComparison';
import { ValueProps } from './components/ValueProps';
import { Testimonials } from './components/Testimonials';
import { AIAssistantBanner } from './components/AIAssistantBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { FAQ } from './components/FAQ';
import { ReadyBanner } from './components/ReadyBanner';
import { StickyPDPBanner } from './components/StickyPDPBanner';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#FE5000] selection:text-white flex flex-col">
        {/* Navigation Header with Announcement Bar */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* Core Interactive Product Configurator (No Frills Starter Set) */}
          <StarterSetConfigurator />

          {/* Cadence Comparison ("No Surprises. Here's How It Works.") */}
          <CadenceComparison />

          {/* Value Propositions ("Smooth. Simple. Flexible.") */}
          <ValueProps />

          {/* Member Reviews & Testimonials */}
          <Testimonials />

          {/* CX Agent Studio Personal Grooming Advisor Banner */}
          <AIAssistantBanner />

          {/* Expanded Grooming & Refills Catalog */}
          <ProductCatalog />

          {/* Interactive FAQ Accordion */}
          <FAQ />

          {/* Call To Action Banner ("Ready To Raise Your Shave Game?") */}
          <ReadyBanner />
        </main>

        {/* Sticky PDP Bottom Bar on Scroll */}
        <StickyPDPBanner />

        {/* Slide-out Cart Drawer with Free Shipping Meter */}
        <CartDrawer />

        {/* Comprehensive Storefront Footer */}
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
