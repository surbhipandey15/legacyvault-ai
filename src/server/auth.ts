import crypto from 'crypto';
import { db } from './db.js';
import { User, UserRole } from '../types/index.js';

export function hashPassword(password: string): string {
  const salt = 'legacyvault_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function registerUser(name: string, email: string, password: string, role: UserRole = 'owner'): User {
  const existing = db.getUserByEmail(email);
  if (existing) {
    throw new Error('User with this email already exists.');
  }

  const newUser: User & { passwordHash?: string } = {
    id: 'user-' + Date.now(),
    name,
    email,
    role,
    state: 'ACTIVE',
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(password)
  };

  db.createUser(newUser);

  db.createAuditLog({
    userId: newUser.id,
    actorName: name,
    actorRole: role,
    action: 'USER_REGISTER',
    target: email,
    result: 'SUCCESS',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1',
    details: 'New user account created successfully.'
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    state: newUser.state,
    createdAt: newUser.createdAt
  };
}

export function loginUser(email: string, password: string): User {
  const user = db.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Handle plain demo passwords or hashed passwords
  const hashed = hashPassword(password);
  const isValid = user.passwordHash === password || user.passwordHash === hashed;

  if (!isValid) {
    db.createAuditLog({
      userId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      target: email,
      result: 'DENIED',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      details: 'Failed password attempt.'
    });
    throw new Error('Invalid email or password.');
  }

  db.createAuditLog({
    userId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: 'USER_LOGIN',
    target: email,
    result: 'SUCCESS',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1',
    details: 'User authenticated successfully.'
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    state: user.state,
    createdAt: user.createdAt,
    isDemoUser: user.isDemoUser
  };
}
