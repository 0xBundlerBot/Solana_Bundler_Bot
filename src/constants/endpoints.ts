// API Endpoints and Configuration Constants

export const API_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  TESTNET: 'https://api.testnet.solana.com',
  HELIUS: 'https://rpc.helius.xyz',
  QUICKNODE: 'https://solana-mainnet.quicknode.pro',
  ALCHEMY: 'https://solana-mainnet.g.alchemy.com',
} as const;

export const WS_ENDPOINTS = {
  MAINNET: 'wss://api.mainnet-beta.solana.com',
  DEVNET: 'wss://api.devnet.solana.com',
  TESTNET: 'wss://api.testnet.solana.com',
} as const;

export const JUPITER_API = {
  BASE_URL: 'https://quote-api.jup.ag/v6',
  QUOTE: '/quote',
  SWAP: '/swap',
  TOKENS: '/tokens',
  PRICE: '/price',
} as const;

export const BIRDEYE_API = {
  BASE_URL: 'https://public-api.birdeye.so',
  TOKEN_LIST: '/defi/tokenlist',
  TOKEN_SECURITY: '/defi/token_security',
  TOKEN_OVERVIEW: '/defi/token_overview',
  PRICE_VOLUME: '/defi/price_volume_single',
} as const;

export const DEXSCREENER_API = {
  BASE_URL: 'https://api.dexscreener.com',
  LATEST: '/latest/dex/tokens',
  SEARCH: '/latest/dex/search',
  PAIRS: '/latest/dex/pairs/solana',
} as const;

export const COINGECKO_API = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  PRICE: '/simple/price',
  COINS: '/coins/markets',
  TRENDING: '/search/trending',
} as const;

export const SOLSCAN_API = {
  BASE_URL: 'https://public-api.solscan.io',
  ACCOUNT: '/account',
  TRANSACTION: '/transaction',
  TOKEN: '/token',
  MARKET: '/market',
} as const;

export const NETWORK_CONFIGS = {
  mainnet: {
    name: 'Mainnet Beta',
    rpc: API_ENDPOINTS.MAINNET,
    ws: WS_ENDPOINTS.MAINNET,
    explorer: 'https://explorer.solana.com',
  },
  devnet: {
    name: 'Devnet',
    rpc: API_ENDPOINTS.DEVNET,
    ws: WS_ENDPOINTS.DEVNET,
    explorer: 'https://explorer.solana.com?cluster=devnet',
  },
  testnet: {
    name: 'Testnet',
    rpc: API_ENDPOINTS.TESTNET,
    ws: WS_ENDPOINTS.TESTNET,
    explorer: 'https://explorer.solana.com?cluster=testnet',
  },
} as const;

export const DEFAULT_COMMITMENT = 'confirmed';
export const DEFAULT_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;
