import React from 'react';
import { SriLankaMap } from '../components/SriLankaMap';
import { Map, Landmark, Shield } from 'lucide-react';
import { srilankaService } from '../services/srilankaService';

export const AboutSriLanka: React.FC = () => {
  const provinces = srilankaService.getProvinces();

  const keyFacts = [
    { label: 'Area', value: '65,610 km²', desc: 'Ranked 122nd globally' },
    { label: 'Population', value: '23.2 Million', desc: 'Growth rate: ~0.5%' },
    { label: 'Provinces', value: '09 Provinces', desc: 'Divided into 25 Districts' },
    { label: 'Economy', value: 'LKR (Rs)', desc: 'Key exports: Tea, Textiles, Tourism' },
    { label: 'Languages', value: 'Sinhala, Tamil, English', desc: 'English widely spoken in commerce' },
    { label: 'Religions', value: 'Buddhism, Hinduism, Islam, Christianity', desc: 'Highly multicultural society' }
  ];

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-12">
      
      {/* Title */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight m-0">
          About Sri Lanka
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted leading-relaxed">
          Sri Lanka is an island nation in the Indian Ocean, rich in cultural heritage, demographic diversity, and socio-economic indicators.
        </p>
      </section>

      {/* Interactive Map Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Map className="text-lanka-cyan" size={18} />
          Interactive Provincial Intelligence
        </h2>
        <SriLankaMap />
      </section>

      {/* Key Facts Grid */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Landmarks className="text-lanka-cyan" size={18} />
          Key Geographic & Demographic Facts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFacts.map((fact, idx) => (
            <div key={idx} className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-lanka-darkText uppercase tracking-wider block">
                {fact.label}
              </span>
              <span className="text-xl font-extrabold text-white block">
                {fact.value}
              </span>
              <span className="text-xs text-lanka-muted block">
                {fact.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Details layout listing all districts */}
      <section className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="text-lanka-cyan" size={18} />
          Provincial and District Divisions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-lanka-border text-lanka-darkText font-bold bg-[#091122]/30">
                <th className="py-2.5 px-3">PROVINCE</th>
                <th className="py-2.5 px-3">CAPITAL</th>
                <th className="py-2.5 px-3">AREA</th>
                <th className="py-2.5 px-3">POPULATION</th>
                <th className="py-2.5 px-3">DISTRICTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lanka-border/50">
              {provinces.map((p, idx) => (
                <tr key={idx} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{p.name}</td>
                  <td className="py-3 px-3 text-lanka-muted">{p.capital}</td>
                  <td className="py-3 px-3 text-lanka-muted">{p.area}</td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{p.population}</td>
                  <td className="py-3 px-3 text-lanka-muted">
                    {p.districts.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AboutSriLanka;
