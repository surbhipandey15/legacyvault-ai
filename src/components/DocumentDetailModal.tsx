import React, { useState } from 'react';
import { VaultDocument, DocumentCategory, ExtractedData } from '../types/index';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Calendar,
  CreditCard,
  FileText,
  Save,
  Trash2,
  Lock,
  Shield,
  Bot
} from 'lucide-react';

interface DocumentDetailModalProps {
  document: VaultDocument | null;
  onClose: () => void;
  onUpdateSuccess: (updatedDoc: VaultDocument) => void;
  onDeleteSuccess: (docId: string) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onUpdateSuccess,
  onDeleteSuccess
}) => {
  if (!document) return null;

  const [title, setTitle] = useState(document.title);
  const [category, setCategory] = useState<DocumentCategory>(document.category);
  const [extractedData, setExtractedData] = useState<ExtractedData>({ ...document.extractedData });
  const [summary, setSummary] = useState(document.summary);
  const [isVerified, setIsVerified] = useState(document.isVerified);
  const [isSaving, setIsSaving] = useState(false);

  const categories: DocumentCategory[] = [
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

  const handleSave = async (verifiedState: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/vault/documents/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          isVerified: verifiedState,
          extractedData,
          summary
        })
      });

      const data = await res.json();
      setIsSaving(false);

      if (res.ok) {
        setIsVerified(verifiedState);
        onUpdateSuccess(data.document);
      }
    } catch (err) {
      setIsSaving(false);
      console.error('Failed to update document:', err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to permanently delete this document from your vault?')) {
      onDeleteSuccess(document.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c3a34] flex items-center justify-center text-amber-300 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif font-bold text-stone-900">{document.title}</h2>
                {isVerified ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ VERIFIED RECORD
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    ! VERIFICATION PENDING
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Category: <strong className="text-[#1c3a34]">{document.category}</strong> • Deposited {new Date(document.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-200/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiet Assistant Microcopy Callout */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-6 flex items-start space-x-3 text-xs text-stone-800">
          <Bot className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            <strong className="text-amber-900">Quiet Assistant Microcopy:</strong> AI extracted these details from your deposited document. Please verify them before they become part of your permanent vault record.
          </p>
        </div>

        {/* Split Layout: Left Column = THE RECORD, Right Column = WHAT LEGACYVAULT UNDERSTOOD */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Left Column: THE RECORD */}
          <div className="bg-white p-5 rounded-xl border border-[#E7E2D8] space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>1. THE RECORD</span>
              <span className="text-[10px] text-stone-400 font-normal">Primary metadata</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category Classification</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Record Overview & Context</label>
              <textarea
                rows={4}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34] leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="font-bold text-stone-800 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-[#1c3a34]" />
                <span>Default Access Policy</span>
              </div>
              <p>
                Restricted to Vault Owner. Trusted contacts may only request access under explicit handover rules.
              </p>
            </div>
          </div>

          {/* Right Column: WHAT LEGACYVAULT UNDERSTOOD */}
          <div className="bg-white p-5 rounded-xl border border-[#E7E2D8] space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#1c3a34] uppercase tracking-wider border-b border-stone-100 pb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>2. WHAT LEGACYVAULT UNDERSTOOD</span>
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                AI Extracted
              </span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Provider / Institution</label>
                <input
                  type="text"
                  value={extractedData.provider || ''}
                  onChange={e => setExtractedData({ ...extractedData, provider: e.target.value })}
                  placeholder="e.g. HDFC Ergo, SBI, Axis AMC"
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Policy / Ref / Account Last 4</label>
                <input
                  type="text"
                  value={extractedData.referenceNumber || ''}
                  onChange={e => setExtractedData({ ...extractedData, referenceNumber: e.target.value })}
                  placeholder="e.g. POL-99482710"
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Nominee Registered</label>
                <input
                  type="text"
                  value={extractedData.nominee || ''}
                  onChange={e => setExtractedData({ ...extractedData, nominee: e.target.value })}
                  placeholder="e.g. Priya Sharma (Mother)"
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Amount / Coverage</label>
                <input
                  type="text"
                  value={extractedData.amount || ''}
                  onChange={e => setExtractedData({ ...extractedData, amount: e.target.value })}
                  placeholder="e.g. ₹10 Lakhs Coverage"
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Expiry / Renewal Date</label>
                <input
                  type="date"
                  value={extractedData.expiryDate || ''}
                  onChange={e => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Next Due / EMI Date</label>
                <input
                  type="date"
                  value={extractedData.dueDate || ''}
                  onChange={e => setExtractedData({ ...extractedData, dueDate: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-0.5">Storage Location / Physical Vault</label>
              <input
                type="text"
                value={extractedData.notes || ''}
                onChange={e => setExtractedData({ ...extractedData, notes: e.target.value })}
                placeholder="e.g. Original deed in ICICI Indiranagar locker #402"
                className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
              />
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero banking secrets policy enforced: No PINs or CVVs recorded.</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-stone-800 hover:bg-stone-100 transition-colors flex items-center space-x-1 border border-[#E7E2D8] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1c3a34] text-amber-200 hover:bg-[#152e29] transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Confirm & Verify Record</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
