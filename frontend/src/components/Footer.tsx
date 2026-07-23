import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LankaData Hub',
        text: 'Sri Lanka\'s central open data platform.',
        url: window.location.origin
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <footer className="bg-[#040810] border-t border-lanka-border text-lanka-muted py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="font-bold text-lg text-white tracking-tight hover:text-lanka-cyan transition-colors">
            LankaData Hub
          </Link>
          <p className="text-[11px] text-lanka-darkText text-center md:text-left">
            &copy; {currentYear} LankaData Hub. National Data Platform of Sri Lanka. All rights reserved.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
          <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link to="/documentation" className="hover:text-white transition-colors">Developer Portal</Link>
          <Link to="/apis" className="hover:text-white transition-colors">API Status</Link>
          <Link to="/contact" className="hover:text-white transition-colors font-semibold text-lanka-cyan">Contact Us</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a 
            href="https://gov.lk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-white/5 border border-lanka-border hover:border-lanka-border-hover hover:bg-white/10 flex items-center justify-center text-lanka-muted hover:text-white transition-all duration-300"
            title="Sri Lanka Government Portal"
          >
            <Globe size={14} />
          </a>
          <Link 
            to="/contact" 
            className="w-8 h-8 rounded-full bg-white/5 border border-lanka-border hover:border-lanka-border-hover hover:bg-white/10 flex items-center justify-center text-lanka-muted hover:text-white transition-all duration-300"
            title="Contact Us"
          >
            <Mail size={14} />
          </Link>
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/5 border border-lanka-border hover:border-lanka-border-hover hover:bg-white/10 flex items-center justify-center text-lanka-muted hover:text-white transition-all duration-300 active:scale-90"
            title="Share Platform"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
