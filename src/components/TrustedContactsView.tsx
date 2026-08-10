import React, { useState } from 'react';
import { TrustedContact, DocumentCategory } from '../types/index';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Lock,
  X,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Shield,
  Heart,
  Key,
  Check,
  Minus
} from 'lucide-react';

interface TrustedContactsViewProps {
  contacts: TrustedContact[];
  onAddContact: (contactData: any) => void;
  onUpdatePermissions: (contactId: string, allowedCategories: DocumentCategory[]) => void;
  onRevokeContact: (contactId: string) => void;
}

export const TrustedContactsView: React.FC<TrustedContactsViewProps> = ({
  contacts,
  onAddContact,
  onUpdatePermissions,
  onRevokeContact
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // New Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [isBackup, setIsBackup] = useState(false);
  const [backupForId, setBackupForId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DocumentCategory[]>([
    'Insurance',
    'Loans'
  ]);

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

  const handleCategoryToggle = (cat: DocumentCategory) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddContact({
      name,
      email,
      relationship,
      isBackup,
      backupForId: isBackup ? backupForId : undefined,
      allowedCategories: selectedCategories
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setSelectedCategories(['Insurance', 'Loans']);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-[#1c3a34] border border-[#2a4e47] p-6 sm:p-8 rounded-2xl text-stone-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-amber-300/90 text-xs font-mono tracking-widest uppercase mb-1 flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-300" />
            <span>Trusted Circle Engine</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-100">
            Trusted Circle & Access Permissions
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed max-w-2xl">
            "These are the people I trust with specific parts of my legacy." A trusted contact does not automatically have access to your data. They only have permission to request access under conditions you define.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all flex items-center space-x-2 shadow-sm cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nominate Contact</span>
        </button>
      </div>

      {/* Section 12: Visual Relationship Model (Trusted Circle Hub) */}
      <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">Your Trusted Circle Map</h2>
            <p className="text-xs text-stone-500 font-medium">Owner-centric security model. Access is denied by default until explicitly authorized.</p>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-stone-100 text-stone-600 border border-stone-200">
            2 ACTIVE TRUSTED CONTACTS
          </span>
        </div>

        {/* Central Hub & Surrounding Contacts Diagram */}
        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#E7E2D8] relative overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            
            {/* Primary Contact Card */}
            {contacts[0] && (
              <div className="p-5 rounded-xl bg-white border-2 border-emerald-600/30 shadow-sm hover:border-emerald-600 transition-all space-y-3 relative">
                <div className="absolute -top-3 left-4 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Primary Contact
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-sm">
                    {contacts[0].name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{contacts[0].name}</h3>
                    <p className="text-[11px] text-stone-500 font-medium">{contacts[0].relationship} • {contacts[0].email}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200 text-[11px] space-y-1">
                  <div className="text-stone-700 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identity Status: Identity Verified ✓</span>
                  </div>
                  <div className="text-stone-500">
                    Allowed to request: <strong className="text-stone-800">{contacts[0].allowedCategories.join(', ')}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 font-mono pt-1">
                  Last verified interaction: Today
                </div>
              </div>
            )}

            {/* Owner Center Hub */}
            <div className="p-6 rounded-2xl bg-[#1c3a34] text-stone-100 text-center space-y-3 shadow-md border border-[#2a4e47] my-2">
              <div className="w-12 h-12 rounded-full bg-[#2a4e47] border border-amber-300/40 text-amber-300 mx-auto flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-stone-100">Aarav Sharma</h3>
                <p className="text-xs text-amber-200/90 font-mono uppercase tracking-wider mt-0.5">VAULT OWNER (YOU)</p>
              </div>
              <p className="text-[11px] text-stone-300 font-medium leading-relaxed bg-[#152e29] p-3 rounded-xl border border-[#23453e]">
                Owner controls 100% of permissions. Contacts can only request files — zero automatic viewing.
              </p>
            </div>

            {/* Backup Contact Card */}
            {contacts[1] && (
              <div className="p-5 rounded-xl bg-white border-2 border-purple-600/30 shadow-sm hover:border-purple-600 transition-all space-y-3 relative">
                <div className="absolute -top-3 left-4 bg-purple-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Backup Contact
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-bold text-sm">
                    {contacts[1].name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{contacts[1].name}</h3>
                    <p className="text-[11px] text-stone-500 font-medium">{contacts[1].relationship} • {contacts[1].email}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200 text-[11px] space-y-1">
                  <div className="text-stone-700 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Identity Status: Identity Verified ✓</span>
                  </div>
                  <div className="text-stone-500">
                    Allowed to request: <strong className="text-stone-800">{contacts[1].allowedCategories.join(', ')}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-stone-400 font-mono pt-1">
                  Backup for: Priya Sharma
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Section 13: PERMISSIONS — "WHO CAN KNOW WHAT?" */}
      <div className="bg-white border border-[#E7E2D8] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-6">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Who Can Know What? (Category Permission Matrix)</h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Priya & Vikram do not have permanent access. They can only request the specific categories you authorize below.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="border border-[#E7E2D8] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-600 font-mono uppercase tracking-wider text-[11px] border-b border-[#E7E2D8]">
              <tr>
                <th className="p-3.5 pl-4">Record Category</th>
                {contacts.map(c => (
                  <th key={c.id} className="p-3.5 text-center">
                    <div>{c.name}</div>
                    <div className="text-[10px] text-stone-400 font-normal lowercase">{c.relationship}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E7E2D8]">
              {allCategories.map(cat => (
                <tr key={cat} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="p-3.5 pl-4 font-bold text-stone-900">{cat}</td>

                  {contacts.map(c => {
                    const isAllowed = c.allowedCategories.includes(cat);
                    return (
                      <td key={c.id} className="p-3.5 text-center">
                        {isAllowed ? (
                          <span className="inline-flex items-center space-x-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-[10px]">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Authorized</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded text-[10px]">
                            <Minus className="w-3 h-3 text-stone-400" />
                            <span>Denied</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{contact.name}</h3>
                    <p className="text-xs text-stone-500 font-medium">{contact.relationship} • {contact.email}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#1c3a34] border border-[#E7E2D8]">
                    {contact.isBackup ? 'Backup' : 'Primary'}
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 font-medium italic mt-3 bg-white p-2.5 rounded border border-[#E7E2D8]">
                  "{contact.name} does not have permanent access. She can only request the information you have authorized."
                </p>
              </div>

              <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1c3a34] border border-[#E7E2D8] hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Edit Permissions Matrix
                </button>

                <button
                  onClick={() => onRevokeContact(contact.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-serif font-bold text-stone-900 mb-1 flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-[#1c3a34]" />
              <span>Nominate Trusted Contact</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-4">
              Nominate a family member and select specifically which categories they are allowed to request access to.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={e => setRelationship(e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-[#1c3a34]"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Trusted Advisor">Trusted Advisor</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isBackup"
                    checked={isBackup}
                    onChange={e => setIsBackup(e.target.checked)}
                    className="rounded border-stone-300 bg-white text-[#1c3a34] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isBackup" className="text-xs font-semibold text-stone-700 cursor-pointer">
                    Set as Backup Contact
                  </label>
                </div>
              </div>

              {/* Category Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Allowed Category Access Requests:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2.5 bg-white rounded-xl border border-[#E7E2D8]">
                  {allCategories.map(cat => (
                    <label key={cat} className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer p-1 rounded hover:bg-stone-100">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-stone-300 bg-white text-[#1c3a34] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="font-medium">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1c3a34] text-amber-200 hover:bg-[#152e29] cursor-pointer shadow-sm"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingContact(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-serif font-bold text-stone-900 mb-1">
              Edit Category Permissions for {editingContact.name}
            </h2>
            <p className="text-xs text-stone-500 font-medium mb-4">
              Select or unselect document categories this contact is allowed to request access for.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {allCategories.map(cat => {
                const isAllowed = editingContact.allowedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const newCats = isAllowed
                        ? editingContact.allowedCategories.filter(c => c !== cat)
                        : [...editingContact.allowedCategories, cat];
                      setEditingContact({ ...editingContact, allowedCategories: newCats });
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      isAllowed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'bg-white border-[#E7E2D8] text-stone-500'
                    }`}
                  >
                    {isAllowed ? '✓ ' : '+ '} {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingContact(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onUpdatePermissions(editingContact.id, editingContact.allowedCategories);
                  setEditingContact(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1c3a34] text-amber-200 hover:bg-[#152e29] cursor-pointer shadow-sm"
              >
                Save Category Permissions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
