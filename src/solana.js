import { Connection, PublicKey } from '@solana/web3.js';

// --- USE YOUR PRIVATE ENDPOINT FOR RELIABILITY ---
// Replace with your preferred provider and API key
// For Helius:
const connection = new Connection(
  'https://rpc.helius.xyz/?api-key=e5d53853-7801-43e6-8a37-2cf45ace82d8',
  'confirmed'
);
// For QuickNode, use this instead:
// const connection = new Connection(
//   'https://solana-mainnet.quiknode.pro/e5d53853-7801-43e6-8a37-2cf45ace82d8/',
//   'confirmed'
// );

/**
 * Fetches and returns the latest 10 transactions for a given Solana address.
 * Each transaction includes signature, block time, slot, and instructions count.
 * @param {string} address - The Solana wallet address.
 * @returns {Promise<Array>} Array of transaction details.
 */
export async function getTransactions(address) {
  try {
    if (!address) throw new Error("No address provided.");
    const pubKey = new PublicKey(address);

    // Fetch the latest 10 signatures for the address
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

    if (!signatures || signatures.length === 0) {
      return [];
    }

    // Fetch transaction details for each signature in parallel
    const txs = await Promise.all(
      signatures.map(async sig => {
        const tx = await connection.getParsedTransaction(sig.signature);
        if (!tx) return null;
        return {
          signature: sig.signature,
          blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A",
          slot: tx.slot,
          instructions: tx.transaction.message.instructions,
        };
      })
    );

    // Filter out any nulls (in case some txs are not found)
    return txs.filter(Boolean);
  } catch (error) {
    // Log for debugging
    console.error("Solana API error:", error);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
}
