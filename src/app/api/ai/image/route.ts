import { NextRequest, NextResponse } from 'next/server';

// Gemini image generation for contract visuals
// Uses gemini-2.0-flash-exp-image-generation (confirmed working model)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = 'gemini-2.0-flash-exp-image-generation';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { contractTitle, category, parties, jurisdiction, style = 'professional' } = await req.json();

    // Build a rich prompt for a professional contract visual
    const styleGuide: Record<string, string> = {
      professional: 'Clean, formal, corporate. Dark navy header, white body, serif fonts. Law firm aesthetic.',
      modern: 'Minimal, bold typography. Black and white. Contemporary editorial design.',
      warm: 'Warm cream background, ink-black text. Premium stationery feel. Subtle watermark.',
    };
    const selectedStyle = styleGuide[style as string] ?? styleGuide['professional'];

    const prompt = `A high-quality 4K resolution legal document visual for a "${contractTitle}" agreement.
Style: ${selectedStyle}
Category: ${category} contract
Parties: ${parties?.join(' and ') || 'two parties'}
Jurisdiction: ${jurisdiction || 'International'}

The image should show a beautifully designed legal contract document — not just text, but a visual representation:
- Elegant header section with the agreement title in bold serif typography
- Parties section with placeholder signature lines
- A structured body with numbered clauses visible
- Official-looking stamp or seal area
- ${jurisdiction ? `Subtle ${jurisdiction} legal motifs` : 'universal legal iconography'}
- No actual readable text in clause bodies — just visual structure
- Photorealistic, printable quality, 4K clarity
- No watermarks, no Lorem Ipsum visible`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini image API error:', err);
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }

    const data = await res.json();
    const imagePart = data?.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData?.data
    );

    if (!imagePart) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (err) {
    console.error('Image generation error:', err);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
