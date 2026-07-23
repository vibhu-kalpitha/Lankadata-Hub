import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 bg-lanka-bg grid-bg flex flex-col justify-center items-center py-20 px-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-lanka-rose-glow border border-lanka-rose/30 flex items-center justify-center text-lanka-rose mx-auto">
          <HelpCircle size={32} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-white tracking-tight m-0 pt-2">
          Page Not Found (404)
        </h1>
        
        <p className="text-xs text-lanka-muted leading-relaxed">
          The page link you followed may be broken, or the dataset dashboard you are trying to query has been archived.
        </p>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-[#0d1c33] border border-lanka-border hover:border-lanka-border-hover text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-all active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
