# 🔗 Solana Transaction 

This project fetches and displays the latest 10 transactions for a given Solana wallet address using the Helius RPC and REST APIs. It first attempts to fetch via the `@solana/web3.js` SDK (RPC), and if no transactions are found, it falls back to the Helius REST API.

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit-green?style=for-the-badge&logo=vercel)](https://solana-tx-history-viewer.onrender.com/)

---

## 🚀 Features

- Fetch latest 10 transactions from a Solana address
- RPC-first, REST fallback strategy (Helius API)
- Displays transaction signature, block time, slot, and instruction count
- Works on both **mainnet** and **devnet**
- Error handling for invalid addresses or network failures

---

## 📦 Tech Stack

- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- [Helius RPC & REST API](https://docs.helius.xyz/)
- JavaScript / TypeScript
- HTML (for front-end demo, if applicable)

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/solana-tx-viewer.git
cd solana-tx-viewer
npm install
```

---

## 📄 Usage

### Function: `getTransactions(address: string)`

```ts
import { getTransactions } from './getTransactions';

const address = "YourSolanaAddressHere";
getTransactions(address)
  .then(console.log)
  .catch(console.error);
```

### Browser Example

If you're using this in the browser:

```html
<input id="addressInput" placeholder="Enter Solana Address" />
<button onclick="onClickFetch()">Get Transactions</button>
<pre id="output"></pre>
```

```js
async function onClickFetch() {
  const address = document.getElementById("addressInput").value;
  const txs = await getTransactions(address);
  document.getElementById("output").innerText = JSON.stringify(txs, null, 2);
}
```

---

## 🌐 API Fallback Logic

* Tries `connection.getSignaturesForAddress()` from `@solana/web3.js`
* If no transactions found or RPC fails, falls back to:

  ```
  https://api.helius.xyz/v0/addresses/{address}/transactions?api-key=YOUR_KEY
  ```

  Or on devnet:

  ```
  https://api-devnet.helius-rpc.com/v0/addresses/{address}/transactions?api-key=YOUR_KEY
  ```

---

## 🔐 Environment

You can optionally use `.env` to store your API key:

```env
HELIUS_API_KEY=your-api-key-here
```

---

## ✅ Example Output

```json
[
  {
    "signature": "5hv....",
    "blockTime": "5/17/2025, 1:30:25 PM",
    "slot": 29585842,
    "instructions": 2
  }
]
```

---

## 🧪 Testing Addresses

Try these:

* **Mainnet:** `4Nd1m9Y...`
* **Devnet:** `6vD1bEk...` (or use Solana faucet to create one)

---

## 📄 License
MIT License

Copyright (c) 2025 ARJUN LAKHANPAL
---
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Credits

Made with ❤️ by [Your Name]
Using [Helius RPC](https://www.helius.xyz/) and Solana Web3
