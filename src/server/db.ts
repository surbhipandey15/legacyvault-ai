import fs from 'fs';
import path from 'path';
import {
  User,
  VaultDocument,
  TrustedContact,
  AccessRequest,
  AuditLog,
  NotificationItem,
  DocumentCategory
} from '../types/index.js';

const DB_FILE = path.join(process.cwd(), 'legacyvault_data.json');

interface DatabaseSchema {
  users: (User & { passwordHash?: string })[];
  documents: VaultDocument[];
  trustedContacts: TrustedContact[];
  accessRequests: AccessRequest[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
}

const SEED_USERS: (User & { passwordHash?: string })[] = [
  {
    id: 'user-aarav',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    role: 'owner',
    state: 'ACTIVE',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    passwordHash: 'aarav123'
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'trusted_contact',
    state: 'ACTIVE',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    passwordHash: 'priya123'
  },
  {
    id: 'user-rohan',
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    role: 'trusted_contact',
    state: 'ACTIVE',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    passwordHash: 'rohan123'
  },
  {
    id: 'user-admin',
    name: 'System Admin',
    email: 'admin@legacyvault.ai',
    role: 'admin',
    state: 'ACTIVE',
    createdAt: new Date().toISOString(),
    isDemoUser: true,
    passwordHash: 'admin123'
  }
];

const SEED_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-ins-1',
    userId: 'user-aarav',
    title: 'HDFC Ergo Health Suraksha Policy',
    category: 'Insurance',
    fileType: 'application/pdf',
    fileName: 'HDFC_Ergo_Health_Suraksha.pdf',
    fileSize: 2450000,
    uploadDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    isVerified: true,
    summary: 'Family health insurance coverage up to ₹10 Lakhs. Expiry date on 15 Dec 2026. Primary nominee is Priya Sharma.',
    extractedData: {
      documentType: 'Insurance Policy',
      provider: 'HDFC Ergo General Insurance',
      referenceNumber: 'POL-99482710',
      holderName: 'Aarav Sharma',
      nominee: 'Priya Sharma (Mother)',
      amount: '₹10,000,000 Coverage (₹18,500 Annual Premium)',
      frequency: 'Annual',
      startDate: '2023-12-15',
      expiryDate: '2026-12-15',
      dueDate: '2026-12-01',
      notes: 'Includes cashless hospitalization across network hospitals. No secret PIN/password stored.',
      detectedDates: [
        { label: 'Policy Renewal Due', date: '2026-12-15' },
        { label: 'Premium Payment Due', date: '2026-12-01' }
      ]
    }
  },
  {
    id: 'doc-loan-1',
    userId: 'user-aarav',
    title: 'SBI Home Loan Agreement',
    category: 'Loans',
    fileType: 'application/pdf',
    fileName: 'SBI_Home_Loan_Sanction.pdf',
    fileSize: 3800000,
    uploadDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    isVerified: true,
    summary: 'Housing loan sanction letter from State Bank of India. Monthly EMI ₹38,500 due on 10th of every month. Ref # HL-88320.',
    extractedData: {
      documentType: 'Loan Document',
      provider: 'State Bank of India',
      referenceNumber: 'HL-88320 (Account last 4 digits: 4091)',
      holderName: 'Aarav Sharma',
      nominee: 'Priya Sharma',
      amount: '₹4,500,000 (Monthly EMI ₹38,500)',
      frequency: 'Monthly',
      startDate: '2022-04-10',
      dueDate: '2026-08-10',
      notes: 'Property mortgaged is Flat 402, Green Valley Apartments.',
      detectedDates: [
        { label: 'Next EMI Due Date', date: '2026-08-10' }
      ]
    }
  },
  {
    id: 'doc-sip-1',
    userId: 'user-aarav',
    title: 'Axis Bluechip Equity SIP Statement',
    category: 'Investments/SIPs',
    fileType: 'application/pdf',
    fileName: 'Axis_Bluechip_SIP_Folio.pdf',
    fileSize: 1200000,
    uploadDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    isVerified: true,
    summary: 'Monthly Mutual Fund SIP investment statement with Axis AMC. Folio # 91028471. Nominee registered as Rohan Sharma.',
    extractedData: {
      documentType: 'Investment/SIP Document',
      provider: 'Axis Mutual Fund',
      referenceNumber: 'Folio # 91028471',
      holderName: 'Aarav Sharma',
      nominee: 'Rohan Sharma (Brother)',
      amount: '₹10,000 Monthly SIP',
      frequency: 'Monthly',
      startDate: '2021-01-05',
      dueDate: '2026-08-05',
      notes: 'Invested via registered bank mandate ending in 4091.',
      detectedDates: [
        { label: 'SIP Auto-debit Date', date: '2026-08-05' }
      ]
    }
  },
  {
    id: 'doc-prop-1',
    userId: 'user-aarav',
    title: 'Green Valley Apartment Property Deed',
    category: 'Property',
    fileType: 'application/pdf',
    fileName: 'Property_Sale_Deed_Flat402.pdf',
    fileSize: 5100000,
    uploadDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    isVerified: true,
    summary: 'Registered property deed for Flat 402, Green Valley Apartments, Bengaluru. Registered in sub-registrar office.',
    extractedData: {
      documentType: 'Property Document',
      provider: 'Karnataka Sub-Registrar Office',
      referenceNumber: 'Reg Doc # BGL-2022-9981',
      holderName: 'Aarav Sharma',
      nominee: 'Rohan Sharma',
      amount: 'Estimated Value ₹8,500,000',
      startDate: '2022-03-20',
      notes: 'Original physical deed stored in Locker #42 at ICICI Bank Indiranagar branch.',
      detectedDates: [
        { label: 'Property Tax Annual Due', date: '2027-03-31' }
      ]
    }
  }
];

const SEED_TRUSTED_CONTACTS: TrustedContact[] = [
  {
    id: 'contact-priya',
    ownerUserId: 'user-aarav',
    contactUserId: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    relationship: 'Mother',
    isBackup: false,
    status: 'active',
    allowedCategories: ['Insurance', 'Loans'],
    allowedDocumentIds: ['doc-ins-1', 'doc-loan-1'],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'contact-rohan',
    ownerUserId: 'user-aarav',
    contactUserId: 'user-rohan',
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    relationship: 'Brother',
    isBackup: true,
    backupForId: 'contact-priya',
    status: 'active',
    allowedCategories: ['Property', 'Investments/SIPs'],
    allowedDocumentIds: ['doc-prop-1', 'doc-sip-1'],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-aarav',
    actorName: 'Aarav Sharma',
    actorRole: 'owner',
    action: 'UPLOAD_DOCUMENT',
    target: 'HDFC_Ergo_Health_Suraksha.pdf',
    result: 'SUCCESS',
    timestamp: new Date(Date.now() - 10 * 86400000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'User uploaded Insurance policy document.'
  },
  {
    id: 'log-2',
    userId: 'user-aarav',
    actorName: 'System AI',
    actorRole: 'admin',
    action: 'AI_EXTRACT_INFORMATION',
    target: 'HDFC_Ergo_Health_Suraksha.pdf',
    result: 'SUCCESS',
    timestamp: new Date(Date.now() - 10 * 86400000 + 10000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'AI classified as Insurance Policy and extracted renewal dates.'
  },
  {
    id: 'log-3',
    userId: 'user-aarav',
    actorName: 'Aarav Sharma',
    actorRole: 'owner',
    action: 'CONFIRM_EXTRACTED_DATA',
    target: 'HDFC_Ergo_Health_Suraksha.pdf',
    result: 'SUCCESS',
    timestamp: new Date(Date.now() - 10 * 86400000 + 60000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'User verified AI suggestion.'
  },
  {
    id: 'log-4',
    userId: 'user-aarav',
    actorName: 'Priya Sharma',
    actorRole: 'trusted_contact',
    action: 'SUBMIT_ACCESS_REQUEST',
    target: 'Category: Insurance',
    result: 'PENDING',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    ipAddress: '127.0.0.1',
    details: 'Requested access to Insurance category for emergency medical filing.'
  }
];

const SEED_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req-1',
    trustedContactId: 'contact-priya',
    requesterUserId: 'user-priya',
    ownerUserId: 'user-aarav',
    requestType: 'normal',
    category: 'Insurance',
    documentId: 'doc-ins-1',
    reason: 'Need policy details for medical claim reimbursement inquiry.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-aarav',
    title: 'New Access Request from Priya',
    message: 'Priya Sharma requested access to your Insurance category.',
    type: 'access_request',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: false,
    actionUrl: '/requests'
  },
  {
    id: 'notif-2',
    userId: 'user-aarav',
    title: 'Insurance Policy Renewal Alert',
    message: 'Your HDFC Ergo Health Suraksha policy renews in December 2026.',
    type: 'reminder',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: true
  }
];

let dbData: DatabaseSchema = loadDatabase();

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || SEED_USERS,
        documents: parsed.documents || SEED_DOCUMENTS,
        trustedContacts: parsed.trustedContacts || SEED_TRUSTED_CONTACTS,
        accessRequests: parsed.accessRequests || SEED_ACCESS_REQUESTS,
        auditLogs: parsed.auditLogs || SEED_AUDIT_LOGS,
        notifications: parsed.notifications || SEED_NOTIFICATIONS
      };
    }
  } catch (e) {
    console.error('Error reading legacyvault_data.json, seeding defaults', e);
  }

  const initial: DatabaseSchema = {
    users: SEED_USERS,
    documents: SEED_DOCUMENTS,
    trustedContacts: SEED_TRUSTED_CONTACTS,
    accessRequests: SEED_ACCESS_REQUESTS,
    auditLogs: SEED_AUDIT_LOGS,
    notifications: SEED_NOTIFICATIONS
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write legacyvault_data.json', e);
  }
}

export const db = {
  getUsers: () => dbData.users,
  getUserById: (id: string) => dbData.users.find(u => u.id === id),
  getUserByEmail: (email: string) => dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: User & { passwordHash?: string }) => {
    dbData.users.push(user);
    saveDatabase(dbData);
    return user;
  },
  updateUser: (id: string, partial: Partial<User>) => {
    const user = dbData.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, partial);
      saveDatabase(dbData);
    }
    return user;
  },

  getDocuments: (userId: string) => dbData.documents.filter(d => d.userId === userId),
  getDocumentById: (id: string) => dbData.documents.find(d => d.id === id),
  createDocument: (doc: VaultDocument) => {
    dbData.documents.unshift(doc);
    saveDatabase(dbData);
    return doc;
  },
  updateDocument: (id: string, partial: Partial<VaultDocument>) => {
    const doc = dbData.documents.find(d => d.id === id);
    if (doc) {
      Object.assign(doc, partial);
      saveDatabase(dbData);
    }
    return doc;
  },
  deleteDocument: (id: string) => {
    dbData.documents = dbData.documents.filter(d => d.id !== id);
    saveDatabase(dbData);
  },

  getTrustedContacts: (ownerUserId: string) => dbData.trustedContacts.filter(c => c.ownerUserId === ownerUserId),
  getTrustedContactById: (id: string) => dbData.trustedContacts.find(c => c.id === id),
  getTrustedContactsForUser: (contactUserId: string) => dbData.trustedContacts.filter(c => c.contactUserId === contactUserId || c.email === db.getUserById(contactUserId)?.email),
  createTrustedContact: (contact: TrustedContact) => {
    dbData.trustedContacts.push(contact);
    saveDatabase(dbData);
    return contact;
  },
  updateTrustedContact: (id: string, partial: Partial<TrustedContact>) => {
    const contact = dbData.trustedContacts.find(c => c.id === id);
    if (contact) {
      Object.assign(contact, partial);
      saveDatabase(dbData);
    }
    return contact;
  },
  deleteTrustedContact: (id: string) => {
    dbData.trustedContacts = dbData.trustedContacts.filter(c => c.id !== id);
    saveDatabase(dbData);
  },

  getAccessRequests: (ownerUserId?: string, requesterUserId?: string) => {
    return dbData.accessRequests.filter(r => {
      if (ownerUserId && r.ownerUserId !== ownerUserId) return false;
      if (requesterUserId && r.requesterUserId !== requesterUserId) return false;
      return true;
    });
  },
  getAccessRequestById: (id: string) => dbData.accessRequests.find(r => r.id === id),
  createAccessRequest: (req: AccessRequest) => {
    dbData.accessRequests.unshift(req);
    saveDatabase(dbData);
    return req;
  },
  updateAccessRequest: (id: string, partial: Partial<AccessRequest>) => {
    const req = dbData.accessRequests.find(r => r.id === id);
    if (req) {
      Object.assign(req, partial);
      saveDatabase(dbData);
    }
    return req;
  },

  getAuditLogs: (userId?: string) => {
    if (userId) return dbData.auditLogs.filter(l => l.userId === userId);
    return dbData.auditLogs;
  },
  createAuditLog: (log: Omit<AuditLog, 'id'>) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...log
    };
    dbData.auditLogs.unshift(newLog);
    saveDatabase(dbData);
    return newLog;
  },

  getNotifications: (userId: string) => dbData.notifications.filter(n => n.userId === userId),
  createNotification: (notif: Omit<NotificationItem, 'id'>) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...notif
    };
    dbData.notifications.unshift(newNotif);
    saveDatabase(dbData);
    return newNotif;
  },
  markNotificationRead: (id: string) => {
    const n = dbData.notifications.find(x => x.id === id);
    if (n) {
      n.read = true;
      saveDatabase(dbData);
    }
  },

  resetDemoData: () => {
    dbData = {
      users: [...SEED_USERS],
      documents: [...SEED_DOCUMENTS],
      trustedContacts: [...SEED_TRUSTED_CONTACTS],
      accessRequests: [...SEED_ACCESS_REQUESTS],
      auditLogs: [...SEED_AUDIT_LOGS],
      notifications: [...SEED_NOTIFICATIONS]
    };
    saveDatabase(dbData);
    return true;
  }
};
