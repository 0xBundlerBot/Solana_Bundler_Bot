// API service layer for external integrations

import { JUPITER_API, BIRDEYE_API, DEXSCREENER_API } from '../constants/endpoints';
import type { ApiResponse, TokenInfo } from '../types';

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = '', timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Jupiter API service
export class JupiterService extends ApiService {
  constructor() {
    super(JUPITER_API.BASE_URL);
  }

  async getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: string;
    slippageBps?: number;
  }) {
    return this.get('/quote', {
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps: (params.slippageBps || 50).toString(),
    });
  }

  async getTokenList(): Promise<ApiResponse<TokenInfo[]>> {
    return this.get('/tokens');
  }

  async getPrice(ids: string[]) {
    return this.get('/price', { ids: ids.join(',') });
  }
}

// Birdeye API service
export class BirdeyeService extends ApiService {
  constructor() {
    super(BIRDEYE_API.BASE_URL);
  }

  async getTokenSecurity(address: string) {
    return this.get(`/defi/token_security?address=${address}`);
  }

  async getTokenOverview(address: string) {
    return this.get(`/defi/token_overview?address=${address}`);
  }

  async getPriceVolume(address: string, type: string = '24h') {
    return this.get(`/defi/price_volume_single?address=${address}&type=${type}`);
  }
}

// DexScreener API service
export class DexScreenerService extends ApiService {
  constructor() {
    super(DEXSCREENER_API.BASE_URL);
  }

  async searchTokens(query: string) {
    return this.get(`/latest/dex/search?q=${encodeURIComponent(query)}`);
  }

  async getTokenData(address: string) {
    return this.get(`/latest/dex/tokens/${address}`);
  }

  async getPairs(chainId: string = 'solana') {
    return this.get(`/latest/dex/pairs/${chainId}`);
  }
}

// Export service instances
export const jupiterService = new JupiterService();
export const birdeyeService = new BirdeyeService();
export const dexScreenerService = new DexScreenerService();

// Generic API utility
export const apiUtils = {
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  retry: async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await apiUtils.delay(delay);
        return apiUtils.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  },

  isValidResponse: <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
    return response.success && response.data !== undefined;
  },
};
