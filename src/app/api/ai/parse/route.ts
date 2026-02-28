import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { conversation, party1, party2, jurisdiction } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a legal expert specializing in extracting binding agreement terms from informal conversations (WhatsApp, SMS, voice notes, emails).

Analyze this conversation and extract all agreed-upon terms, then generate a formal contract structure.

CONVERSATION:
${conversation}

Additional context:
- Party 1 (creator): ${party1 || 'Person 1'}
- Party 2 (counterparty): ${party2 || 'Person 2'}
- Jurisdiction: ${jurisdiction || 'Not specified'}

Output ONLY valid JSON:
{
  "title": "string - descriptive agreement title",
  "category": "loan|sale|rental|service|nda|freelance|roommate|family|custom",
  "extractedTerms": {
    "amount": "string or null",
    "currency": "string - infer from context or 'USD'",
    "purpose": "string - what the money/item/service is for",
    "paymentSchedule": "string or null - frequency and amounts",
    "startDate": "string or null",
    "deadline": "string or null",
    "interestRate": "string - 0% if not mentioned",
    "specialConditions": ["array of any specific conditions mentioned"]
  },
  "confidence": "high|medium|low - how clearly were terms agreed upon",
  "missingInfo": ["list of important terms NOT mentioned that should be clarified"],
  "clauses": [
    {
      "title": "string",
      "content": "string - full clause based on extracted terms",
      "isRequired": true,
      "sourceQuote": "relevant quote from conversation that supports this clause"
    }
  ],
  "legalNote": "brief note on enforceability in ${jurisdiction || 'the jurisdiction'}"
}

Note: WhatsApp and messaging app agreements are legally binding in many jurisdictions when offer, acceptance, and consideration are clearly present. Extract all such elements.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Parse failed');

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ parsed });
  } catch (err) {
    console.error('Parse error:', err);
    return NextResponse.json({ error: 'Failed to parse conversation.' }, { status: 500 });
  }
}
