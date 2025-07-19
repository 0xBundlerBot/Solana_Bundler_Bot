// Type definitions for Solana Trading Platform

export interface WalletConnection {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => void;
}

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: number;
}

export interface TradeParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage: number;
  priorityFee?: number;
}

export interface BundleConfig {
  wallets: string[];
  tokenMint: string;
  buyAmount: number;
  sellPercentage: number;
  priorityFee: number;
  slippage: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PlatformConfig {
  rpcEndpoint: string;
  wsEndpoint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
  skipPreflight: boolean;
  maxRetries: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'vi' | 'zh' | 'ja';
  autoConnect: boolean;
  soundEnabled: boolean;
  notifications: boolean;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface Transaction {
  signature: string;
  status: TransactionStatus;
  timestamp: number;
  type: 'buy' | 'sell' | 'bundle';
  amount: number;
  token: string;
  fee: number;
}
