
/**
 * Suraksha Native Asset Layer (Bitcoin-Type Simulation)
 */
class MockBitcoinService {
  generateAddress(): string {
    const chars = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
    let addr = 'sur1';
    for (let i = 0; i < 32; i++) addr += chars[Math.floor(Math.random() * chars.length)];
    return addr;
  }

  async waitForConfirmations(onConfirm: (count: number) => void): Promise<void> {
    for (let i = 1; i <= 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConfirm(i);
    }
  }
}

export const btcService = new MockBitcoinService();
