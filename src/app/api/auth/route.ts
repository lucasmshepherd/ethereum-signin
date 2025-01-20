import { verifyMessage } from "ethers";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

// List of allowed origins
const allowedOrigins = [
  "https://preview.construct.net",
  "http://localhost:3000",
];

// Helper to check and set the correct CORS origin
function getCorsOrigin(origin: string | null): string {
  return origin && allowedOrigins.includes(origin) ? origin : "";
}

// Handle preflight requests
export async function OPTIONS(req: Request) {
  const origin = getCorsOrigin(req.headers.get("origin"));
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// POST method for App Directory
export async function POST(req: Request) {
  try {
    const origin = getCorsOrigin(req.headers.get("origin"));

    // Parse the request body
    const body = await req.json();
    const { address, signature, nonce } = body;

    // Validate the request body
    if (!address || !signature || !nonce) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }

    // Verify the signature
    const message = `Please sign this nonce: ${nonce}`;
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": origin,
        },
      });
    }

    // Generate a Firebase custom token
    const customToken = await firebaseAdmin
      .auth()
      .createCustomToken(address.toLowerCase());

    // Return the custom token
    return new Response(JSON.stringify({ token: customToken }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Safe fallback for unknown errors
      },
    });
  }
}
