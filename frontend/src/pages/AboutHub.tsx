import React from 'react';
import { Target, Eye, Code2, Server, Layers } from 'lucide-react';

export const AboutHub: React.FC = () => {
  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-12">
      
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
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lanka-blue-glow border border-lanka-blue/30 flex items-center justify-center text-lanka-blue-light">
              <Target size={20} />
            </div>
            <h2 className="text-lg font-bold text-white leading-none">Our Mission</h2>
          </div>
          <p className="text-xs text-lanka-muted leading-relaxed">
            To democratize access to national intelligence by building automated pipeline infrastructure, ensuring citizens, researchers, and government nodes can reference trusted datasets instantaneously.
          </p>
        </div>

        {/* Vision */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lanka-cyan-glow border border-lanka-cyan/30 flex items-center justify-center text-lanka-cyan">
              <Eye size={20} />
            </div>
            <h2 className="text-lg font-bold text-white leading-none">Our Vision</h2>
          </div>
          <p className="text-xs text-lanka-muted leading-relaxed">
            To serve as the central backbone of Sri Lanka's digital public infrastructure (DPI), fostering a culture of data-driven governance, economic transparency, and rapid technological innovation.
          </p>
        </div>

      </section>

      {/* Objectives */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white text-center">Core Objectives</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 text-center space-y-2">
            <span className="text-base font-extrabold text-lanka-cyan block">01</span>
            <span className="text-xs font-bold text-white block">Automation</span>
            <span className="text-[11px] text-lanka-muted leading-relaxed block">
              Replacing manual document releases with continuous ETL data sync pipelines.
            </span>
          </div>
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 text-center space-y-2">
            <span className="text-base font-extrabold text-lanka-teal block">02</span>
            <span className="text-xs font-bold text-white block">API Accessibility</span>
            <span className="text-[11px] text-lanka-muted leading-relaxed block">
              Supplying developers with clean, formatted, and rate-limited REST API tunnels.
            </span>
          </div>
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 text-center space-y-2">
            <span className="text-base font-extrabold text-lanka-blue-light block">03</span>
            <span className="text-xs font-bold text-white block">Visual Intelligence</span>
            <span className="text-[11px] text-lanka-muted leading-relaxed block">
              Translating raw row counts into responsive, accessible dashboard insights.
            </span>
          </div>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white text-center">System Architecture</h2>
        
        {/* Stylized CSS Diagram */}
        <div className="glass-panel p-6 space-y-8 flex flex-col items-center">
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-around text-center">
            {/* Raw Data Sources */}
            <div className="bg-[#121c2c] border border-lanka-border rounded-xl p-4 w-44">
              <span className="text-[10px] font-bold text-lanka-rose block mb-1">DATA SOURCES</span>
              <span className="text-xs font-bold text-white block leading-tight">Gov Ministries, Central Bank, Meteorological Sensors</span>
            </div>

            {/* Arrow */}
            <div className="text-lanka-muted text-xs rotate-90 md:rotate-0">---&gt;</div>

            {/* ETL Sync Pipeline */}
            <div className="bg-[#121c2c] border border-lanka-blue/30 rounded-xl p-4 w-44 shadow-blue-glow">
              <span className="text-[10px] font-bold text-lanka-cyan block mb-1">ETL PIPELINE</span>
              <span className="text-xs font-bold text-white block leading-tight">Python Airflow Sync, PostgreSQL Database Loader</span>
            </div>

            {/* Arrow */}
            <div className="text-lanka-muted text-xs rotate-90 md:rotate-0">---&gt;</div>

            {/* API and Frontend */}
            <div className="bg-[#121c2c] border border-lanka-teal/30 rounded-xl p-4 w-44 shadow-cyan-glow">
              <span className="text-[10px] font-bold text-lanka-teal block mb-1">GATEWAY</span>
              <span className="text-xs font-bold text-white block leading-tight">FastAPI REST Server, React Web Dashboard Client</span>
            </div>
          </div>

          <div className="text-[10px] text-lanka-darkText flex items-center gap-1">
            <Layers size={12} />
            <span>High availability pipeline with hourly database sync processes.</span>
          </div>

        </div>
      </section>

      {/* Technology Stack details */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white text-center font-sans">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-lanka-muted leading-relaxed">
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-1.5 border-b border-lanka-border pb-2">
              <Code2 size={16} className="text-lanka-cyan" />
              Frontend Framework
            </h3>
            <p>React + TypeScript client, compiled using Vite for zero-latency module bundling.</p>
            <p>Styled completely via custom responsive Tailwind CSS design tokens.</p>
          </div>
          <div className="bg-lanka-card border border-lanka-border rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-white flex items-center gap-1.5 border-b border-lanka-border pb-2">
              <Server size={16} className="text-lanka-teal" />
              Backend & Services
            </h3>
            <p>FastAPI asynchronous Python core backend exposing clean Swagger endpoints.</p>
            <p>PostgreSQL relational database storing aggregated national records.</p>
            <p>Docker deployment configuration mapped to run on AWS EC2 nodes.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutHub;
