import { MODEL, generateObject } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AgreementSchema = z.object({
  title: z.string(),
  category: z.string().optional(),
  extractedTerms: z.object({
    amount: z.string().nullable().optional(),
    currency: z.string().optional(),
    purpose: z.string().optional(),
    paymentSchedule: z.string().nullable().optional(),
    startDate: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    interestRate: z.string().optional(),
    specialConditions: z.array(z.string()).optional(),
  }).optional(),
  parties: z.array(z.string()).optional(),
  confidence: z.string(),
  missingInfo: z.array(z.string()),
  clauses: z.array(z.object({
    title: z.string(),
    content: z.string(),
    isRequired: z.boolean().optional(),
    sourceQuote: z.string().optional()
  })),
  legalNote: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { conversation, party1, party2, jurisdiction } = await req.json();

    const { object } = await generateObject({
      model: MODEL,
      schema: AgreementSchema,
      prompt: `Extract key agreement details from this conversation:
${conversation}

Context:
Party 1: ${party1 || 'Person 1'}
Party 2: ${party2 || 'Person 2'}
Jurisdiction: ${jurisdiction || 'Not specified'}

Set unclear fields to null. Clauses must include a title, full content, and the sourceQuote.`
    });

    return NextResponse.json({ parsed: object });
  } catch (err) {
    console.error('Parse error:', err);
    return NextResponse.json({ error: 'Failed to parse conversation.' }, { status: 500 });
  }
}
