import React, { useState } from 'react';
import { AccessRequest } from '../types/index';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  User,
  FileText,
  MessageSquare,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AccessRequestsViewProps {
  requests: AccessRequest[];
  onApproveRequest: (reqId: string, note?: string) => void;
  onRejectRequest: (reqId: string, note?: string) => void;
}

export const AccessRequestsView: React.FC<AccessRequestsViewProps> = ({
  requests,
  onApproveRequest,
  onRejectRequest
}) => {
  const [responseNote, setResponseNote] = useState<{ [reqId: string]: string }>({});

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#1c3a34] border border-[#2a4e47] p-6 sm:p-8 rounded-2xl text-stone-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-amber-300/90 text-xs font-mono tracking-widest uppercase mb-1 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Access Control Engine</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">
            Handover Protocol & Request Queue
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed max-w-2xl">
            Trusted contacts must explicitly request access. You have full oversight to approve, decline, or inspect all requests. Silence is never permission.
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-[#152e29] border border-[#23453e] text-[11px] text-amber-200 font-mono flex items-center space-x-2 shrink-0">
          <Lock className="w-4 h-4 text-amber-300" />
          <span>DENY-BY-DEFAULT ACTIVE</span>
        </div>
      </div>

      {/* Protocol Visual Flow Stepper */}
      <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-4">
        <h2 className="text-sm font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">
          The 4-Step Handover Security Sequence
        </h2>

        <div className="grid sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] space-y-1">
            <div className="text-[10px] font-mono font-bold text-stone-400">STEP 1</div>
            <div className="text-xs font-bold text-stone-900">Contact Request</div>
            <p className="text-[11px] text-stone-500">Contact submits explicit request with reason.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] space-y-1">
            <div className="text-[10px] font-mono font-bold text-[#1c3a34]">STEP 2</div>
            <div className="text-xs font-bold text-stone-900">Verification Period</div>
            <p className="text-[11px] text-stone-500">System waits during mandatory challenge window.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-700">STEP 3</div>
            <div className="text-xs font-bold text-stone-900">Owner Challenge</div>
            <p className="text-[11px] text-stone-500">Owner receives alerts via email & in-app.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1c3a34] text-stone-100 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-300">STEP 4</div>
            <div className="text-xs font-bold text-stone-100">Explicit Decision</div>
            <p className="text-[11px] text-stone-300">Access granted only upon affirmative owner consent.</p>
          </div>
        </div>
      </div>

      {/* Silence != Approval Guarantee Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-800 flex items-start space-x-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-900 font-bold block mb-0.5">Critical Security Rule: Silence is NEVER Permission</strong>
          If you do not respond, the system will <strong>NEVER</strong> automatically grant access. Unresponsive states do NOT imply consent or death.
        </div>
      </div>

      {/* Pending Requests Queue */}
      <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-4">
        <h2 className="text-sm font-mono font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Review ({pendingRequests.length})</span>
          </span>
          <span className="text-[10px] font-normal text-stone-400">Requires owner action</span>
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] text-stone-500 text-xs font-medium">
            No pending access requests in queue. Your vault remains fully secured.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-[#FAF8F5] border border-amber-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {req.category ? `Access Request for Category: ${req.category}` : 'General Record Access'}
                      </div>
                      <div className="text-xs text-stone-500 font-medium mt-0.5">
                        Submitted {new Date(req.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto font-mono">
                    AWAITING OWNER DECISION
                  </span>
                </div>

                {/* Reason provided */}
                <div className="p-3.5 rounded-lg bg-white border border-[#E7E2D8] text-xs text-stone-800">
                  <span className="text-stone-500 font-bold block mb-1">Reason Provided by Contact:</span>
                  "{req.reason}"
                </div>

                {/* Response Note & Actions */}
                <div className="space-y-3 pt-1">
                  <input
                    type="text"
                    placeholder="Optional note for contact (e.g. Approved for medical claim query)..."
                    value={responseNote[req.id] || ''}
                    onChange={e => setResponseNote({ ...responseNote, [req.id]: e.target.value })}
                    className="w-full bg-white border border-[#E7E2D8] rounded-xl px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1c3a34]"
                  />

                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => onRejectRequest(req.id, responseNote[req.id])}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Request</span>
                    </button>

                    <button
                      onClick={() => onApproveRequest(req.id, responseNote[req.id])}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1c3a34] text-amber-200 hover:bg-[#152e29] transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Approve Access</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Past Requests */}
      {pastRequests.length > 0 && (
        <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-4">
          <h2 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-3">
            Request Audit History ({pastRequests.length})
          </h2>

          <div className="space-y-2">
            {pastRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-stone-900">
                    Category: {req.category || 'Record Access'}
                  </div>
                  <div className="text-stone-500 text-[11px] font-medium mt-0.5">
                    Reason: "{req.reason}" • Responded {req.respondedAt ? new Date(req.respondedAt).toLocaleDateString() : ''}
                  </div>
                </div>

                <span className={`font-bold px-2.5 py-1 rounded text-[10px] ${
                  req.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
