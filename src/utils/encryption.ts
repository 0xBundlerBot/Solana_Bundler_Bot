// Encryption utilities for sensitive data

import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';

export class EncryptionService {
  private static instance: EncryptionService;
  private secretKey: string;

  private constructor() {
    this.secretKey = SECRET_KEY;
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Invalid encrypted data');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  encryptObject(obj: any): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('Object encryption failed:', error);
      throw new Error('Failed to encrypt object');
    }
  }

  decryptObject<T>(encryptedData: string): T {
    try {
      const decryptedString = this.decrypt(encryptedData);
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error('Object decryption failed:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128/8).toString();
  }

  hashWithSalt(data: string, salt: string): string {
    return CryptoJS.SHA256(data + salt).toString();
  }

  generateSecureToken(length: number = 32): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }
}

// Utility functions
export const encryption = EncryptionService.getInstance();

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const encrypted = encryption.encryptObject(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage set failed:', error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return encryption.decryptObject<T>(encrypted);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

export const passwordUtils = {
  hash: (password: string): { hash: string; salt: string } => {
    const salt = encryption.generateSalt();
    const hash = encryption.hashWithSalt(password, salt);
    return { hash, salt };
  },

  verify: (password: string, hash: string, salt: string): boolean => {
    const computedHash = encryption.hashWithSalt(password, salt);
    return computedHash === hash;
  },

  generateSecure: (length: number = 16): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  strength: (password: string): { score: number; feedback: string[] } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    return { score, feedback };
  },
};
