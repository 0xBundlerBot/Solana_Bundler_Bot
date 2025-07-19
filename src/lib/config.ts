// Application configuration and environment variables

export const config = {
  // App Info
  app: {
    name: 'Solana Trading Platform',
    version: '1.0.0',
    description: 'Advanced Solana trading and bundling platform',
    author: 'Solana Bundler Team',
  },

  // API Configuration
  api: {
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.solanabundler.app',
  },

  // Solana Network Configuration
  solana: {
    network: process.env.REACT_APP_SOLANA_NETWORK || 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_RPC_URL || 'https://api.mainnet-beta.solana.com',
    wsUrl: process.env.REACT_APP_WS_URL || 'wss://api.mainnet-beta.solana.com',
    commitment: 'confirmed' as const,
    skipPreflight: false,
    maxRetries: 3,
  },

  // Trading Configuration
  trading: {
    defaultSlippage: 0.5, // 0.5%
    maxSlippage: 50, // 50%
    defaultPriorityFee: 0.001, // SOL
    maxPriorityFee: 0.1, // SOL
    minTradeAmount: 0.001, // SOL
    maxTradeAmount: 1000, // SOL
  },

  // Bundle Configuration
  bundle: {
    maxWallets: 100,
    minWallets: 2,
    defaultBuyAmount: 0.1, // SOL
    defaultSellPercentage: 100, // %
    maxConcurrentTrades: 10,
    tradeDelay: 100, // ms between trades
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
    },
    animations: {
      duration: 200,
      easing: 'ease-in-out',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  // Feature Flags
  features: {
    bundleCreator: true,
    advancedTrading: true,
    analytics: true,
    notifications: true,
    darkMode: true,
    multiLanguage: false,
    betaFeatures: false,
  },

  // External Services
  services: {
    jupiter: {
      baseUrl: 'https://quote-api.jup.ag/v6',
      enabled: true,
    },
    birdeye: {
      baseUrl: 'https://public-api.birdeye.so',
      enabled: true,
    },
    dexscreener: {
      baseUrl: 'https://api.dexscreener.com',
      enabled: true,
    },
    coingecko: {
      baseUrl: 'https://api.coingecko.com/api/v3',
      enabled: true,
    },
  },

  // Storage Configuration
  storage: {
    prefix: 'solana_bundler_',
    version: '1.0',
    keys: {
      userPreferences: 'user_preferences',
      walletData: 'wallet_data',
      tradingHistory: 'trading_history',
      bundleConfigs: 'bundle_configs',
      apiKeys: 'api_keys',
    },
  },

  // Security Configuration
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 300000, // 5 minutes
    sessionTimeout: 3600000, // 1 hour
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY || 'default-key',
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.REACT_APP_GA_TRACKING_ID,
    events: {
      trade: 'trade_executed',
      bundle: 'bundle_created',
      wallet: 'wallet_connected',
      error: 'error_occurred',
    },
  },

  // Development Configuration
  development: {
    debug: process.env.NODE_ENV === 'development',
    mockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
    showDevTools: process.env.NODE_ENV === 'development',
    logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
  },
} as const;

// Type definitions for configuration
export type Config = typeof config;
export type NetworkType = 'mainnet-beta' | 'devnet' | 'testnet';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Environment validation
export const validateEnvironment = (): boolean => {
  const requiredEnvVars = [
    // Add required environment variables here
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  return true;
};

// Configuration utilities
export const getNetworkConfig = (network: NetworkType) => {
  const configs = {
    'mainnet-beta': {
      name: 'Mainnet Beta',
      rpc: 'https://api.mainnet-beta.solana.com',
      ws: 'wss://api.mainnet-beta.solana.com',
      explorer: 'https://explorer.solana.com',
    },
    devnet: {
      name: 'Devnet',
      rpc: 'https://api.devnet.solana.com',
      ws: 'wss://api.devnet.solana.com',
      explorer: 'https://explorer.solana.com?cluster=devnet',
    },
    testnet: {
      name: 'Testnet',
      rpc: 'https://api.testnet.solana.com',
      ws: 'wss://api.testnet.solana.com',
      explorer: 'https://explorer.solana.com?cluster=testnet',
    },
  };

  return configs[network];
};

export default config;
