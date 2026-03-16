import { MODEL, generateObject } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ContractSchema = z.object({
  title: z.string(),
  type: z.string().optional(),
  summary: z.string().optional(),
  jurisdiction: z.string().optional(),
  governingLaw: z.string().optional(),
  parties: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      email: z.string().optional(),
    })
  ).optional(),
  clauses: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      legalBasis: z.string().optional(),
      isRequired: z.boolean().optional(),
    })
  ),
  legalWarnings: z.array(z.string()).optional(),
  recommendedSteps: z.array(z.string()).optional(),
  paymentTerms: z.string().optional(),
  duration: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, party1, party2, jurisdiction, category } = await req.json();

    const { object } = await generateObject({
      model: MODEL,
      schema: ContractSchema,
      prompt: `Generate a complete, legally sound ${category || 'agreement'} contract for ${jurisdiction || 'the described location'}.
Details: ${prompt}
Parties: ${party1 || 'Party A'} and ${party2 || 'Party B'}
Make all clauses enforceable under ${jurisdiction || 'the local'} law.
Always include clauses: Agreement Overview, Payment Terms (if financial), Default & Remedies, Dispute Resolution, Governing Law.
Use clear, professional language. Provide a summary, recommended steps, and any jurisdiction-specific legal warnings.`,
    });

    return NextResponse.json({ contract: object });
  } catch (err) {
    console.error('Contract generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate contract. Please try again.' },
      { status: 500 }
    );
  }
}
