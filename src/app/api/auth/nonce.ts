// list of allowed origins
const allowedOrigins = [
  "https://preview.construct.net",
  "http://localhost:3000",
];

// helper to get correct CORS origin
function getCorsOrigin(origin: string | null): string {
  return origin && allowedOrigins.includes(origin) ? origin : "";
}

// handle nonce requests
export async function GET(req: Request) {
  const origin = getCorsOrigin(req.headers.get("origin"));

  // generate and return a nonce
  const nonce = Math.floor(Math.random() * 1000000).toString();

  return new Response(JSON.stringify({ nonce }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
