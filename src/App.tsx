import React, { useState, useEffect } from 'react';
import { User, VaultDocument, TrustedContact, AccessRequest, AuditLog, UserAccountState, DocumentCategory } from './types/index';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { VaultDashboard } from './components/VaultDashboard';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { DocumentDetailModal } from './components/DocumentDetailModal';
import { AiSearchModal } from './components/AiSearchModal';
import { TrustedContactsView } from './components/TrustedContactsView';
import { AccessRequestsView } from './components/AccessRequestsView';
import { EmergencyLegacyView } from './components/EmergencyLegacyView';
import { TrustedContactPortal } from './components/TrustedContactPortal';
import { PrivacyDashboard } from './components/PrivacyDashboard';
import { DemoControlsModal } from './components/DemoControlsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-aarav-owner',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    role: 'owner',
    state: 'ACTIVE',
    createdAt: new Date().toISOString()
  });

  const users: User[] = [
    { id: 'user-aarav-owner', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'owner', state: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: 'contact-priya-mother', name: 'Priya Sharma (Mother)', email: 'priya.mother@example.com', role: 'trusted_contact', state: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: 'contact-rohan-brother', name: 'Rohan Sharma (Backup)', email: 'rohan.brother@example.com', role: 'trusted_contact', state: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: 'user-admin', name: 'System Admin', email: 'admin@legacyvault.ai', role: 'admin', state: 'ACTIVE', createdAt: new Date().toISOString() }
  ];

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Data states
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [approvedDocsForContact, setApprovedDocsForContact] = useState<VaultDocument[]>([]);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Fetch initial data based on current user
  const fetchData = async (userId: string = currentUser.id) => {
    try {
      const headers = { 'x-user-id': userId };

      // Fetch documents
      const docRes = await fetch('/api/vault/documents', { headers });
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.documents || []);
      }

      // Fetch contacts
      const contactRes = await fetch('/api/contacts', { headers });
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContacts(contactData.contacts || []);
      }

      // Fetch requests
      const reqRes = await fetch('/api/requests', { headers });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setAccessRequests(reqData.requests || []);
      }

      // Fetch audit logs
      const auditRes = await fetch('/api/privacy/audit-logs', { headers });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData(currentUser.id);
  }, [currentUser.id]);

  // Switch User handler
  const handleSwitchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      if (found.role === 'trusted_contact') {
        setActiveTab('contact-portal');
      } else {
        setActiveTab('dashboard');
      }
      fetchData(userId);
    }
  };

  // Upload callback
  const handleUploadSuccess = (newDoc: VaultDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
    fetchData();
  };

  // Update Document callback
  const handleUpdateDocumentSuccess = (updatedDoc: VaultDocument) => {
    setDocuments(prev => prev.map(d => (d.id === updatedDoc.id ? updatedDoc : d)));
    fetchData();
  };

  // Delete Document callback
  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/vault/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete doc:', err);
    }
  };

  // Add Contact
  const handleAddContact = async (contactData: any) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(contactData)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Add contact error:', err);
    }
  };

  // Update Contact Permissions
  const handleUpdateContactPermissions = async (contactId: string, allowedCategories: DocumentCategory[]) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ allowedCategories })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Update permissions error:', err);
    }
  };

  // Revoke Contact
  const handleRevokeContact = async (contactId: string) => {
    if (confirm('Revoke all access permissions for this contact?')) {
      try {
        const res = await fetch(`/api/contacts/${contactId}`, {
          method: 'DELETE',
          headers: { 'x-user-id': currentUser.id }
        });
        if (res.ok) {
          fetchData();
        }
      } catch (err) {
        console.error('Revoke contact error:', err);
      }
    }
  };

  // Approve Access Request
  const handleApproveRequest = async (reqId: string, responseNote?: string) => {
    try {
      const res = await fetch(`/api/requests/${reqId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ responseNote })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  // Reject Access Request
  const handleRejectRequest = async (reqId: string, responseNote?: string) => {
    try {
      const res = await fetch(`/api/requests/${reqId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ responseNote })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  // Update User Account State
  const handleUpdateUserState = async (newState: UserAccountState) => {
    try {
      const res = await fetch('/api/user/state', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ state: newState })
      });
      if (res.ok) {
        setCurrentUser(prev => ({ ...prev, state: newState }));
        fetchData();
      }
    } catch (err) {
      console.error('Update user state error:', err);
    }
  };

  // Submit Emergency Request
  const handleSubmitEmergencyRequest = async (reason: string) => {
    try {
      await fetch('/api/emergency/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ reason })
      });
      fetchData();
    } catch (err) {
      console.error('Emergency request error:', err);
    }
  };

  // Submit Legacy Proof
  const handleSubmitLegacyProof = async (proofDocName: string, proofDetails: string) => {
    try {
      await fetch('/api/legacy/proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ proofDocName, proofDetails })
      });
      fetchData();
    } catch (err) {
      console.error('Legacy proof error:', err);
    }
  };

  // Send Access Request (Trusted Contact)
  const handleSendAccessRequest = async (category: DocumentCategory, reason: string) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          category,
          reason,
          requestedByUserId: currentUser.id,
          requestedByName: currentUser.name
        })
      });

      const data = await res.json();
      if (res.ok) {
        fetchData();
        return { success: true, message: 'Access request submitted to vault owner.' };
      } else {
        return { success: false, message: data.error || 'Failed to submit request.' };
      }
    } catch (err: any) {
      return { success: false, message: 'Request error: ' + err.message };
    }
  };

  // Export Data JSON
  const handleExportData = async () => {
    try {
      const res = await fetch('/api/privacy/export', {
        headers: { 'x-user-id': currentUser.id }
      });
      if (res.ok) {
        const data = await res.json();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LegacyVault_Export_${currentUser.id}_${Date.now()}.json`;
        a.click();
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Reset Demo Baseline
  const handleResetDemo = async () => {
    if (confirm('Reset entire vault to baseline seed data?')) {
      try {
        const res = await fetch('/api/demo/reset', { method: 'POST' });
        if (res.ok) {
          fetchData();
          alert('Demo data baseline reset successfully.');
        }
      } catch (err) {
        console.error('Reset error:', err);
      }
    }
  };

  // Run Scenario
  const handleRunScenario = async (scenarioId: string) => {
    try {
      const res = await fetch('/api/demo/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
      const data = await res.json();
      fetchData();
      return data;
    } catch (err: any) {
      return { pass: false, message: err.message, details: 'Network error' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={tab => {
          setShowLanding(false);
          setActiveTab(tab);
        }}
        onOpenDemoScenarios={() => setIsDemoModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {showLanding ? (
          <LandingPage onStartDemo={() => setShowLanding(false)} />
        ) : (
          <>
            {/* View Switching */}
            {activeTab === 'dashboard' && currentUser.role === 'owner' && (
              <VaultDashboard
                documents={documents}
                pendingRequests={accessRequests.filter(r => r.status === 'pending')}
                onUploadClick={() => setIsUploadOpen(true)}
                onSelectDocument={doc => setSelectedDoc(doc)}
                onDeleteDocument={handleDeleteDocument}
                onOpenAiSearch={() => setIsAiSearchOpen(true)}
              />
            )}

            {activeTab === 'contacts' && currentUser.role === 'owner' && (
              <TrustedContactsView
                contacts={contacts}
                onAddContact={handleAddContact}
                onUpdatePermissions={handleUpdateContactPermissions}
                onRevokeContact={handleRevokeContact}
              />
            )}

            {activeTab === 'requests' && currentUser.role === 'owner' && (
              <AccessRequestsView
                requests={accessRequests}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
              />
            )}

            {activeTab === 'emergency' && currentUser.role === 'owner' && (
              <EmergencyLegacyView
                currentUser={currentUser}
                onUpdateUserState={handleUpdateUserState}
                onSubmitEmergencyRequest={handleSubmitEmergencyRequest}
                onSubmitLegacyRequest={handleSubmitLegacyProof}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacyDashboard
                auditLogs={auditLogs}
                onExportData={handleExportData}
                onClearAuditLogs={() => setAuditLogs([])}
              />
            )}

            {activeTab === 'contact-portal' && currentUser.role === 'trusted_contact' && (
              <TrustedContactPortal
                currentUser={currentUser}
                onSendAccessRequest={handleSendAccessRequest}
                approvedDocs={approvedDocsForContact}
              />
            )}
          </>
        )}

      </main>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentDetailModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onUpdateSuccess={handleUpdateDocumentSuccess}
        onDeleteSuccess={handleDeleteDocument}
      />

      <AiSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        documents={documents}
        onSelectDocument={doc => setSelectedDoc(doc)}
      />

      <DemoControlsModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onRunScenario={handleRunScenario}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 mt-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-800">LegacyVault AI</strong> — Private Digital Legacy & Important Document Protection Engine
          </div>
          <div className="text-[11px] text-slate-500">
            Deny by Default • Zero Confidential PIN Storage • Human-in-the-Loop AI
          </div>
        </div>
      </footer>

    </div>
  );
}
