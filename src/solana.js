import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

export async function getTransactions(address) {
  const pubKey = new PublicKey(address);
  const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 10 });

  const txs = [];
  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature);
    txs.push({
      signature: sig.signature,
      blockTime: new Date(tx.blockTime * 1000).toLocaleString(),
      slot: tx.slot,
      instructions: tx.transaction.message.instructions,
    });
  }
  return txs;
}
