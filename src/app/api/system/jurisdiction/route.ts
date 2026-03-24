import { MODEL, generateObject } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const JurisdictionSchema = z.object({
  country: z.string(),
  legalFramework: z.string(),
  enforceability: z.array(z.string()),
  keyArticles: z.array(z.string()),
  regionalInsight: z.string(),
  warning: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { country } = await req.json();

    if (!country) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    const { object } = await generateObject({
      model: MODEL,
      schema: JurisdictionSchema,
      prompt: `Provide real-time jurisdictional legal insights for ${country}. 
      Include the primary legal framework (Civil Law, Common Law, Sharia, etc.), 
      key points about contract enforceability, relevant statutory articles, 
      and a brief regional insight about the business legal environment.
      Focus on high-level accuracy for a premium legal library application.`,
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error('Jurisdiction insight error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch jurisdictional insights.' },
      { status: 500 }
    );
  }
}
