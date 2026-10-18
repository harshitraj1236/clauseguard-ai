import { NextRequest, NextResponse } from "next/server";
import { contractAuditor } from "@/lib/mastra/workflows/contract-auditor";
import { generateVoiceBriefing } from "@/lib/audio/elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractText } = body;

    if (!contractText || typeof contractText !== "string" || contractText.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide valid contract text of at least 20 characters." },
        { status: 400 }
      );
    }

    // Run Mastra + Gemma 2 audit workflow
    const result = await contractAuditor.execute(contractText);

    // Optional ElevenLabs audio generation
    const audioUrl = await generateVoiceBriefing(result.voiceBriefScript);
    if (audioUrl) {
      result.audioUrl = audioUrl;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Analyze API Error]:", error);
    return NextResponse.json(
      { error: "Failed to audit contract: " + (error as Error).message },
      { status: 500 }
    );
  }
}
