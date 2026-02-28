import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { prompt, party1, party2, jurisdiction, category } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a legal contract drafting expert. Generate a complete, legally-sound contract based on the user's description. Output ONLY valid JSON matching this schema:

{
  "title": "string",
  "category": "loan|sale|rental|service|nda|freelance|roommate|family|custom",
  "summary": "1-2 sentence plain-language summary",
  "governingLaw": "applicable law and jurisdiction",
  "clauses": [
    {
      "title": "string",
      "content": "string (full clause text, 2-4 sentences)",
      "isRequired": boolean,
      "legalBasis": "optional - cite specific law/act"
    }
  ],
  "keyTerms": {
    "amount": "string or null",
    "currency": "string",
    "startDate": "string or null",
    "endDate": "string or null",
    "paymentFrequency": "string or null",
    "interestRate": "string or null"
  },
  "legalWarnings": ["array of jurisdiction-specific warnings"],
  "recommendedSteps": ["array of next steps for both parties"]
}

Rules:
- Always include clauses: Agreement Overview, Payment Terms (if financial), Default & Remedies, Dispute Resolution, Governing Law, Entire Agreement, Amendments, Severability
- Make clauses jurisdiction-specific for: ${jurisdiction || 'the described location'}
- Use clear, plain language that is also legally precise
- For ${jurisdiction || 'the jurisdiction'}: cite the relevant Contract Act / Civil Code
- Include at minimum 6 clauses, up to 12 for complex agreements
- Party A (Creator): ${party1 || 'Party A'}
- Party B (Counterparty): ${party2 || 'Party B'}
- Category hint: ${category || 'infer from description'}`;

    const result = await model.generateContent([
      systemPrompt,
      `Agreement description: ${prompt}`,
    ]);

    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse contract structure');
    }

    const contract = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ contract });
  } catch (err) {
    console.error('Contract generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate contract. Please try again.' },
      { status: 500 }
    );
  }
}
