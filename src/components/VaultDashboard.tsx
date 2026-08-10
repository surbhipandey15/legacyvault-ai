import React, { useState } from 'react';
import { VaultDocument, DocumentCategory, AccessRequest } from '../types/index';
import {
  FileText,
  Upload,
  Sparkles,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  CreditCard,
  TrendingUp,
  Home,
  Award,
  BookOpen,
  Filter,
  ArrowUpRight,
  Eye,
  Trash2,
  AlertTriangle,
  Users,
  Shield,
  Layers,
  Check,
  ChevronRight
} from 'lucide-react';

interface VaultDashboardProps {
  documents: VaultDocument[];
  pendingRequests: AccessRequest[];
  onUploadClick: () => void;
  onSelectDocument: (doc: VaultDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onOpenAiSearch: () => void;
}

export const VaultDashboard: React.FC<VaultDashboardProps> = ({
  documents,
  pendingRequests,
  onUploadClick,
  onSelectDocument,
  onDeleteDocument,
  onOpenAiSearch
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'library' | 'grid'>('library');

  // Categories definition
  const categories: { name: DocumentCategory; icon: any }[] = [
    { name: 'Insurance', icon: ShieldCheck },
    { name: 'Bank Information', icon: Building },
    { name: 'Loans', icon: CreditCard },
    { name: 'Investments/SIPs', icon: TrendingUp },
    { name: 'Property', icon: Home },
    { name: 'Identity/Documents', icon: FileText },
    { name: 'Certificates', icon: Award },
    { name: 'Subscriptions', icon: BookOpen },
    { name: 'Other', icon: Layers }
  ];

  // Calculate Readiness score & area statuses
  const verifiedCount = documents.filter(d => d.isVerified).length;
  const totalDocs = documents.length;
  const readinessPercent = totalDocs > 0 ? Math.round((verifiedCount / totalDocs) * 85 + 15) : 40;

  // Readiness Area Status Structure
  const readinessAreas = [
    {
      name: 'Identity & Legal',
      category: 'Identity/Documents',
      count: documents.filter(d => d.category === 'Identity/Documents').length,
      status: documents.some(d => d.category === 'Identity/Documents' && d.isVerified) ? 'Complete' : 'Needs review'
    },
    {
      name: 'Insurance Policies',
      category: 'Insurance',
      count: documents.filter(d => d.category === 'Insurance').length,
      status: documents.some(d => d.category === 'Insurance' && !d.isVerified) ? 'Needs review' : 'Complete'
    },
    {
      name: 'Financial Accounts & Loans',
      category: 'Loans',
      count: documents.filter(d => d.category === 'Loans' || d.category === 'Bank Information').length,
      status: 'Complete'
    },
    {
      name: 'Property Deeds & Title',
      category: 'Property',
      count: documents.filter(d => d.category === 'Property').length,
      status: documents.some(d => d.category === 'Property') ? 'Complete' : 'Missing'
    },
    {
      name: 'Family & Certificates',
      category: 'Certificates',
      count: documents.filter(d => d.category === 'Certificates').length,
      status: 'Complete'
    },
    {
      name: 'Handover & Trusted Circle',
      category: 'Handover',
      count: 2, // 2 configured contacts
      status: 'Complete'
    }
  ];

  // Actionable Attention Items
  const unverifiedDocs = documents.filter(d => !d.isVerified);
  const attentionItems = [];

  if (unverifiedDocs.length > 0) {
    attentionItems.push({
      id: 'unverified-ai',
      type: 'review',
      icon: AlertCircle,
      title: `${unverifiedDocs.length} AI-extracted document details waiting for your confirmation`,
      subtitle: 'Human-in-the-loop review ensures exact accuracy before records enter permanent vault.',
      actionLabel: 'Review Record',
      action: () => onSelectDocument(unverifiedDocs[0])
    });
  }

  if (pendingRequests.length > 0) {
    attentionItems.push({
      id: 'pending-requests',
      type: 'request',
      icon: Clock,
      title: `${pendingRequests.length} pending access request from nominated trusted contact`,
      subtitle: 'Priya Sharma requested access. Deny by default remains active until explicitly decided.',
      actionLabel: 'View Queue',
      action: () => {}
    });
  }

  attentionItems.push({
    id: 'insurance-renewal',
    type: 'expiry',
    icon: Calendar,
    title: 'HDFC Ergo Health Insurance renewal due in 32 days',
    subtitle: 'Policy # HDFC-HEALTH-9923 requires annual premium confirmation.',
    actionLabel: 'Check Policy',
    action: () => {
      const doc = documents.find(d => d.category === 'Insurance');
      if (doc) onSelectDocument(doc);
    }
  });

  // Upcoming dates
  const upcomingDates = documents.flatMap(d => {
    const dates: { title: string; category: string; date: string; label: string; doc: VaultDocument }[] = [];
    if (d.extractedData.expiryDate) {
      dates.push({
        title: d.title,
        category: d.category,
        date: d.extractedData.expiryDate,
        label: 'Expiry / Renewal Date',
        doc: d
      });
    }
    if (d.extractedData.dueDate) {
      dates.push({
        title: d.title,
        category: d.category,
        date: d.extractedData.dueDate,
        label: 'EMI / Premium Due',
        doc: d
      });
    }
    return dates;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter documents
  const filteredDocs = documents.filter(d => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesQuery =
      searchFilter === '' ||
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (d.extractedData.provider && d.extractedData.provider.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner: Personal Control Room Greeting & Action Bar */}
      <div className="bg-[#1c3a34] border border-[#2a4e47] p-6 sm:p-8 rounded-2xl text-stone-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-900/20 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-amber-300/90 text-xs font-mono tracking-widest uppercase mb-1 flex items-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Vault Owner Control Room</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
              Good day, Aarav.
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed max-w-xl">
              Your important records are organized, verified, and under your strict control.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenAiSearch}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2a4e47] text-stone-200 border border-[#3a635a] hover:border-amber-300/40 hover:text-white transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Quiet Assistant Search</span>
            </button>

            <button
              onClick={onUploadClick}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Deposit Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vault Status & Readiness Structure */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Central Readiness Summary Box */}
        <div className="lg:col-span-1 bg-white border border-[#E7E2D8] p-6 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
                VAULT READINESS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                ACTIVE PROTECTED
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-4xl font-serif font-bold text-stone-900">{readinessPercent}%</span>
              <span className="text-xs text-stone-500 font-medium">prepared for handover</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden my-3">
              <div
                className="bg-[#1c3a34] h-full transition-all duration-500 rounded-full"
                style={{ width: `${readinessPercent}%` }}
              ></div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium mt-3">
              6 core legacy areas configured. Access permissions denied by default for all unlisted categories.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Last vault audit: Today</span>
            <span className="font-bold text-[#1c3a34]">{totalDocs} Records Deposited</span>
          </div>
        </div>

        {/* Readiness Vertical Status Breakdown */}
        <div className="lg:col-span-2 bg-white border border-[#E7E2D8] p-6 rounded-2xl shadow-2xs">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
            <span>Core Area Preparedness Breakdown</span>
            <span className="text-[10px] text-stone-400 font-normal">Updated in real-time</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {readinessAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-between hover:border-stone-300 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-stone-900">{area.name}</div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    {area.count} {area.count === 1 ? 'record' : 'records'} mapped
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border flex items-center space-x-1 ${
                  area.status === 'Complete'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : area.status === 'Needs review'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}>
                  {area.status === 'Complete' ? <Check className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                  <span>{area.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 8: Needs Your Attention */}
      <div className="bg-white border border-[#E7E2D8] p-6 rounded-2xl shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>NEEDS YOUR ATTENTION</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">{attentionItems.length} actionable items</span>
        </div>

        <div className="space-y-3">
          {attentionItems.map(item => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0 mt-0.5">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">{item.title}</h3>
                    <p className="text-[11px] text-stone-600 font-medium mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={item.action}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1c3a34] border border-[#E7E2D8] hover:bg-stone-100 transition-colors shrink-0 cursor-pointer shadow-2xs flex items-center space-x-1"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 9: RECORD LIBRARY INTERFACE */}
      <div className="bg-white border border-[#E7E2D8] p-6 rounded-2xl shadow-2xs space-y-6">
        
        {/* Library Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Record Library Archive</h2>
            <p className="text-xs text-stone-500 font-medium">Browse documents, provider information, and category request permissions.</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
              <button
                onClick={() => setViewMode('library')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'library' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Record List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Cards
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#1c3a34]"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#1c3a34] text-amber-200 font-bold'
                : 'bg-[#FAF8F5] text-stone-600 border border-[#E7E2D8] hover:bg-stone-100'
            }`}
          >
            All Archive ({documents.length})
          </button>

          {categories.map(cat => {
            const count = documents.filter(d => d.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c3a34] text-amber-200 font-bold'
                    : 'bg-[#FAF8F5] text-stone-600 border border-[#E7E2D8] hover:bg-stone-100'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Record List / Library Table View */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#FAF8F5] border border-[#E7E2D8]">
            <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-stone-800">No records found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No vault document matches your search. Deposit a new record or adjust filters.
            </p>
          </div>
        ) : viewMode === 'library' ? (
          <div className="border border-[#E7E2D8] rounded-xl overflow-hidden divide-y divide-[#E7E2D8]">
            <div className="bg-[#FAF8F5] px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 grid grid-cols-12 gap-2">
              <div className="col-span-4 sm:col-span-3">WHAT IT IS / TITLE</div>
              <div className="col-span-3 sm:col-span-3">WHO / PROVIDER</div>
              <div className="col-span-3 sm:col-span-2">WHEN IT MATTERS</div>
              <div className="hidden sm:block sm:col-span-2">REQUEST ELIGIBILITY</div>
              <div className="col-span-2 sm:col-span-2 text-right">VERIFICATION</div>
            </div>

            {filteredDocs.map(doc => {
              const isVerified = doc.isVerified;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="px-4 py-3 text-xs grid grid-cols-12 gap-2 items-center hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  {/* What it is */}
                  <div className="col-span-4 sm:col-span-3 pr-2">
                    <div className="font-bold text-stone-900 group-hover:text-[#1c3a34] truncate">
                      {doc.title}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      {doc.category}
                    </div>
                  </div>

                  {/* Who it belongs to / Provider */}
                  <div className="col-span-3 sm:col-span-3">
                    <div className="font-medium text-stone-800 truncate">
                      {doc.extractedData.provider || 'Personal Record'}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {doc.extractedData.holderName || 'Aarav Sharma'}
                    </div>
                  </div>

                  {/* When it matters */}
                  <div className="col-span-3 sm:col-span-2">
                    {doc.extractedData.expiryDate || doc.extractedData.dueDate ? (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {doc.extractedData.expiryDate || doc.extractedData.dueDate}
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">Permanent</span>
                    )}
                  </div>

                  {/* Who can request it */}
                  <div className="hidden sm:block sm:col-span-2">
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Priya (Mother)
                    </span>
                  </div>

                  {/* Verification status & View button */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end space-x-2">
                    {isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span className="hidden lg:inline">Verified</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span className="hidden lg:inline">Confirm</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => {
              const isVerified = doc.isVerified;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="p-5 rounded-xl bg-white border border-[#E7E2D8] hover:border-[#1c3a34] transition-all flex flex-col justify-between cursor-pointer shadow-2xs group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-stone-600 uppercase tracking-wider">
                        {doc.category}
                      </span>

                      {isVerified ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ! Confirmation Needed
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#1c3a34] line-clamp-1">
                      {doc.title}
                    </h3>

                    {doc.extractedData.provider && (
                      <div className="text-xs font-semibold text-stone-700 mt-1">
                        Provider: {doc.extractedData.provider}
                      </div>
                    )}

                    <p className="text-[11px] text-stone-600 line-clamp-2 mt-2 bg-[#FAF8F5] p-2.5 rounded border border-stone-200">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                    <span className="font-bold text-[#1c3a34]">Open Record →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
