/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchCaptchaChallenge } from "@/lib/jobApi";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ ok: false, error: "user_id is required" }, { status: 400 });
    }

    const data = await fetchCaptchaChallenge(userId);
    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    console.error("CAPTCHA Error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}