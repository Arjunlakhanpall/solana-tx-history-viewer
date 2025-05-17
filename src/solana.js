import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Use the official Solana mainnet-beta endpoint
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

/**
 * Fetches and returns the latest 10 transactions for a given Solana address.
 * Each transaction includes signature, block time, slot, and instructions count.
 * @param {string} address - The Solana wallet address.
 * @returns {Promise<Array>} Array of transaction details.
 */
export async function getTransactions(address) {
  try {
    // Validate the address
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
    throw new Error("Failed to fetch transactions: " + error.message);
  }
}
