import React, { useState } from 'react';
import { User, TrustedContact, VaultDocument, AccessRequest, DocumentCategory } from '../types/index';
import {
  ShieldCheck,
  Eye,
  AlertTriangle,
  Lock,
  FileText,
  Send,
  X,
  CheckCircle2,
  Building
} from 'lucide-react';

interface TrustedContactPortalProps {
  currentUser: User;
  onSendAccessRequest: (category: DocumentCategory, reason: string) => Promise<{ success: boolean; message: string }>;
  approvedDocs: VaultDocument[];
}

export const TrustedContactPortal: React.FC<TrustedContactPortalProps> = ({
  currentUser,
  onSendAccessRequest,
  approvedDocs
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('Insurance');
  const [reason, setReason] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock contact profile matching current user
  const contactPermissions: DocumentCategory[] = ['Insurance', 'Loans'];

  const allCategories: DocumentCategory[] = [
    'Insurance',
    'Bank Information',
    'Loans',
    'Investments/SIPs',
    'Property',
    'Identity/Documents',
    'Certificates',
    'Subscriptions',
    'Other'
  ];

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setStatusMsg(null);

    const res = await onSendAccessRequest(selectedCategory, reason);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setIsRequestModalOpen(false);
      setReason('');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold mb-2">
            <Eye className="w-3.5 h-3.5" />
            <span>Trusted Contact Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            You are a nominated trusted contact for <strong>Aarav Sharma</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center space-x-2 shadow-sm shadow-indigo-200 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Submit Access Request</span>
        </button>
      </div>

      {/* Response Status Message */}
      {statusMsg && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center space-x-2 font-medium shadow-2xs ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Permissions Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Your Authorized Access Categories</span>
        </h2>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          The owner (Aarav Sharma) has configured the following category permissions for your account. You can request access for these authorized categories:
        </p>

        <div className="flex flex-wrap gap-2">
          {contactPermissions.map(cat => (
            <span
              key={cat}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{cat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Approved Documents Section */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Approved Vault Records ({approvedDocs.length})
        </h2>

        {approvedDocs.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500 text-xs font-medium shadow-2xs">
            No document records have been explicitly released or approved for viewing yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {approvedDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-sm hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-extrabold">
                    ✓ APPROVED ACCESS
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900">{doc.title}</h3>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  {doc.extractedData.provider && (
                    <div><strong>Provider:</strong> {doc.extractedData.provider}</div>
                  )}
                  {doc.extractedData.referenceNumber && (
                    <div className="font-mono text-[11px]"><strong>Ref #:</strong> {doc.extractedData.referenceNumber}</div>
                  )}
                  {doc.extractedData.amount && (
                    <div><strong>Coverage / Amount:</strong> {doc.extractedData.amount}</div>
                  )}
                  {doc.extractedData.expiryDate && (
                    <div><strong>Expiry Date:</strong> {doc.extractedData.expiryDate}</div>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {doc.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center space-x-2">
              <Send className="w-5 h-5 text-indigo-600" />
              <span>Submit Access Request to Owner</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Select an authorized category and state your reason for requesting record access.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as DocumentCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat} {!contactPermissions.includes(cat) ? '(Unauthorized - Will fail)' : '(Authorized)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Purpose for Request
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Need health insurance policy number for hospital cashless claim..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !reason}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
