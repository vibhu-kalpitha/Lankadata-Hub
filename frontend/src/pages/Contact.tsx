import React from 'react';
import { Mail, MapPin, Building2, Globe, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="flex-1 bg-lanka-bg py-12 px-6 max-w-4xl mx-auto w-full grid-bg min-h-screen">
      <div className="glass-panel p-8 sm:p-10 space-y-8 shadow-2xl border border-slate-800 rounded-3xl bg-[#040e1e]/90">
        
        {/* Header Section */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Building2 size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Contact Us</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
            Official operational inquiry gateway for LankaData Hub dataset access, open telemetry feeds, and administrative correspondence.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Headquarters Address */}
          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <MapPin size={18} />
              <span className="text-white font-extrabold">Headquarters Office</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              236/C/1/1 YOGASHRAMAYA ROAD,<br />
              Robert Gunawardena Mawatha,<br />
              Battaramulla 10120
            </p>
          </div>

          {/* Official Email */}
          <div className="bg-[#07162a]/90 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Mail size={18} />
              <span className="text-white font-extrabold">Official Email Desk</span>
            </div>
            <a
              href="mailto:info@lankadatahub.com"
              className="text-sm font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors block underline decoration-sky-500/40 underline-offset-4"
            >
              info@lankadatahub.com
            </a>
            <p className="text-[11px] text-slate-400 pt-1">
              General inquiries, dataset submissions, and technical support.
            </p>
          </div>

        </div>

        {/* Operating Hours & Portal Info */}
        <div className="bg-[#030914] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-sky-400" />
            <span>Office Hours: Monday - Friday, 9:00 AM - 4:00 PM (IST)</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-emerald-400" />
            <span className="font-mono text-[11px] text-slate-300">lankadatahub.com</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
