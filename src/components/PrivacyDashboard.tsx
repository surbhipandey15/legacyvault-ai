import React, { useState } from 'react';
import { AuditLog } from '../types/index';
import {
  Lock,
  ShieldCheck,
  Eye,
  Download,
  Trash2,
  List,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Search,
  Shield,
  FileText,
  Key,
  HardDrive
} from 'lucide-react';

interface PrivacyDashboardProps {
  auditLogs: AuditLog[];
  onExportData: () => void;
  onClearAuditLogs: () => void;
}

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  auditLogs,
  onExportData,
  onClearAuditLogs
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = auditLogs.filter(
    log =>
      filterQuery === '' ||
      log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#1c3a34] border border-[#2a4e47] p-6 sm:p-8 rounded-2xl text-stone-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-amber-300/90 text-xs font-mono tracking-widest uppercase mb-1 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Privacy & Ownership Vault</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">
            Privacy Center & Immutable Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed max-w-2xl">
            LegacyVault AI operates on zero trust, strict data minimization, and user ownership. Every action across your vault is logged in an immutable ledger.
          </p>
        </div>

        <button
          onClick={onExportData}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all flex items-center space-x-2 shadow-sm cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Vault Archive (JSON)</span>
        </button>
      </div>

      {/* 4 Guarantees Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#E7E2D8] space-y-2 shadow-2xs">
          <div className="text-[#1c3a34] font-serif font-bold text-sm flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1. Deny by Default</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Access is zero-trust. No contact receives files without explicit, unexpired owner authorization.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2D8] space-y-2 shadow-2xs">
          <div className="text-[#1c3a34] font-serif font-bold text-sm flex items-center space-x-1.5">
            <Key className="w-4 h-4 text-amber-600" />
            <span>2. Zero Banking Secrets</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Strict refusal to record PINs, passwords, CVVs, or OTPs. Non-secret structural metadata only.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2D8] space-y-2 shadow-2xs">
          <div className="text-[#1c3a34] font-serif font-bold text-sm flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>3. Ephemeral AI Processing</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Gemini processes document text ephemerally server-side. Zero training on user documents.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#E7E2D8] space-y-2 shadow-2xs">
          <div className="text-[#1c3a34] font-serif font-bold text-sm flex items-center space-x-1.5">
            <HardDrive className="w-4 h-4 text-[#1c3a34]" />
            <span>4. Complete Portability</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            You own 100% of your records. Export your full vault index in standard JSON format at any time.
          </p>
        </div>
      </div>

      {/* Audit Log Viewer */}
      <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2 text-stone-900 font-serif font-bold text-base">
            <List className="w-4 h-4 text-[#1c3a34]" />
            <span>Live Security Audit Ledger ({filteredLogs.length})</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Filter security events..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1c3a34]"
            />
          </div>
        </div>

        <div className="border border-[#E7E2D8] rounded-xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto divide-y divide-[#E7E2D8]">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs font-medium">
                No security log entries match the filter.
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="p-3.5 text-xs flex items-center justify-between hover:bg-[#FAF8F5] transition-colors">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.result === 'GRANTED' || log.result === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : log.result === 'DENIED' || log.result === 'REJECTED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}>
                        {log.result}
                      </span>

                      <span className="font-bold text-stone-900">{log.action}</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[#1c3a34] font-semibold">{log.actorName}</span>
                    </div>

                    <div className="text-[11px] text-stone-600 font-medium">
                      Target: <span className="text-stone-800 font-semibold">{log.target}</span> — {log.details}
                    </div>
                  </div>

                  <div className="text-[10px] text-stone-400 font-mono shrink-0 pl-3">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
