import { NextResponse } from "next/server";
import { verifyMessage } from "ethers";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import Cors from "cors";
import type { IncomingMessage, ServerResponse } from "http";

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST"],
  origin: ["https://preview.construct.net", "http://localhost:3000"], // Add all allowed origins here
});

// Helper function to run middleware
async function runMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  fn: (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: Error | undefined) => void
  ) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result?: Error | undefined) => {
      if (result) {
        reject(result);
      } else {
        resolve();
      }
    });
  });
}

// POST method for App Directory
export async function POST(req: Request) {
  try {
    const res = NextResponse.next();

    // Run the CORS middleware
    await runMiddleware(
      req as unknown as IncomingMessage,
      res as unknown as ServerResponse,
      cors
    );

    // Parse the request body
    const body: { address?: string; signature?: string; nonce?: string } =
      await req.json();

    if (!body.address || !body.signature || !body.nonce) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const { address, signature, nonce } = body;

    // Verify the message
    const message = `Please sign this nonce: ${nonce}`;
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Generate a Firebase custom token
    const customToken = await firebaseAdmin
      .auth()
      .createCustomToken(address.toLowerCase());

    return NextResponse.json({ token: customToken }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error processing request:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
