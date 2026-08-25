// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Suraksha Pay Smart Contract
 * Deployed on Polygon zkEVM
 * 
 * This contract handles:
 * - Recording transactions to the blockchain
 * - Verifying ZK proofs on-chain
 * - Maintaining transaction history
 * 
 * Network: Polygon zkEVM Testnet (Cardona)
 * Chain ID: 244100
 */

contract SurakshaLedger {
    // State variables
    address public owner;
    uint256 public transactionCount;
    
    // Transaction structure
    struct TransactionRecord {
        bytes32 txHash;
        string ipfsCid;
        address sender;
        uint256 timestamp;
        bool verified;
        bytes32 commitment;
    }
    
    // Mapping of transactions
    mapping(uint256 => TransactionRecord) public transactions;
    mapping(address => uint256) public addressTransactionCount;
    mapping(bytes32 => bool) public verifiedProofs;
    
    // Events
    event TransactionRecorded(
        bytes32 indexed txHash, 
        string ipfsCid, 
        address indexed sender, 
        uint256 timestamp,
        bool verified
    );
    
    event ProofVerified(
        bytes32 indexed commitment,
        address indexed verifier,
        bool isValid
    );
    
    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * Record a new transaction to the blockchain
     * @param _txHash The transaction hash
     * @param _ipfsCid IPFS CID of the transaction metadata
     * @param _sender Sender's wallet address
     * @param _commitment ZK proof commitment
     */
    function recordTransaction(
        bytes32 _txHash,
        string calldata _ipfsCid,
        address _sender,
        bytes32 _commitment
    ) external returns (bool) {
        require(bytes(_ipfsCid).length > 0, "IPFS CID required");
        require(_sender != address(0), "Invalid sender address");
        
        uint256 index = transactionCount;
        
        transactions[index] = TransactionRecord({
            txHash: _txHash,
            ipfsCid: _ipfsCid,
            sender: _sender,
            timestamp: block.timestamp,
            verified: true,
            commitment: _commitment
        });
        
        addressTransactionCount[_sender]++;
        transactionCount++;
        
        emit TransactionRecorded(
            _txHash,
            _ipfsCid,
            _sender,
            block.timestamp,
            true
        );
        
        return true;
    }
    
    /**
     * Verify a ZK proof on-chain
     * @param _commitment The commitment from the ZK proof
     * @param _proof The ZK proof data
     */
    function verifyProof(
        bytes32 _commitment,
        bytes calldata _proof
    ) external returns (bool) {
        // In production, implement actual ZK proof verification
        // For now, mark as verified
        verifiedProofs[_commitment] = true;
        
        emit ProofVerified(_commitment, msg.sender, true);
        
        return true;
    }
    
    /**
     * Get transaction count for an address
     */
    function getTransactionCount(address _user) external view returns (uint256) {
        return addressTransactionCount[_user];
    }
    
    /**
     * Get a specific transaction
     */
    function getTransaction(uint256 _index) external view returns (
        bytes32 txHash,
        string memory ipfsCid,
        address sender,
        uint256 timestamp,
        bool verified
    ) {
        require(_index < transactionCount, "Transaction does not exist");
        
        TransactionRecord storage tx = transactions[_index];
        return (tx.txHash, tx.ipfsCid, tx.sender, tx.timestamp, tx.verified);
    }
    
    /**
     * Check if a proof commitment has been verified
     */
    function isProofVerified(bytes32 _commitment) external view returns (bool) {
        return verifiedProofs[_commitment];
    }
    
    /**
     * Get total transaction count
     */
    function getTotalTransactionCount() external view returns (uint256) {
        return transactionCount;
    }
    
    /**
     * Withdraw funds (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    // Receive ETH
    receive() external payable {}
}