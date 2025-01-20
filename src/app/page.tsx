"use client";

import { useEffect } from "react";
import React from "react";
import AuthButton from "@/components/AuthButton";
import StoreData from "@/components/StoreData";

export default function HomePage() {
        useEffect(() => {
          window.addEventListener("message", (event) => {
            if (event.data && event.data.target === "metamask-inpage") {
              const messageType = event.data.data?.method;
              if (!messageType) {
                // Suppress warnings for undefined types
                return;
              }
              console.log("MetaMask message:", messageType, event.data);
            }
          });

          return () => {
            // Clean up the event listener on unmount
            window.removeEventListener("message", () => {});
          };
        }, []);
  return (
    <div>
      <h1>eth auth test</h1>
      <AuthButton />
      <StoreData />
    </div>
  );
}
