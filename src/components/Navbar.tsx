import React from 'react';
import { User } from '../types/index';
import { LegacyVaultLogo } from './LegacyVaultLogo';
import { Archive, Users, ShieldAlert, History, Lock, Eye, RotateCcw, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDemoScenarios: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onOpenDemoScenarios,
  onResetDemo
}) => {
  return (
    <header className="bg-[#174C45] text-white sticky top-0 z-40 border-b border-[#235d55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <LegacyVaultLogo size="md" variant="light" />
          </div>

          {/* Navigation Tabs (VAULT, PEOPLE, HANDOVER, ACTIVITY, PRIVACY) */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#123e38] p-1 rounded-[7px] border border-[#1f574f]">
            {currentUser.role === 'owner' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                      : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5 text-emerald-300" />
                  <span>VAULT</span>
                </button>

                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'contacts'
                      ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                      : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-300" />
                  <span>PEOPLE</span>
                </button>

                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'emergency'
                      ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                      : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
                  <span>HANDOVER</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'requests'
                      ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                      : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ACTIVITY</span>
                </button>

                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === 'privacy'
                      ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                      : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>PRIVACY</span>
                </button>
              </>
            )}

            {currentUser.role === 'trusted_contact' && (
              <button
                onClick={() => setActiveTab('contact-portal')}
                className={`px-3.5 py-1.5 rounded-[5px] text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'contact-portal'
                    ? 'bg-[#174C45] text-white border border-[#2b6d63]'
                    : 'text-stone-300 hover:text-white hover:bg-[#184640]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-300" />
                <span>TRUSTED CIRCLE PORTAL</span>
              </button>
            )}
          </nav>

          {/* Actor Selector & Threat Harness */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenDemoScenarios}
              className="px-3 py-1.5 rounded-[6px] text-xs font-semibold bg-[#215d55] text-emerald-100 border border-[#30786f] hover:bg-[#286a61] transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Test the 13 Threat Scenarios"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Threat Harness</span>
            </button>

            <button
              onClick={onResetDemo}
              className="p-2 rounded-[6px] text-stone-300 hover:text-white hover:bg-[#215d55] transition-colors cursor-pointer border border-transparent"
              title="Reset Vault Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quick Role Switcher */}
            <div className="relative flex items-center bg-[#123e38] rounded-[6px] px-2 py-1 border border-[#1f574f]">
              <span className="text-[10px] font-semibold text-stone-300 uppercase tracking-wider mr-1.5 hidden lg:inline">
                Actor:
              </span>
              <select
                value={currentUser.id}
                onChange={e => onSwitchUser(e.target.value)}
                className="bg-transparent text-xs font-bold text-emerald-200 focus:outline-none cursor-pointer pr-1"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-[#174C45] text-white">
                    {u.name} ({u.role === 'owner' ? 'Owner' : u.role === 'trusted_contact' ? 'Contact' : 'Admin'})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

