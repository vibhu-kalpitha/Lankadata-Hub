import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Lock, Mail, User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-lanka-bg">
      <div className="w-full max-w-lg bg-[#050d1a] border border-lanka-border rounded-3xl p-8 shadow-[0_0_50px_rgba(3,15,30,0.8)] backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-600/15 border border-cyan-500/30 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-black text-white">Create LankaData Account</h2>
          <p className="text-xs text-lanka-muted mt-1">Join Sri Lanka's open national intelligence core platform</p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
            <p className="text-xs text-lanka-muted">Welcome to LankaData Hub.</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">

            <div>
              <label className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Kavinda Perera"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#07162b] border border-lanka-border hover:border-lanka-border-hover focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="kavinda@domain.lk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#07162b] border border-lanka-border hover:border-lanka-border-hover focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-1.5">Organization / Department (Optional)</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ministry of Power / University of Colombo"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full bg-[#07162b] border border-lanka-border hover:border-lanka-border-hover focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-lanka-darkText uppercase tracking-widest block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#07162b] border border-lanka-border hover:border-lanka-border-hover focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider mt-2"
            >
              Complete Registration <ArrowRight size={14} />
            </button>

            <div className="text-center pt-2 text-xs text-lanka-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:underline font-bold">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
