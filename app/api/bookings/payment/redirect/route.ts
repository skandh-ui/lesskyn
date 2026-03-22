import { NextResponse } from "next/server";

// PayU POSTs to surl/furl - we convert it to a GET redirect so session cookies work
export async function POST(req: Request) {
  const text = await req.text();
  const params: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(text)) {
    params[k] = v;
  }

  const { txnid, status } = params;
  const base = process.env.FRONTEND_URL!;

  if (status === "success" && txnid) {
    return NextResponse.redirect(`${base}/booking/success?bookingId=${txnid}`, 303);
  }

  return NextResponse.redirect(`${base}/booking/failed`, 303);
}
