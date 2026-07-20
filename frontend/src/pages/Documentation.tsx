import React, { useState } from 'react';
import { BookOpen, Key, AlertTriangle, HelpCircle, Terminal, Layers } from 'lucide-react';

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'start' | 'auth' | 'rate' | 'faq'>('start');

  const faqs = [
    { q: 'Is there a request limit on the free tier?', a: 'Yes, the free tier allows up to 10,000 requests per month. If you exceed this quota, a 429 Too Many Requests response is returned until the month resets.' },
    { q: 'How often is the data updated?', a: 'Different datasets have varying refresh frequencies: dengue case stats are updated weekly, power generation shares are real-time (every 5 seconds), and GDP rates are monthly/quarterly.' },
    { q: 'Can I use LankaData Hub data for commercial applications?', a: 'Yes! The data is published under the Open Government License (OGL) for Sri Lanka, which allows personal and commercial use provided you attribute LankaData Hub.' }
  ];

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-panel p-5 space-y-2">
            <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider block mb-3 px-2">
              API Documentation
            </span>
            <button
              onClick={() => setActiveSection('start')}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeSection === 'start' ? 'bg-lanka-blue text-white' : 'text-lanka-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal size={14} />
              <span>Quick Start Guide</span>
            </button>
            <button
              onClick={() => setActiveSection('auth')}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeSection === 'auth' ? 'bg-lanka-blue text-white' : 'text-lanka-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Key size={14} />
              <span>Authentication</span>
            </button>
            <button
              onClick={() => setActiveSection('rate')}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeSection === 'rate' ? 'bg-lanka-blue text-white' : 'text-lanka-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertTriangle size={14} />
              <span>Rate Limits & SLAs</span>
            </button>
            <button
              onClick={() => setActiveSection('faq')}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeSection === 'faq' ? 'bg-lanka-blue text-white' : 'text-lanka-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle size={14} />
              <span>Frequently Asked Questions</span>
            </button>
          </div>
        </aside>

        {/* Content Details */}
        <section className="flex-1 glass-panel p-6 md:p-8 space-y-6">
          {activeSection === 'start' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-lanka-cyan" size={20} />
                Quick Start Guide
              </h2>
              <p className="text-xs text-lanka-muted leading-relaxed">
                Welcome to the LankaData Hub Developer Portal. Our REST APIs allow you to query, filter, and stream macroeconomic, public health, agricultural, and meteorological statistics directly into your own tools and clients.
              </p>
              
              <h3 className="text-sm font-bold text-white pt-2">1. Obtain your API Key</h3>
              <p className="text-xs text-lanka-muted">
                Navigate to the <Link to="/contact" className="text-lanka-cyan hover:underline">API Marketplace</Link> or Contact Us to obtain a developer profile bearer token.
              </p>

              <h3 className="text-sm font-bold text-white pt-2">2. Make your first request</h3>
              <p className="text-xs text-lanka-muted">
                Send an HTTP GET request to our endpoint using cURL or your framework of choice. Prepend <code className="text-lanka-cyan">Bearer</code> to your API key in the authorization headers.
              </p>

              <div className="bg-[#03060c] border border-lanka-border p-4 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed select-text">
                curl -X GET "https://api.lankadatahub.lk/v1/economy/gdp-growth" \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
              </div>
            </div>
          )}

          {activeSection === 'auth' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="text-lanka-cyan" size={20} />
                API Authentication
              </h2>
              <p className="text-xs text-lanka-muted leading-relaxed">
                All REST API endpoints require secure authentication using HTTP Bearer Tokens. Unauthenticated requests or requests with invalid tokens will return a <code className="text-lanka-rose">401 Unauthorized</code> response.
              </p>

              <div className="bg-lanka-blue-glow border border-lanka-blue/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-white block">Required Request Header</span>
                <code className="text-lanka-cyan font-mono block select-text">Authorization: Bearer your_api_token_here</code>
              </div>
              
              <h3 className="text-sm font-bold text-white pt-2">Token Safety</h3>
              <p className="text-xs text-lanka-muted leading-relaxed">
                Do not commit your API tokens to version control repos (like Github public repositories). Always store tokens in local environment variables (.env files) on your application server.
              </p>
            </div>
          )}

          {activeSection === 'rate' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-lanka-cyan" size={20} />
                Rate Limits & SLAs
              </h2>
              <p className="text-xs text-lanka-muted leading-relaxed">
                To guarantee optimal service quality and high availability to all citizens, we enforce request rate limits based on subscription tiers:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-lanka-bg-light/50 border border-lanka-border p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-lanka-cyan uppercase block mb-1">Free Tier</span>
                  <span className="text-base font-extrabold text-white">60 req / min</span>
                  <span className="text-[9px] text-lanka-darkText block mt-1">10,000 monthly quota</span>
                </div>
                <div className="bg-lanka-bg-light/50 border border-lanka-border p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-lanka-teal uppercase block mb-1">Developer</span>
                  <span className="text-base font-extrabold text-white">500 req / min</span>
                  <span className="text-[9px] text-lanka-darkText block mt-1">500,000 monthly quota</span>
                </div>
                <div className="bg-lanka-bg-light/50 border border-lanka-border p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-lanka-blue-light uppercase block mb-1">Enterprise</span>
                  <span className="text-base font-extrabold text-white">Custom SLA</span>
                  <span className="text-[9px] text-lanka-darkText block mt-1">Unlimited requests</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="text-lanka-cyan" size={20} />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-lanka-bg-light/40 border border-lanka-border p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-white flex gap-1.5">
                      <span className="text-lanka-cyan">Q:</span>
                      <span>{faq.q}</span>
                    </span>
                    <span className="text-xs text-lanka-muted leading-relaxed block pl-4">
                      {faq.a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Documentation;
