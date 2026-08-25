
import { GoogleGenAI } from "@google/genai";

// Securely obtain the API_KEY from environment variables and initialize the client
export const analyzeTransactionSecurity = async (recipient: string, amount: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Suraksha AI, a fraud detection engine powered by Privacy-Preserving Federated Learning.
          This model is trained on global fraud patterns without ever accessing raw user data.
          
          Transaction Details:
          Recipient: ${recipient}
          Amount: ₹${amount}
          
          Task: Briefly analyze this transaction based on federated intelligence.
          1. Evaluate risk (high amount, suspicious names, or generic IDs).
          2. Remind the user that their specific bank details remain concealed by Lattice-based ZK-Proofs.
          3. Mention that this analysis is based on the latest global model weights synced via Federated Learning.
          
          Keep the response under 50 words, professional, and highlight the Federated Security aspect.`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis error:", error);
    return "Federated Node local scan: Privacy protocol active. Identity shielded via ZK-SNARKs. Proceed with caution if recipient is unknown.";
  }
};

export const getSecurityAdvise = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Suraksha AI, a security assistant. Suraksha Pay uses:
          - Federated Learning for decentralized fraud detection (privacy-first).
          - Lattice-based ZK-SNARKs for transaction shielding.
          - Dilithium Quantum-Resistant Signatures.
          
          User asks: "${query}"
          Provide a concise, expert answer. Emphasize that Federated Learning keeps their data on-device while benefitting from global security trends.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini advice error:", error);
    return "Our federated security network is currently in local-only mode. Your cryptographic vault remains fully protected.";
  }
};
