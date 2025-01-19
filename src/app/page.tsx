"use client";

import React from "react";
import AuthButton from "@/components/AuthButton";
import StoreData from "@/components/StoreData";

export default function HomePage() {
  return (
    <div>
      <h1>eth auth test</h1>
      <AuthButton />
      <StoreData />
    </div>
  );
}
