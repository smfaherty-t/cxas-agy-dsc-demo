import React, { useState } from 'react';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'blades' | 'shave' | 'grooming';
  price: string;
  description: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  tag: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'blade-6',
    name: '6-Blade Razor Cartridge Refills (4ct)',
    category: 'blades',
    price: '$10.00',
    description: 'Precision trimmer edge, aloe vera lubricating strip, and 6 ultra-thin surgical stainless steel blades.',
    rating: 4.9,
    reviewsCount: 42100,
    badge: 'BESTSELLER',
    tag: 'Close & Effortless'
  },
  {
    id: 'blade-4',
    name: '4-Blade Razor Cartridge Refills (4ct)',
    category: 'blades',
    price: '$8.00',
    description: 'Optimized spacing prevents clogging. Perfect for everyday shaving and thicker beard textures.',
    rating: 4.8,
    reviewsCount: 31200,
    tag: 'Sensitive & Precision'
  },
  {
    id: 'shave-butter',
    name: 'Translucent Shave Butter (6 oz)',
    category: 'shave',
    price: '$8.00',
    description: 'See where you shave. Non-foaming formula infused with shea butter and golden barley for zero drag.',
    rating: 4.9,
    reviewsCount: 58900,
    badge: 'MEMBER FAVORITE',
    tag: 'No Razor Burn'
  },
  {
    id: 'post-shave-dew',
    name: 'Calming Post Shave Dew (3.4 oz)',
    category: 'shave',
    price: '$9.00',
    description: 'Alcohol-free hydration that eliminates post-shave redness, razor bumps, and tightness instantly.',
    rating: 4.7,
    reviewsCount: 19800,
    tag: 'Hydrating Relief'
  },
  {
    id: 'body-wash',
    name: 'Daily Hydrating Body Wash (16 oz)',
    category: 'grooming',
    price: '$9.00',
    description: 'Rich lather with hints of amber, cedarwood, and citrus. Cleans without stripping your skin dry.',
    rating: 4.8,
    reviewsCount: 22400,
    tag: 'Fresh Scent'
  },
  {
    id: 'deodorant',
    name: 'Aluminum-Free Deodorant (2.6 oz)',
    category: 'grooming',
    price: '$8.00',
    description: 'Long-lasting 24-hour odor defense without stains, parabens, or harsh artificial chemicals.',
    rating: 4.6,
    reviewsCount: 14300,
    tag: 'All-Day Clean'
  }
];

export const ProductCatalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'blades' | 'shave' | 'grooming'>('all');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (id: string) => {
    setAddedItem(id);
    setTimeout(() => {
      setAddedItem(null);
    }, 2000);
  };

  return (
    <section id="products" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600">
            HONEST GROOMING GEAR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Top-Shelf Quality. Zero Price Markups.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Build your custom grooming bundle or add individual essentials to your recurring delivery.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {(['all', 'blades', 'shave', 'grooming'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-300 transition-all group"
            >
              <div>
                {/* Header with badge */}
                <div className="flex items-center justify-between h-7">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {product.tag}
                  </span>
                  {product.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Simulated product photo container */}
                <div className="w-full h-44 my-4 bg-gradient-to-tr from-stone-100 via-amber-50/30 to-stone-100 rounded-xl flex items-center justify-center border border-stone-100 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <div className="text-center p-4">
                    <span className="text-4xl select-none">
                      {product.category === 'blades' ? '🪒' : product.category === 'shave' ? '🧴' : '🧼'}
                    </span>
                    <div className="mt-2 text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                      {product.category}
                    </div>
                  </div>
                </div>

                {/* Product Name & Description */}
                <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-2">
                  {product.description}
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-500">
                  <div className="flex text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span className="font-bold text-stone-800">{product.rating}</span>
                  <span>({product.reviewsCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              {/* Price & Add to Cart button */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block font-medium">Club Price</span>
                  <span className="text-xl font-black text-stone-900">{product.price}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    addedItem === product.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-900 text-white hover:bg-amber-600 active:scale-95'
                  }`}
                >
                  {addedItem === product.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Box</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
