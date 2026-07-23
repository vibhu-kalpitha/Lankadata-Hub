import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    type: 'Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        org: '',
        type: 'Inquiry',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="flex-1 bg-lanka-bg py-10 px-6 max-w-7xl mx-auto w-full grid-bg">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Contact Info Sidebar */}
        <aside className="w-full lg:w-96 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Contact Us</h2>
              <p className="text-xs text-lanka-muted mt-2 leading-relaxed">
                Have questions about dataset licensing, custom REST API integration, or spotted a data discrepancy? Reach out to our operational team.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-lanka-cyan mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Headquarters Office</span>
                  <span className="text-lanka-muted block mt-1 leading-relaxed">
                    National Data Operations Unit,<br />
                    Colombo 03, Sri Lanka.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-lanka-cyan mt-0.5" />
                <div>
                  <span className="font-bold text-white block">API Support Desk</span>
                  <span className="text-lanka-cyan block mt-1 hover:underline select-all">
                    developer@lankadatahub.lk
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-lanka-cyan mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Operational Phone</span>
                  <span className="text-lanka-muted block mt-1 select-all">
                    +94 11 234 5678
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-lanka-border text-[10px] text-lanka-darkText leading-relaxed">
              Office Hours: Monday - Friday, 9:00 AM - 4:00 PM (IST)
            </div>
          </div>
        </aside>

        {/* Feedback / Inquiry Form */}
        <section className="flex-1 glass-panel p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-lanka-border pb-3 m-0">
            Submit Inquiry or Request API Credentials
          </h2>

          {success ? (
            <div className="bg-lanka-teal-glow border border-lanka-teal/30 p-6 rounded-xl text-center space-y-3">
              <CheckCircle size={36} className="text-lanka-teal mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">Message Transmitted Successfully!</h3>
              <p className="text-xs text-lanka-muted max-w-md mx-auto leading-relaxed">
                Thank you for contacting LankaData Hub. Our developer operations desk will review your credentials request or feedback and get back to you within 24 business hours.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-4 text-xs font-bold text-lanka-cyan hover:underline uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="bg-lanka-rose-glow border border-lanka-rose/30 p-3 rounded-lg text-xs text-white flex items-center gap-2">
                  <AlertCircle size={14} className="text-lanka-rose" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-lanka-darkText uppercase block">
                    Full Name <span className="text-lanka-rose">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-[#0a1122]/50 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-lg py-2 px-3.5 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-lanka-darkText uppercase block">
                    Email Address <span className="text-lanka-rose">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-[#0a1122]/50 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-lg py-2 px-3.5 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-lanka-darkText uppercase block">
                    Organization / Project (Optional)
                  </label>
                  <input
                    type="text"
                    name="org"
                    value={formData.org}
                    onChange={handleChange}
                    placeholder="e.g. University of Colombo"
                    className="w-full bg-[#0a1122]/50 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-lg py-2 px-3.5 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue"
                  />
                </div>

                {/* Inquiry Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-lanka-darkText uppercase block">
                    Message Category
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-[#0b1424] border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue text-xs text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-lanka-blue"
                  >
                    <option value="Inquiry">General Inquiry</option>
                    <option value="Credentials">Request API Client Key</option>
                    <option value="Discrepancy">Report Data Discrepancy</option>
                    <option value="Request">Feature / Dataset Suggestion</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-lanka-darkText uppercase block">
                  Message Details <span className="text-lanka-rose">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Explain your request or inquiry in detail..."
                  className="w-full bg-[#0a1122]/50 border border-lanka-border hover:border-lanka-border-hover focus:border-lanka-blue rounded-lg py-2 px-3.5 text-xs text-white placeholder-lanka-darkText focus:outline-none focus:ring-1 focus:ring-lanka-blue resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-lanka-blue hover:bg-lanka-blue-hover text-white text-xs font-semibold px-6 py-3 rounded-lg shadow-blue-glow disabled:opacity-50 transition-all active:scale-95"
              >
                <span>{loading ? 'Transmitting...' : 'Send Inquiry'}</span>
                <Send size={12} className={loading ? 'animate-pulse' : ''} />
              </button>

            </form>
          )}
        </section>

      </div>
    </div>
  );
};

export default Contact;
