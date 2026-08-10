import React, { useState } from 'react';
import { User, UserAccountState } from '../types/index';
import {
  Clock,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface EmergencyLegacyViewProps {
  currentUser: User;
  onUpdateUserState: (newState: UserAccountState) => void;
  onSubmitEmergencyRequest: (reason: string) => void;
  onSubmitLegacyRequest: (proofDocName: string, proofDetails: string) => void;
}

export const EmergencyLegacyView: React.FC<EmergencyLegacyViewProps> = ({
  currentUser,
  onUpdateUserState,
  onSubmitEmergencyRequest,
  onSubmitLegacyRequest
}) => {
  const [urgentReason, setUrgentReason] = useState('');
  const [proofDocName, setProofDocName] = useState('Official_Death_Certificate_Sample.pdf');
  const [proofDetails, setProofDetails] = useState('Sub-registrar Office Certificate Reg # DC-2026-9901');
  const [isSubmittedEmergency, setIsSubmittedEmergency] = useState(false);
  const [isSubmittedLegacy, setIsSubmittedLegacy] = useState(false);

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urgentReason) return;
    onSubmitEmergencyRequest(urgentReason);
    setIsSubmittedEmergency(true);
  };

  const handleLegacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLegacyRequest(proofDocName, proofDetails);
    setIsSubmittedLegacy(true);
  };

  // Stage indicator state for Emergency Access Journey
  const journeyStages = [
    { label: 'REQUEST RECEIVED', desc: 'Contact logs formal emergency request', done: true },
    { label: 'IDENTITY VERIFIED', desc: 'Multi-factor contact check complete', done: true },
    { label: 'TRUST VERIFIED', desc: 'Assigned as primary trusted contact', done: true },
    { label: 'PERMISSIONS CHECKED', desc: 'Category access verified', done: true },
    { label: 'OWNER NOTIFIED', desc: 'Automated SMS + Email dispatched', done: currentUser.state !== 'ACTIVE' },
    { label: 'WAITING / VERIFICATION', desc: '48-hour owner response window active', done: currentUser.state === 'EMERGENCY_REVIEW' },
    { label: 'ACCESS DECISION', desc: 'Access granted or denied by rule', done: currentUser.state === 'LEGACY_ACCESS_APPROVED' }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-[#174C45] text-white p-6 sm:p-8 rounded-[10px] border border-[#235d55]">
        <div className="text-emerald-300 text-xs font-mono tracking-widest uppercase mb-1">
          HANDOVER PROTOCOL
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Emergency Access & Legacy Handover
        </h1>
        <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1 leading-relaxed max-w-2xl">
          Carefully defined access protocols for temporary unavailability and verified long-term continuity.
        </p>
      </div>

      {/* Account State Switcher */}
      <div className="p-5 rounded-[10px] bg-white border border-[#DDE1DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#6B726E]">Account Access State:</div>
          <div className="text-base font-bold text-[#174C45] flex items-center space-x-2 mt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>{currentUser.state}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-[#6B726E]">Test State Machine:</span>
          <select
            value={currentUser.state}
            onChange={e => onUpdateUserState(e.target.value as UserAccountState)}
            className="bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3 py-1.5 text-xs text-[#171C1A] font-medium focus:outline-none focus:border-[#174C45] cursor-pointer"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="TEMPORARILY_UNAVAILABLE">TEMPORARILY_UNAVAILABLE</option>
            <option value="EMERGENCY_REVIEW">EMERGENCY_REVIEW</option>
            <option value="LEGACY_REVIEW">LEGACY_REVIEW</option>
            <option value="LEGACY_ACCESS_APPROVED">LEGACY_ACCESS_APPROVED</option>
          </select>
        </div>
      </div>

      {/* Prominent Legal Guarantee Banner */}
      <div className="p-5 rounded-[10px] bg-[#F7F7F3] border border-[#DDE1DD] text-xs text-[#171C1A] flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-[#174C45] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-[#174C45] font-bold block text-sm">
            LegacyVault does not treat inactivity as proof of death.
          </strong>
          <p className="text-[#6B726E] font-medium leading-relaxed">
            Inactivity alone will never automatically release records or disclose private information. Post-death handover strictly requires official verification proof and human review.
          </p>
        </div>
      </div>

      {/* Access Journey Flow */}
      <div className="bg-white border border-[#DDE1DD] p-6 rounded-[10px] space-y-4">
        <div className="text-xs font-mono font-bold text-[#174C45] uppercase tracking-wider">
          EMERGENCY ACCESS JOURNEY
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 pt-2">
          {journeyStages.map((stg, i) => (
            <div
              key={stg.label}
              className={`p-3 rounded-[7px] border text-left space-y-1 ${
                stg.done
                  ? 'bg-[#EBF0EE] border-[#B9CDC6] text-[#174C45]'
                  : 'bg-[#F7F7F3] border-[#DDE1DD] text-[#6B726E]'
              }`}
            >
              <div className="text-[10px] font-mono font-bold">0{i + 1}</div>
              <div className="text-[11px] font-bold leading-snug">{stg.label}</div>
              <p className="text-[10px] text-[#6B726E] font-medium leading-tight">{stg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Distinct Handover Experiences */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* EXPERIENCE 1: EMERGENCY ACCESS */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDE1DD] space-y-5">
          <div className="flex items-center space-x-2 text-[#171C1A] border-b border-[#DDE1DD] pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold">1. Emergency Protocol</h2>
              <p className="text-[11px] text-[#6B726E]">For situations where the owner is temporarily unavailable</p>
            </div>
          </div>

          <form onSubmit={handleEmergencySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171C1A] mb-1">
                Emergency Justification / Urgent Reason
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Critical hospitalization, emergency medical care requiring health policy reference..."
                value={urgentReason}
                onChange={e => setUrgentReason(e.target.value)}
                className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] p-3 text-xs text-[#171C1A] placeholder-[#6B726E] focus:outline-none focus:border-[#174C45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-[7px] text-xs font-bold bg-[#174C45] text-white hover:bg-[#123e38] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Initiate Emergency Protocol</span>
            </button>
          </form>

          {isSubmittedEmergency && (
            <div className="p-3 rounded-[7px] bg-[#EBF0EE] border border-[#B9CDC6] text-[#174C45] text-xs flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Emergency request recorded. Account placed in EMERGENCY_REVIEW mode.</span>
            </div>
          )}
        </div>

        {/* EXPERIENCE 2: LEGACY HANDOVER */}
        <div className="bg-white p-6 rounded-[10px] border border-[#DDE1DD] space-y-5">
          <div className="flex items-center space-x-2 text-[#171C1A] border-b border-[#DDE1DD] pb-3">
            <FileCheck className="w-5 h-5 text-[#174C45]" />
            <div>
              <h2 className="text-base font-bold">2. Legacy Handover</h2>
              <p className="text-[11px] text-[#6B726E]">Verified post-death record transfer to authorized contacts</p>
            </div>
          </div>

          <div className="p-3 rounded-[7px] bg-[#F7F7F3] border border-[#DDE1DD] flex items-center justify-between text-xs">
            <span className="font-bold text-[#6B726E]">LEGACY STATUS:</span>
            <span className="font-mono font-bold text-[#174C45] bg-[#EBF0EE] px-2.5 py-0.5 rounded border border-[#B9CDC6]">
              {currentUser.state === 'LEGACY_ACCESS_APPROVED' ? 'Ready / Released' : 'Configured & Shielded'}
            </span>
          </div>

          <form onSubmit={handleLegacySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171C1A] mb-1">
                Proof Document Name / ID
              </label>
              <input
                type="text"
                required
                value={proofDocName}
                onChange={e => setProofDocName(e.target.value)}
                className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3 py-2 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171C1A] mb-1">
                Registry Number / Official Authority
              </label>
              <input
                type="text"
                required
                value={proofDetails}
                onChange={e => setProofDetails(e.target.value)}
                className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3 py-2 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-[7px] text-xs font-bold bg-[#174C45] text-white hover:bg-[#123e38] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-white" />
              <span>Submit Verified Legacy Proof</span>
            </button>
          </form>

          {isSubmittedLegacy && (
            <div className="p-3 rounded-[7px] bg-[#EBF0EE] border border-[#B9CDC6] text-[#174C45] text-xs flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Legacy proof submitted. Verified in status LEGACY_REVIEW.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

