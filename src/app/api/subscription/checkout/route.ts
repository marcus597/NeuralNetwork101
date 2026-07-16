import { NextResponse } from "next/server";
import { API_VERSION, API_VERSION_HEADER } from "@/lib/api/constants";
import { forbidden } from "@/lib/api/errors";

/** Paid checkout is not offered at launch — Wonder is free. */
export async function POST() {
  const err = forbidden("Wonder is free during launch. Paid plans are not available yet.");
  return NextResponse.json(err.toJSON(), {
    status: 403,
    headers: { [API_VERSION_HEADER]: API_VERSION },
  });
}
