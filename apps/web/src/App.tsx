import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AIAssistantBanner } from './components/AIAssistantBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <AIAssistantBanner />
        <ProductCatalog />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
