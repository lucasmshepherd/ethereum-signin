interface WagmiWallet {
  detectWallets: () => Promise<string[]>;
  connectWallet: (walletName?: string) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
}

interface Window {
  ethereum?: import("ethers").providers.ExternalProvider; // Keep this for wallet compatibility
  wagmiWallet?: WagmiWallet; // Add this for wagmi wallet functionality
}
