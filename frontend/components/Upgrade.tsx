import React, { useState } from 'react';
import { Check, Zap, Star, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Upgrade: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { user, login, simulateStripeCheckout, isLoading } = useAuth();

  const handleUpgradeClick = async () => {
    if (!user) {
      await login();
      // After login, they would normally be redirected to Stripe
      simulateStripeCheckout();
    } else {
      simulateStripeCheckout();
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Supercharge your <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">PDF Research.</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Stop guessing what people want to buy. Find profitable digital products before everyone else with live market signals.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-300 focus:outline-none"
            style={{ backgroundColor: isAnnual ? '#ec4899' : '#e5e7eb' }}
          >
            <div 
              className="w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300"
              style={{ transform: isAnnual ? 'translateX(24px)' : 'translateX(0)' }}
            />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-2 ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annually 
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Starter Plan */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Starter</h3>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-gray-900">£{isAnnual ? '15' : '19'}</span>
            <span className="text-gray-500 font-medium">/mo</span>
          </div>
          <p className="text-sm text-gray-500 mb-8 h-10">Perfect for beginners validating their first digital product.</p>
          
          <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors mb-8 border border-gray-200">
            Current Plan
          </button>

          <div className="space-y-4">
            <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">What's included</div>
            {[
              '50 Trend Scans per month',
              '10 PDF Generations per month',
              'Basic Market Gap Analysis',
              'Save up to 20 Ideas',
              'Standard Support'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-white border-2 border-pink-500 rounded-[2rem] p-8 shadow-glow relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-pink-500 fill-pink-500" />
              <h3 className="text-lg font-bold text-gray-900">Pro</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-gray-900">£{isAnnual ? '39' : '49'}</span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mb-8 h-10">For creators serious about building a profitable PDF empire.</p>
            
            <button 
              onClick={handleUpgradeClick}
              disabled={isLoading || user?.isPro}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm mb-8 flex items-center justify-center gap-2 ${
                user?.isPro 
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : user?.isPro ? (
                <>
                  <Check className="w-5 h-5" /> Active Plan
                </>
              ) : (
                <>
                  Upgrade to Pro <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="space-y-4">
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Everything in Starter, plus:</div>
              {[
                'Unlimited Trend Scans',
                'Unlimited PDF Generations',
                'Full 10K Stack Roadmaps',
                'AI Cover & Content Guides',
                'Unlimited Saved Ideas',
                'Priority Support'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <span className="text-sm text-gray-800 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agency Plan */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Agency</h3>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-gray-900">£{isAnnual ? '79' : '99'}</span>
            <span className="text-gray-500 font-medium">/mo</span>
          </div>
          <p className="text-sm text-gray-500 mb-8 h-10">For teams and agencies building products for clients.</p>
          
          <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors mb-8 border border-gray-200">
            Contact Sales
          </button>

          <div className="space-y-4">
            <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Everything in Pro, plus:</div>
            {[
              'White-label PDF Exports',
              '5 Team Seats included',
              'API Access',
              'Custom Branding',
              'Dedicated Account Manager'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
