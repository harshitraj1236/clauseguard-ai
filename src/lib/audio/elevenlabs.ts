/**
 * ElevenLabs Audio Synthesis for 45-Second Legal Risk Briefings
 */

export async function generateVoiceBriefing(text: string): Promise<string | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel voice

  if (!apiKey) {
    // Graceful fallback: return null so the UI uses browser SpeechSynthesis natively
    return null;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[ElevenLabs] Error generating audio: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = `data:audio/mpeg;base64,${buffer.toString("base64")}`;
    return base64Audio;
  } catch (error) {
    console.warn("[ElevenLabs] Failed to synthesize audio briefing:", error);
    return null;
  }
}
