"use client";

import React, { useEffect } from "react";
import { firebaseClientApp, firebaseAuth } from "@/lib/firebaseClient";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function StoreData() {
  useEffect(() => {
    const storeSomeData = async () => {
      const user = firebaseAuth.currentUser;
      if (!user) return;

      const db = getFirestore(firebaseClientApp);
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { someField: "someValue" }, { merge: true });
    };

    storeSomeData();
  }, []);

  return (
    <div>
      <p>data stored if logged in</p> 
    </div>
  );
}
