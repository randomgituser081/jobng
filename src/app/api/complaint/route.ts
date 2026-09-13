/* eslint-disable @typescript-eslint/no-explicit-any */
import { submitComplaint } from "@/lib/jobApi";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // The external API handles validation, but we quickly ensure required fields are present
    if (!body.user_id || !body.complaint || !body.challenge_id || !body.captcha_answer) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await submitComplaint(body);

    return NextResponse.json({
      ok: true,
      message: "Complaint logged successfully",
      data,
    });
  } catch (error: any) {
    console.error("Complaint Submission Error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Network or server error." },
      { status: 500 }
    );
  }
}