import { getTransactions } from './solana.js';

const wallet = 'Enter_Wallet_Address_Here';
getTransactions(wallet).then(console.log).catch(console.error);
