import { ethers } from "ethers";

let connectedSigner = null;

window.wagmiWallet = {
  // Detect available wallets
  detectWallets: async () => {
    const wallets = [];
    if (window.ethereum?.isMetaMask) {
      wallets.push("MetaMask");
    }
    if (window.ethereum?.isCoinbaseWallet) {
      wallets.push("Coinbase Wallet");
    }
    if (wallets.length === 0 && window.ethereum) {
      wallets.push("Default Ethereum Wallet"); // Generic Ethereum provider
    }

    if (wallets.length === 0) {
      console.warn("No wallets detected.");
    } else {
      console.log("Detected wallets:", wallets);
    }
    return wallets;
  },

  // Connect to a wallet and store the signer
  connectWallet: async (walletName = "Default Ethereum Wallet") => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "No Ethereum provider found. Install MetaMask or another wallet."
        );
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum); // Ensure this is a BrowserProvider
      await ethersProvider.send("eth_requestAccounts", []); // Prompt user to connect wallet
      connectedSigner = await ethersProvider.getSigner(); // Retrieve the signer
      const address = await connectedSigner.getAddress(); // Get wallet address
      console.log(`Connected wallet (${walletName}):`, address);
      return address;
    } catch (err) {
      console.error(`Wallet connection failed (${walletName}):`, err.message);
      throw err;
    }
  },

  // Sign a message using the connected signer
  signMessage: async (message) => {
    if (!connectedSigner) {
      throw new Error("Wallet not connected. Please connect first.");
    }

    if (typeof message !== "string" || !message.trim()) {
      throw new Error("Invalid message. Please provide a non-empty string.");
    }

    console.log("Signer object:", connectedSigner); // Debug: Log the signer object

    try {
      const signature = await connectedSigner.signMessage(message);
      console.log("Message signed successfully:", signature); // Debug: Log the signature
      return signature;
    } catch (err) {
      console.error("Message signing failed:", err.message);
      throw err;
    }
  },

  // Disconnect the wallet (optional, just resets the signer)
  disconnectWallet: () => {
    connectedSigner = null;
    console.log("Wallet disconnected");
  },
};
