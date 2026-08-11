import React from 'react';
import { Target, Eye } from 'lucide-react';

export const AboutHub: React.FC = () => {
  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-12 min-h-screen">
      
      {/* Title */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
          About LankaData Hub
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted leading-relaxed">
          Sri Lanka's official open-source data gateway supplying trusted datasets, visual indicators, and high-performance REST APIs.
        </p>
      </section>

      {/* Mission / Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Mission */}
        <div className="glass-panel p-8 space-y-4 rounded-3xl border border-slate-800 bg-[#040e1e]/90 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lanka-blue-glow border border-lanka-blue/30 flex items-center justify-center text-lanka-blue-light">
              <Target size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-white leading-none">Our Mission</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To democratize access to national intelligence by building automated pipeline infrastructure, ensuring citizens, researchers, and government nodes can reference trusted datasets instantaneously.
          </p>
        </div>

        {/* Vision */}
        <div className="glass-panel p-8 space-y-4 rounded-3xl border border-slate-800 bg-[#040e1e]/90 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lanka-cyan-glow border border-lanka-cyan/30 flex items-center justify-center text-lanka-cyan">
              <Eye size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-white leading-none">Our Vision</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To serve as the central backbone of Sri Lanka's digital public infrastructure (DPI), fostering a culture of data-driven governance, economic transparency, and rapid technological innovation.
          </p>
        </div>

      </section>

    </div>
  );
};

export default AboutHub;
