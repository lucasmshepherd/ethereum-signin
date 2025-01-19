"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { firebaseAuth } from "@/lib/firebaseClient";
import { signInWithCustomToken } from "firebase/auth";

export default function AuthButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      // ensure wallet is available
      if (!window.ethereum) {
        setError("no wallet found, install metamask");
        return; 
      }

      // connect to metamask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // generate a random nonce
      const nonce = Math.floor(Math.random() * 1000000).toString();

      // prompt user to sign the message
      const signer = await provider.getSigner();
      const message = `please sign this nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      // call your api to validate & get a firebase custom token
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, nonce }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "auth failed");
      }

      const { token } = await res.json();

      // use the firebase custom token to sign in
      await signInWithCustomToken(firebaseAuth, token);
      setWalletAddress(address);
    } catch (err: any) {
      setError(err.message || "unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? "signing in..." : "sign in w/ ethereum"}
      </button>
      {error && <p>error: {error}</p>}
      {walletAddress && <p>logged in as: {walletAddress}</p>}
    </div>
  );
}
