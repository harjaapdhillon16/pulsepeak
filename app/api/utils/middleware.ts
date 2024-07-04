import { NextRequest, NextResponse } from "next/server";
import NextCors from "nextjs-cors";

export async function corsMiddleware(req: NextRequest) {
  await NextCors(req as any, NextResponse.next() as any, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*", // replace this with your actual origin
    optionsSuccessStatus: 200,
  });
}
