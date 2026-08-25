<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🛡️ Suraksha Pay - Decentralized Payment System

A **DApp (Decentralized Application)** that works like digital payment systems (PhonePe, Google Pay) but without central company control, middlemen, or banks.

---

## 🌐 What is Suraksha Pay?

Think of Suraksha Pay as a **secure, private, decentralized payment system** that gives you full control over your money and data.

### 🔑 Key Features

| Traditional Apps (PhonePe, Paytm) | Suraksha Pay (Decentralized) |
|----------------------------------|------------------------------|
| Controlled by a company | No central control |
| Data stored on company servers | Data distributed across network |
| Can be hacked or misused | Tamper-proof records |
| Requires trust in company | Cryptographically secure |
| Transaction fees to middlemen | Minimal fees (P2P) |

---

## 🧠 How It Works

### The Core Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    SURAKSHA PAY ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Privacy Protection                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • ZK-SNARK Proofs (Zero-Knowledge Cryptography)   │   │
│  │  • Lattice-Based Signatures (Post-Quantum Secure)  │   │
│  │  • Your identity is protected, not exposed         │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Blockchain Verification                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Polygon zkEVM (Ethereum-compatible)             │   │
│  │  • Transaction verification across 1000+ nodes     │   │
│  │  • Immutable, permanent record                      │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Decentralized Storage                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐     │
│  │  Layer 3A: QLDB      │  │  Layer 3B: IPFS+Pinata   │     │
│  │  Internal Audit     │  │  Permanent File Storage │     │
│  │  Trail              │  │  (receipts, metadata)    │     │
│  └──────────────────────┘  └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Payment Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. You    │────▶│  2. ZK-Proof │────▶│  3. IPFS   │
│  initiate  │     │  Generation │     │  Storage   │
│  payment   │     │  (Private)  │     │  (Pinata)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                                │
                    ┌─────────────┐            │
                    │  5. Receiver│◀───────────┘
                    │  gets paid  │
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │  4. Blockchain│
                    │  Verification│
                    └─────────────┘
```

---

## 🚀 Run Locally

**Prerequisites:** Node.js

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables (optional)
# Create .env.local file with:
# GEMINI_API_KEY=your_api_key_here

# 3. Run the app
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🔐 Why This is Better

### 🏦 Traditional Payment Apps
- Company controls everything
- Your data on their servers
- Can be hacked or misused
- You must trust them

### 🌐 Suraksha Pay (Decentralized)
- No central control (open source)
- Data distributed across network
- Cryptographically secure
- You own your data

---

## 🧩 Simple Analogy

| Traditional | Suraksha Pay |
|-------------|--------------|
| Bank (middleman) | No bank needed |
| Company server | Distributed network |
| Google Drive (centralized) | IPFS (decentralized) |
| PhonePe/Paytm | Your own payment system |

---

## 📄 License

MIT License - Build your own decentralized future!
