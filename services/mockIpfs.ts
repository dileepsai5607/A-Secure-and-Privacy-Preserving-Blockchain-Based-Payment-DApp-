
/**
 * Layer 3B: Decentralized Off-Chain Storage (IPFS Simulation)
 */
class MockIpfs {
  async uploadMetadata(data: any): Promise<string> {
    // Simulate network delay for IPFS propagation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create a mock CID (Content Identifier)
    const contentHash = btoa(JSON.stringify(data)).substring(0, 32);
    return `Qm${contentHash}SurakshaPayPQ`;
  }
}

export const ipfs = new MockIpfs();
