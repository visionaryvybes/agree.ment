import { MODEL, streamText, google } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, jurisdiction } = await req.json();

    const result = streamText({
      model: MODEL,
      system: `You are AgreeMint's AI Legal Advisor — a highly knowledgeable legal expert with deep knowledge of contract law, civil procedures, and legal frameworks.
User is in: ${jurisdiction || 'an unspecified location'}. Prioritize laws from this jurisdiction.
Provide general legal information about contracts and contracts.
Focus on contract clauses, terms, and document structure.
ALWAYS end your responses with: "⚠️ This is general information, not legal advice. Consult a qualified lawyer for your specific situation."`,
      messages,
      tools: {
        googleSearch: google.tools.googleSearch({}),
      },
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
