import { MODEL, streamText } from '@/lib/ai';
import { hasAI } from '@/lib/fallback';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages, jurisdiction } = await req.json();

  if (!hasAI()) {
    const canned = [
      "I can answer general questions once an AI engine is connected (set AI_API_KEY in the environment — any OpenAI-compatible provider works).",
      "Meanwhile, the rest of AgreeMint works fully: draft agreements from templates, sign them, track payments, and use Explain for a standard document check.",
      jurisdiction ? `You mentioned ${jurisdiction} — remember local formality rules (witnesses, notarization) can apply to high-value agreements.` : '',
      "⚠️ This is general information, not legal advice. Consult a qualified lawyer for your specific situation.",
    ].filter(Boolean).join('\n\n');
    return new Response(canned, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  try {
    const result = streamText({
      model: MODEL,
      system: `You are AgreeMint's AI Legal Advisor — a highly knowledgeable legal expert with deep knowledge of contract law, civil procedures, and legal frameworks.
User is in: ${jurisdiction || 'an unspecified location'}. Prioritize laws from this jurisdiction.
Provide general legal information about contracts and agreements.
Focus on contract clauses, terms, and document structure.
Keep responses concise and practical.
ALWAYS end your responses with: "⚠️ This is general information, not legal advice. Consult a qualified lawyer for your specific situation."`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
