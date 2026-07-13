import { MODEL, generateObject } from '@/lib/ai';
import { hasAI, fallbackContract } from '@/lib/fallback';
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
  const body = await req.json();
  const { prompt, party1, party2, jurisdiction, category } = body;

  if (!hasAI()) {
    return NextResponse.json({ contract: fallbackContract(body), engine: 'standard' });
  }

  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: ContractSchema,
      prompt: `Generate a complete, legally sound ${category || 'contract'} contract for ${jurisdiction || 'the described location'}.
Details: ${prompt}
Parties: ${party1 || 'Party A'} and ${party2 || 'Party B'}
Make all clauses enforceable under ${jurisdiction || 'the local'} law.
Always include clauses: Contract Overview, Payment Terms (if financial), Default & Remedies, Dispute Resolution, Governing Law.
Use clear, professional language. Provide a summary, recommended steps, and any jurisdiction-specific legal warnings.`,
    });

    return NextResponse.json({ contract: object, engine: 'ai' });
  } catch (err) {
    console.error('Contract generation error, using standard clauses:', err);
    return NextResponse.json({ contract: fallbackContract(body), engine: 'standard' });
  }
}
