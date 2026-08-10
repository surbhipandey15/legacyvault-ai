export type UserRole = 'owner' | 'trusted_contact' | 'admin';

export type UserAccountState = 'ACTIVE' | 'TEMPORARILY_UNAVAILABLE' | 'EMERGENCY_REVIEW' | 'LEGACY_REVIEW' | 'LEGACY_ACCESS_APPROVED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  state: UserAccountState;
  createdAt: string;
  isDemoUser?: boolean;
}

export type DocumentCategory =
  | 'Insurance'
  | 'Bank Information'
  | 'Loans'
  | 'Investments/SIPs'
  | 'Property'
  | 'Identity/Documents'
  | 'Certificates'
  | 'Subscriptions'
  | 'Other';

export interface ExtractedData {
  documentType: string;
  provider?: string;
  referenceNumber?: string; // Policy #, Loan Ref, Account Last 4 digits (NO FULL SECRETS/PINs/CVVs)
  holderName?: string;
  nominee?: string;
  amount?: string;
  frequency?: string;
  startDate?: string;
  expiryDate?: string; // Expiry, renewal, maturity
  dueDate?: string;    // EMI due date, renewal due
  notes?: string;
  detectedDates?: { label: string; date: string }[];
}

export interface VaultDocument {
  id: string;
  userId: string;
  title: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileData?: string; // Base64 data stored securely on server
  uploadDate: string;
  isVerified: boolean; // Confirmed by user (Human-in-the-loop)
  extractedData: ExtractedData;
  summary: string;
}

export interface TrustedContact {
  id: string;
  ownerUserId: string;
  contactUserId?: string;
  name: string;
  email: string;
  relationship: string;
  isBackup: boolean;
  backupForId?: string; // Primary contact ID if this is a backup
  status: 'pending' | 'active' | 'revoked';
  allowedCategories: DocumentCategory[];
  allowedDocumentIds: string[];
  createdAt: string;
}

export type RequestType = 'normal' | 'emergency' | 'legacy';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface AccessRequest {
  id: string;
  trustedContactId: string;
  requesterUserId: string;
  ownerUserId: string;
  requestType: RequestType;
  category?: DocumentCategory;
  documentId?: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
  responseNote?: string;
  emergencyVerificationStatus?: 'none' | 'pending_proof' | 'verified' | 'failed';
  legacyVerificationStatus?: 'none' | 'pending_proof' | 'verified' | 'failed';
  proofDocumentName?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  result: 'SUCCESS' | 'DENIED' | 'PENDING';
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'access_request' | 'security' | 'reminder' | 'system';
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface DemoScenarioResult {
  scenarioId: number;
  title: string;
  expected: string;
  actual: string;
  passed: boolean;
  details: string;
}
