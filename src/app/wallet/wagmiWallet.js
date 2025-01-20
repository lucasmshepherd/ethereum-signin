import { ethers } from "ethers";

// Store wallet state
let connectedSigner = null;
let connectedAddress = null;

// Expose wallet functions
window.wagmiWallet = {
  // Detect available wallets
  detectWallets: async () => {
    const wallets = [];

    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask) wallets.push("MetaMask");
      if (window.ethereum.isCoinbaseWallet) wallets.push("Coinbase Wallet");
      if (!window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet) {
        wallets.push("Generic Wallet");
      }
    }

    return wallets;
  },

  // Connect to a wallet
  connectWallet: async (walletType) => {
    if (walletType === "MetaMask" && (!window.ethereum || !window.ethereum.isMetaMask)) {
      throw new Error("MetaMask is not installed.");
    }

    if (walletType === "Coinbase Wallet" && (!window.ethereum || !window.ethereum.isCoinbaseWallet)) {
      throw new Error("Coinbase Wallet is not installed.");
    }

    if (!window.ethereum) {
      throw new Error("No Ethereum wallet detected.");
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethersProvider.send("eth_requestAccounts", []);
      connectedAddress = accounts[0];
      connectedSigner = ethersProvider.getSigner();

      return connectedAddress;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      throw err;
    }
  },

  // Sign a message
  signMessage: async (message) => {
    if (!connectedSigner) {
      throw new Error("Wallet not connected.");
    }

    try {
      const signature = await connectedSigner.signMessage(message);
      return signature;
    } catch (err) {
      console.error("Message signing failed:", err);
      throw err;
    }
  },

  // Disconnect the wallet
  disconnectWallet: () => {
    connectedSigner = null;
    connectedAddress = null;
  },
};
