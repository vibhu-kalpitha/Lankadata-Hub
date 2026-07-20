import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Zap, Database, ArrowRight, Layers } from 'lucide-react';
import { apiService } from '../services/apiService';
import type { ApiEndpoint } from '../services/apiService';

export const APIMarketplace: React.FC = () => {
  const [apis, setApis] = useState<ApiEndpoint[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const pricing = apiService.getPricing();

  useEffect(() => {
    apiService.getApis().then(data => setApis(data));
  }, []);

  const categories = ['All', 'Economy', 'Health', 'Weather'];

  const filteredApis = activeCategory === 'All' 
    ? apis 
    : apis.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-12">
      
      {/* Hero section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lanka-blue-glow border border-lanka-blue/30 rounded-full text-[10px] text-lanka-blue-light font-bold tracking-wider uppercase">
          <Cpu size={12} />
          Developer Portal
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
          Developer API Marketplace
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted leading-relaxed">
          Access trusted, real-time national datasets through our secure, high-performance REST APIs. Perfect for building financial models, local news dashboards, or analytics hubs.
        </p>
      </section>

      {/* Feature Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
        {[
          { icon: <ShieldCheck className="text-lanka-cyan" />, title: "Secure Authentication", desc: "Bearer token headers" },
          { icon: <Zap className="text-lanka-cyan" />, title: "Ultra Fast", desc: "Sub-50ms query responses" },
          { icon: <Database className="text-lanka-cyan" />, title: "Structured Payload", desc: "JSON responses" },
          { icon: <Layers className="text-lanka-cyan" />, title: "99.9% Uptime", desc: "High availability SLAs" },
        ].map((item, idx) => (
          <div key={idx} className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col items-center">
            {item.icon}
            <span className="text-xs font-bold text-white mt-2 block">{item.title}</span>
            <span className="text-[10px] text-lanka-muted block mt-0.5">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white text-center">API Pricing Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricing.map((tier, idx) => {
            const isDev = tier.name === 'Developer';
            return (
              <div 
                key={idx} 
                className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden ${
                  isDev ? 'border-lanka-blue shadow-blue-glow scale-[1.02]' : 'border-lanka-border'
                }`}
              >
                {isDev && (
                  <div className="absolute top-0 right-0 bg-lanka-blue text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Recommended
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{tier.name}</h3>
                  <div className="my-4">
                    <span className="text-2xl md:text-3xl font-extrabold text-white">{tier.price}</span>
                    {tier.period !== 'forever' && <span className="text-xs text-lanka-muted font-normal"> / {tier.period}</span>}
                  </div>
                  <p className="text-[11px] text-lanka-muted leading-relaxed pb-4 border-b border-lanka-border">
                    {tier.desc}
                  </p>
                  
                  <ul className="space-y-3.5 my-6 text-[11px] text-slate-300">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-lanka-cyan" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/contact" 
                  className={`w-full text-center text-xs font-semibold py-2.5 rounded-lg border transition-all ${
                    isDev 
                      ? 'bg-lanka-blue hover:bg-lanka-blue-hover text-white shadow-blue-glow' 
                      : 'bg-transparent hover:bg-white/5 text-lanka-muted border-lanka-border hover:border-lanka-border-hover'
                  }`}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Subscribe Now'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Explore endpoints & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-lanka-border pb-4">
          <h2 className="text-lg font-bold text-white">Explore API Endpoints</h2>
          
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  activeCategory === c 
                    ? 'bg-lanka-blue border-lanka-blue text-white' 
                    : 'bg-[#0a1122]/50 border-lanka-border text-lanka-muted hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* API Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApis.map((api) => (
            <div key={api.id} className="glass-panel p-5 space-y-4 flex flex-col justify-between h-56 hover:border-lanka-border-hover transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${
                      api.method === 'GET' ? 'bg-lanka-teal' : 'bg-lanka-blue'
                    }`}>
                      {api.method}
                    </span>
                    <span className="font-mono text-[10px] text-lanka-cyan font-semibold">
                      {api.endpoint}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-lanka-darkText uppercase bg-white/5 border border-lanka-border px-1.5 py-0.5 rounded">
                    {api.pricing}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{api.title}</h3>
                <p className="text-[11px] text-lanka-muted leading-relaxed line-clamp-2">{api.description}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-lanka-border">
                <span className="text-[10px] text-lanka-darkText">Category: {api.category}</span>
                <Link 
                  to={`/apis/${api.id}`} 
                  className="text-xs font-bold text-lanka-blue-light hover:underline flex items-center gap-1 group"
                >
                  <span>View Documentation</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default APIMarketplace;
