import { MODEL, generateObject } from '@/lib/ai';
import { hasAI } from '@/lib/fallback';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const HealthSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F']),
  breakdown: z.object({
    clarity: z.number().min(0).max(100),
    enforceability: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
  }),
  topIssue: z.string().optional(),
  recommendation: z.string(),
});

export async function POST(req: NextRequest) {
  const { contract } = await req.json();

  if (!hasAI()) {
    const n = contract?.clauses?.length || 0;
    const hasParties = (contract?.parties?.length || 0) >= 2;
    const hasAmount = Boolean(contract?.totalAmount);
    const hasLaw = Boolean(contract?.governingLaw || contract?.jurisdiction);
    const completeness = Math.min(100, n * 12 + (hasParties ? 16 : 0) + (hasLaw ? 12 : 0));
    const clarity = n > 0 ? 78 : 40;
    const enforceability = Math.min(95, completeness - 5 + (hasLaw ? 10 : 0));
    const score = Math.round((completeness + clarity + Math.max(0, enforceability)) / 3);
    const grade = score >= 88 ? 'A' : score >= 78 ? 'B+' : score >= 68 ? 'B' : score >= 55 ? 'C+' : score >= 45 ? 'C' : 'D';
    return NextResponse.json({
      health: {
        score, grade,
        breakdown: { clarity, enforceability: Math.max(0, enforceability), completeness },
        topIssue: !hasParties ? 'Both parties should be named.' : !hasAmount ? 'No amount is stated — add exact figures.' : n < 5 ? 'Consider adding termination and dispute clauses.' : undefined,
        recommendation: 'Fill in exact amounts and dates, then have both parties sign. Connect an AI engine for a clause-by-clause review.',
      },
      engine: 'standard',
    });
  }

  try {
    const clauseList = (contract.clauses || [])
      .map((c: any) => `- ${c.title}: ${c.content?.slice(0, 200)}`)
      .join('\n');

    const { object } = await generateObject({
      model: MODEL,
      schema: HealthSchema,
      prompt: `Rate the health and enforceability of this agreement:

Title: ${contract.title}
Category: ${contract.category}
Jurisdiction: ${contract.jurisdiction || 'General'}
Parties: ${(contract.parties || []).map((p: any) => p.name).join(', ')}
Value: ${contract.totalAmount ? `$${contract.totalAmount}` : 'Not specified'}
Status: ${contract.status}
Clauses (${contract.clauses?.length || 0}):
${clauseList || 'No clauses defined'}

Provide:
1. Overall health score (0-100)
2. Letter grade
3. Sub-scores for clarity, enforceability, completeness (each 0-100)
4. The single most important issue to fix (if any)
5. One concrete recommendation to improve this contract

Be brief and practical.`,
    });

    return NextResponse.json({ health: object });
  } catch (err) {
    console.error('Health score error:', err);
    return NextResponse.json(
      { error: 'Health check failed.' },
      { status: 500 }
    );
  }
}
