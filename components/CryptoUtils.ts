
/**
 * Simulated Cryptographic Utilities for Suraksha Pay
 */

/**
 * Generates a quantum-resistant signature for a payload.
 * Simulates lattice-based cryptography (like Dilithium).
 */
export const generateQuantumSignature = async (payload: string): Promise<string> => {
  // Simulate lattice-based crypto signature generation latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `qsig_dilithium_${hashHex.substring(0, 32)}`;
};

/**
 * Standard currency formatting for INR
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
