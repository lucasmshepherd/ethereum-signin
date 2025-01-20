"use client";

import React, { useState, useEffect } from "react";
import { firebaseAuth } from "@/lib/firebaseClient";
import { signInWithCustomToken } from "firebase/auth";

interface WalletOption {
  name: string;
  connect: () => Promise<string>;
}

export default function WalletAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [wallets, setWallets] = useState<WalletOption[]>([]);

useEffect(() => {
  // Detect available wallets on component mount
  if (window.wagmiWallet?.detectWallets) {
    window.wagmiWallet
      .detectWallets()
      .then((detectedWallets) => {
        const walletOptions: WalletOption[] = detectedWallets.map(
          (walletName: string) => ({
            name: walletName,
            connect: async () => {
              const address = await window.wagmiWallet?.connectWallet?.(
                walletName
              );
              if (!address) {
                throw new Error(`Failed to connect to wallet: ${walletName}`);
              }
              return address; // Ensure it's always a string
            },
          })
        );
        setWallets(walletOptions);
      })
      .catch((err) => {
        console.error("Error detecting wallets:", err);
        setError("Failed to detect wallets. Please try again.");
      });
  } else {
    setError("Wallet detection not supported.");
  }
}, []);



const handleSignIn = async (connect: () => Promise<string>) => {
  try {
    setLoading(true);
    setError("");

    // Connect to the selected wallet
    const address = await connect();
    console.log("Connected wallet address:", address);

    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1000000).toString();

    // Ensure wagmiWallet and signMessage are available
    if (!window.wagmiWallet?.signMessage) {
      throw new Error(
        "Signing functionality is not available. Please refresh the page or try again."
      );
    }

    // Sign the message
    const message = `please sign this nonce: ${nonce}`;
    const signature = await window.wagmiWallet.signMessage(message);
    console.log("Message signed successfully:", signature);

    // Call your API to validate and get a Firebase custom token
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, signature, nonce }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Authentication failed.");
    }

    const { token } = await res.json();

    // Use the Firebase custom token to sign in
    await signInWithCustomToken(firebaseAuth, token);
    setWalletAddress(address);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error during sign-in:", err.message);
      setError(err.message || "Unknown error");
    } else {
      setError("Unknown error");
      console.error("Error during sign-in: Unknown error occurred.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <h2>Sign in with Ethereum</h2>
      {wallets.length > 0 ? (
        wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => handleSignIn(wallet.connect)}
            disabled={loading}
          >
            {loading
              ? `Connecting to ${wallet.name}...`
              : `Sign in with ${wallet.name}`}
          </button>
        ))
      ) : (
        <p>Detecting wallets...</p>
      )}
      {error && <p>Error: {error}</p>}
      {walletAddress && <p>Logged in as: {walletAddress}</p>}
    </div>
  );
}
