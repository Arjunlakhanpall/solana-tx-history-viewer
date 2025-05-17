import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Create a connection to the mainnet-beta cluster
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

/**
 * Fetches and returns the latest 10 transactions for a given Solana address.
 * Each transaction includes signature, block time, slot, and instructions.
 * @param {string} address - The Solana wallet address.
 * @returns {Promise<Array>} Array of transaction details.
 */
export async function getTransactions(address) {
  try {
    // Validate the address
    const pubKey = new PublicKey(address);

    // Fetch the latest 10 signatures for the address
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

    const txs = [];
    for (const sig of signatures) {
      // Fetch parsed transaction details for each signature
      const tx = await connection.getParsedTransaction(sig.signature);

      // Defensive: skip if transaction not found (can happen for very recent txs)
      if (!tx) continue;

      txs.push({
        signature: sig.signature,
        blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A",
        slot: tx.slot,
        instructions: tx.transaction.message.instructions,
      });
    }
    return txs;
  } catch (error) {
    // Throw error for the UI to display
    throw new Error("Failed to fetch transactions: " + error.message);
  }
}
