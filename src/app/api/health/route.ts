import { NextResponse } from "next/server";
import { API_VERSION, API_VERSION_HEADER } from "@/lib/api/constants";

export async function GET() {
  return NextResponse.json(
    { ok: true, version: API_VERSION, service: "wonder-api" },
    { headers: { [API_VERSION_HEADER]: API_VERSION } },
  );
}
