import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    // parse body
    const { address, signature, nonce } = await req.json();

    if (!address || !signature || !nonce) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }

    // build msg to sign
    const message = `please sign this nonce: ${nonce}`;

    // recover signer's address from signature
    const recoveredAddr = verifyMessage(message, signature);

    // check if recovered address matches address in body
    if (recoveredAddr.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }

    // create firebase custom token w/ wallet address as uid
    const customToken = await firebaseAdmin
      .auth()
      .createCustomToken(address.toLowerCase());

    return NextResponse.json({ token: customToken }, { status: 200 });
  } catch (err: unknown) {
    console.error("error verifying signature", err);
    return NextResponse.json({ error: "server error" }, { status: 500 }); 
  }
}
