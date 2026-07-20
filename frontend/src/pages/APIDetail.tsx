import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Cpu, FileCode, CheckCircle, Database } from 'lucide-react';
import { apiService } from '../services/apiService';
import type { ApiEndpoint } from '../services/apiService';

export const APIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [api, setApi] = useState<ApiEndpoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService.getApiById(id).then((res) => {
      setApi(res);
      setLoading(false);
    });
  }, [id]);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 bg-lanka-bg grid-bg">
        <div className="w-10 h-10 rounded-full border-2 border-lanka-blue border-t-transparent animate-spin mx-auto" />
        <span className="text-xs text-lanka-muted">Loading API details...</span>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4 bg-lanka-bg grid-bg">
        <h2 className="text-xl font-bold text-white">API Endpoint Not Found</h2>
        <Link to="/apis" className="inline-block bg-lanka-blue text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Back to API Marketplace
        </Link>
      </div>
    );
  }

  const codeSample = api.sampleRequest[activeTab];

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg space-y-6">
      
      {/* Back to Marketplace */}
      <Link to="/apis" className="inline-flex items-center gap-2 text-xs font-semibold text-lanka-muted hover:text-white transition-colors">
        <ArrowLeft size={14} />
        <span>Back to API Marketplace</span>
      </Link>

      {/* Header */}
      <div className="border-b border-lanka-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[9px] font-bold bg-[#1e293b] text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full uppercase">
            {api.category} API
          </span>
          {api.status === 'beta' && (
            <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 px-2.5 py-0.5 rounded-full uppercase">
              BETA
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight m-0">
          {api.title}
        </h1>
        <p className="text-xs md:text-sm text-lanka-muted mt-2 leading-relaxed">
          {api.description}
        </p>
      </div>

      {/* Main Endpoint Path Row */}
      <div className="bg-lanka-card border border-lanka-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded text-white ${
            api.method === 'GET' ? 'bg-lanka-teal' : 'bg-lanka-blue'
          }`}>
            {api.method}
          </span>
          <span className="font-mono text-sm text-white font-bold tracking-wide">
            https://api.lankadatahub.lk/v1{api.endpoint}
          </span>
        </div>
        
        <div className="flex gap-2">
          <span className="text-[10px] font-semibold bg-lanka-cyan-glow border border-lanka-cyan/20 text-lanka-cyan px-3 py-1 rounded-lg">
            Header Auth Required
          </span>
        </div>
      </div>

      {/* Parameters Table & Code Examples Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Parameters Column */}
        <div className="space-y-6">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-lanka-border pb-2.5">
              <Cpu size={14} className="text-lanka-cyan" />
              Request Parameters
            </h3>

            {api.parameters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-lanka-border text-lanka-darkText font-bold bg-[#091122]/30">
                      <th className="py-2.5 px-3">PARAM</th>
                      <th className="py-2.5 px-3">TYPE</th>
                      <th className="py-2.5 px-3">REQ</th>
                      <th className="py-2.5 px-3">DESC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lanka-border/50">
                    {api.parameters.map((p, idx) => (
                      <tr key={idx} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 px-3 font-mono text-white font-semibold">{p.name}</td>
                        <td className="py-3 px-3 text-lanka-muted">{p.type}</td>
                        <td className="py-3 px-3">
                          {p.required ? (
                            <span className="text-lanka-rose font-bold">Yes</span>
                          ) : (
                            <span className="text-lanka-darkText">No</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-lanka-muted leading-relaxed min-w-[150px]">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-lanka-muted py-2">No request parameters required for this endpoint.</p>
            )}
          </div>

          {/* Related Dataset Panel */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-lanka-border pb-2.5">
              <Database size={14} className="text-lanka-teal" />
              Related Dataset Source
            </h3>
            <p className="text-[11px] text-lanka-muted leading-relaxed">
              This API is powered by real-time streams linked to the following dataset:
            </p>
            <div className="flex justify-between items-center p-3 bg-lanka-bg-light/45 border border-lanka-border rounded-xl">
              <div>
                <span className="text-xs font-bold text-white block">{api.datasetName}</span>
                <span className="text-[10px] text-lanka-cyan block mt-0.5 uppercase tracking-wider font-semibold">{api.category}</span>
              </div>
              <Link 
                to={`/datasets/${api.datasetId}`} 
                className="text-[10px] font-bold text-lanka-blue-light hover:underline uppercase flex items-center gap-1"
              >
                <span>View Dataset</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Code Snippets & Response Column */}
        <div className="space-y-6">
          {/* Request tabs */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl overflow-hidden flex flex-col h-[280px]">
            <div className="p-3 border-b border-lanka-border flex justify-between items-center bg-lanka-bg-light/35">
              <div className="flex gap-2">
                {(['curl', 'javascript', 'python'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[9px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                      activeTab === tab 
                        ? 'bg-lanka-blue border-lanka-blue text-white shadow-blue-glow' 
                        : 'bg-transparent border-transparent text-lanka-muted hover:text-white'
                    }`}
                  >
                    {tab === 'curl' ? 'cURL' : tab === 'javascript' ? 'Fetch JS' : 'Python'}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handleCopyCode(codeSample)}
                className="text-[9px] font-bold text-lanka-cyan hover:underline uppercase flex items-center gap-1"
              >
                {copied ? <CheckCircle size={12} className="text-lanka-teal animate-bounce" /> : <FileCode size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            
            <div className="flex-1 p-4 bg-[#03060c] overflow-auto font-mono text-[10px] text-slate-300 leading-relaxed whitespace-pre select-text">
              {codeSample}
            </div>
          </div>

          {/* Response payload JSON */}
          <div className="bg-lanka-card border border-lanka-border rounded-xl overflow-hidden flex flex-col h-[320px]">
            <div className="p-3 border-b border-lanka-border bg-lanka-bg-light/35 text-[10px] font-bold text-white">
              Response Payload Example (200 OK)
            </div>
            <div className="flex-1 p-4 bg-[#03060c] overflow-auto font-mono text-[10px] text-lanka-cyan leading-relaxed whitespace-pre select-text">
              {api.sampleResponse}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default APIDetail;
