import React, { useState } from 'react';
import { LegacyVaultLogo } from './LegacyVaultLogo';
import { ArrowRight, Lock, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo }) => {
  const [email, setEmail] = useState('aarav.sharma@legacyvault.app');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartDemo();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#171C1A] flex flex-col justify-between">
      
      {/* Navigation Header */}
      <header className="px-6 py-5 border-b border-[#DDE1DD] bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <LegacyVaultLogo size="md" variant="dark" />
          <button
            onClick={onStartDemo}
            className="px-4 py-2 rounded-[7px] text-xs font-semibold bg-[#174C45] text-white hover:bg-[#123e38] transition-colors cursor-pointer"
          >
            Access Demo Vault →
          </button>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid lg:grid-cols-12 gap-8 items-center px-6 py-12">
        
        {/* LEFT SIDE: Brand & Value Proposition */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
          <div className="space-y-4">
            <span className="inline-block text-xs font-mono tracking-widest text-[#4F7C72] uppercase font-bold px-2.5 py-1 rounded bg-[#EBF0EE] border border-[#D1DDD8]">
              PERSONAL RECORD CONTINUITY OS
            </span>

            <h1 className="text-4xl sm:text-5xl font-sans font-extrabold text-[#171C1A] tracking-tight leading-[1.15]">
              Keep what matters.<br />
              <span className="text-[#174C45]">Ready for what comes next.</span>
            </h1>

            <p className="text-base text-[#6B726E] font-medium leading-relaxed max-w-2xl">
              LegacyVault helps you organize important insurance policies, property deeds, loans, and family records — while keeping you in total control of who can request access under defined conditions.
            </p>
          </div>

          {/* Geometric Fold/Continuity Motif */}
          <div className="p-6 rounded-[10px] bg-white border border-[#DDE1DD] space-y-4">
            <div className="flex items-center space-x-3 text-xs font-mono font-bold text-[#4F7C72] uppercase tracking-wider">
              <svg className="w-5 h-5 text-[#174C45]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h12M4 18h8" />
              </svg>
              <span>THE CONTINUITY GUARANTEE</span>
            </div>

            <p className="text-xs text-[#171C1A] font-medium leading-relaxed">
              Trusted contacts do <strong>NOT</strong> automatically see your files. They can only submit formal requests for categories you explicitly authorize. Access is <strong>Denied by Default</strong>.
            </p>

            {/* Minimal Record Line Motif */}
            <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-[#6B726E]">
              <span className="px-2 py-0.5 rounded bg-[#F7F7F3] border border-[#DDE1DD] text-[#174C45]">1. RECORD</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-[#F7F7F3] border border-[#DDE1DD] text-[#174C45]">2. PERMISSION</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-[#F7F7F3] border border-[#DDE1DD] text-[#174C45]">3. VERIFIED REQUEST</span>
            </div>
          </div>

          {/* 3 Core Security Pillars */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#171C1A]">Zero Banking Secrets</div>
              <p className="text-[11px] text-[#6B726E]">No ATM PINs, CVVs, passwords or OTPs are ever stored.</p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#171C1A]">Deny by Default</div>
              <p className="text-[11px] text-[#6B726E]">Silence is never permission. Access requires positive consent.</p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#171C1A]">Full Auditability</div>
              <p className="text-[11px] text-[#6B726E]">Every scan, request, and view is recorded in a permanent ledger.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Clean Sign-In Form */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[10px] border border-[#DDE1DD] shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#171C1A]">Welcome back</h2>
            <p className="text-xs text-[#6B726E] font-medium mt-1">Sign in to manage your vault or explore the live interactive baseline.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171C1A] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3.5 py-2.5 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#171C1A]">Password</label>
                <span className="text-[11px] text-[#4F7C72] hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3.5 py-2.5 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[7px] font-bold text-xs bg-[#174C45] text-white hover:bg-[#123e38] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Continue to Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#DDE1DD] text-center space-y-3">
            <button
              onClick={onStartDemo}
              className="w-full py-2.5 rounded-[7px] text-xs font-bold bg-[#F7F7F3] text-[#174C45] border border-[#DDE1DD] hover:bg-[#EBF0EE] transition-colors cursor-pointer"
            >
              Launch Interactive Demo Mode
            </button>

            <p className="text-[11px] text-[#6B726E] font-medium flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#174C45]" />
              <span>Your information stays under your control.</span>
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#DDE1DD] bg-white text-[11px] text-[#6B726E] text-center font-medium">
        LegacyVault OS • Private Personal Record Management System
      </footer>
    </div>
  );
};

