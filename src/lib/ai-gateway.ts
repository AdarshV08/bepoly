// Minimal Lovable AI Gateway client using plain fetch (no SDK deps).
// Server-only: never import this from client code — it uses LOVABLE_API_KEY.

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function lovableChat(opts: {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": opts.apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: opts.model, messages: opts.messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(text || `AI gateway error ${res.status}`);
    // Preserve status for upstream handlers.
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}
