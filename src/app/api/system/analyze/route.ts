import { MODEL, generateObject } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F']),
  summary: z.string(),
  scores: z.object({
    clarity: z.number().min(0).max(100),
    enforceability: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
    fairness: z.number().min(0).max(100),
  }),
  redFlags: z.array(z.object({
    severity: z.enum(['high', 'medium', 'low']),
    title: z.string(),
    description: z.string(),
  })),
  missingClauses: z.array(z.string()),
  strengths: z.array(z.string()),
  recommendations: z.array(z.string()),
  contractType: z.string().optional(),
  parties: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { text, jurisdiction } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Contract text is required' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: MODEL,
      schema: AnalysisSchema,
      prompt: `Analyze the following contract or agreement text and provide a comprehensive assessment.
Jurisdiction context: ${jurisdiction || 'General / Not specified'}.

Contract text:
"""
${text.slice(0, 8000)}
"""

Evaluate:
1. Overall quality score (0-100) and letter grade
2. Detailed sub-scores for clarity, enforceability, completeness, and fairness
3. Red flags - issues that could cause problems (mark severity: high/medium/low)
4. Missing standard clauses that should be present
5. Strengths - what the contract does well
6. Specific actionable recommendations to improve it
7. Identify contract type and parties if possible

Be thorough but practical. Focus on real legal concerns and practical enforceability.`,
    });

    return NextResponse.json({ analysis: object });
  } catch (err) {
    console.error('Contract analysis error:', err);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
