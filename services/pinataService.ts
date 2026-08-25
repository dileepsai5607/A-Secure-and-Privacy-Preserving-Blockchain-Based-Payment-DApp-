/**
 * Layer 3B: Pinata Cloud IPFS Storage Service
 * Real IPFS integration using Pinata's API
 * 
 * Configuration:
 * - Set VITE_PINATA_JWT in your .env.local file
 * - Get your API keys from https://app.pinata.cloud/developers/api-keys
 */

const PINATA_API_URL = 'https://api.pinata.cloud';

// Get JWT from environment or use fallback (for demo purposes)
const getJwtToken = (): string => {
  return import.meta.env.VITE_PINATA_JWT || '';
};

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

class PinataService {
  private jwtToken: string;
  private gatewayUrl: string;

  constructor() {
    this.jwtToken = getJwtToken();
    this.gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
  }

  private async makeRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<any> {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.jwtToken}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${PINATA_API_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pinata API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Check if Pinata is configured
   */
  isConfigured(): boolean {
    return !!this.jwtToken && this.jwtToken.length > 0;
  }

  /**
   * Upload metadata to IPFS via Pinata
   * @param data - The data to upload (will be converted to JSON)
   * @returns IPFS CID (Content Identifier)
   */
  async uploadMetadata(data: any): Promise<string> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Pinata not configured. Using mock CID.');
      return `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    try {
      // Prepare the data as a JSON file
      const jsonData = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        app: 'Suraksha Pay',
        version: '1.0.0',
      });

      // Create a FormData for Pinata's pinFileToIPFS endpoint
      const formData = new FormData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], 'metadata.json', { type: 'application/json' });
      formData.append('file', file);

      // Upload to Pinata
      const response = await fetch(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.jwtToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata upload failed: ${response.status} - ${error}`);
      }

      const result: PinataUploadResponse = await response.json();
      console.log('✅ Uploaded to Pinata IPFS:', result.IpfsHash);
      
      return result.IpfsHash;
    } catch (error) {
      console.error('❌ Pinata upload error:', error);
      throw error;
    }
  }

  /**
   * Upload JSON directly to IPFS via Pinata's JSON endpoint
   * @param data - The JSON data to upload
   * @returns IPFS CID
   */
  async uploadJSON(data: any): Promise<string> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Pinata not configured. Using mock CID.');
      return `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    try {
      const response = await fetch(
        `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pinataContent: {
              ...data,
              timestamp: new Date().toISOString(),
              app: 'Suraksha Pay',
              version: '1.0.0',
            },
            pinataMetadata: {
              name: `suraksha-${Date.now()}.json`,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata JSON upload failed: ${response.status} - ${error}`);
      }

      const result: PinataUploadResponse = await response.json();
      console.log('✅ Uploaded JSON to Pinata IPFS:', result.IpfsHash);
      
      return result.IpfsHash;
    } catch (error) {
      console.error('❌ Pinata JSON upload error:', error);
      throw error;
    }
  }

  /**
   * Get data from IPFS via Pinata gateway
   * @param cid - The IPFS Content Identifier
   * @returns The retrieved data
   */
  async getData(cid: string): Promise<any> {
    // Skip if using mock CID
    if (cid.startsWith('mock_')) {
      console.warn('⚠️ Mock CID - returning sample data');
      return { mock: true, cid };
    }

    if (!this.isConfigured()) {
      throw new Error('Pinata not configured. Set VITE_PINATA_JWT in .env.local');
    }

    try {
      // Using Pinata's dedicated gateway
      const response = await fetch(
        `${this.gatewayUrl}/ipfs/${cid}`
      );

      if (!response.ok) {
        throw new Error(`Failed to retrieve data: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ Pinata retrieval error:', error);
      throw error;
    }
  }

  /**
   * Check connection and API key validity
   * @returns true if connected successfully
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Pinata JWT not configured');
      return false;
    }

    try {
      const response = await this.makeRequest('/data/testAuthentication');
      return !!response;
    } catch (error) {
      console.error('❌ Pinata connection test failed:', error);
      return false;
    }
  }

  /**
   * Get gateway URL for IPFS access
   */
  getGatewayUrl(): string {
    return this.gatewayUrl;
  }
}

// Export singleton instance
export const pinata = new PinataService();