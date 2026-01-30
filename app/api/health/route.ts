//check health of the api
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json(
        { status: "OK", message: "API is healthy from nextjs" },
        { status: 200 }
    );
}