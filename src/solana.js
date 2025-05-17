import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_API_KEY = 'e5d53853-7801-43e6-8a37-2cf45ace82d8';
const connection = new Connection(
  `https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`,
  'confirmed'
);

/**
 * Fetches and returns the latest 10 transactions for a given Solana address.
 * Tries RPC first, then falls back to Helius REST API if needed.
 * @param {string} address - The Solana wallet address.
 * @returns {Promise<Array>} Array of transaction details.
 */
export async function getTransactions(address) {
  try {
    if (!address) throw new Error("No address provided.");
    const pubKey = new PublicKey(address);

    // Try RPC method first
    const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

    if (signatures && signatures.length > 0) {
      const txs = await Promise.all(
        signatures.map(async sig => {
          const tx = await connection.getParsedTransaction(sig.signature);
          if (!tx) return null;
          return {
            signature: sig.signature,
            blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A",
            slot: tx.slot,
            instructions: tx.transaction.message.instructions.length,
          };
        })
      );
      return txs.filter(Boolean);
    }

    // Fallback: Use Helius REST API
    const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Helius API error: " + response.statusText);

    const heliusTxs = await response.json();

    // Simplify response
    return heliusTxs.map(tx => ({
      signature: tx.signature,
      blockTime: tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleString() : "N/A",
      type: tx.type,
      fee: tx.fee,
      source: 'Helius',
    }));
  } catch (error) {
    console.error("Solana API error:", error);
    throw new Error("Failed to fetch transactions: " + error.message);
  }
}
