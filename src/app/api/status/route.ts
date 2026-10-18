import { NextResponse } from "next/server";

export async function GET() {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.GEMMA_MODEL || "gemma2:2b";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${ollamaUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const hasModel = data.models?.some((m: { name: string }) => m.name.includes(model) || m.name.includes("gemma"));
      return NextResponse.json({
        online: true,
        provider: "Ollama (Local)",
        model: model,
        modelLoaded: hasModel ?? true,
        host: "localhost:11434",
      });
    }
  } catch (err) {
    // Ollama not reachable
  }

  // Fallback status
  return NextResponse.json({
    online: false,
    provider: "Benchmark Rule Engine",
    model: "gemma-2-fallback",
    host: "local",
  });
}
