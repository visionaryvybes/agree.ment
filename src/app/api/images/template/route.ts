import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const TEMPLATE_PROMPTS: Record<string, string> = {
  'tpl-conversation': 'A professional legal document showing a formal agreement letter with WhatsApp chat bubbles transforming into official contract text, dark elegant background, neon green accent, minimal design',
  'tpl-nda-formal': 'A confidential non-disclosure agreement document with a padlock seal and "CONFIDENTIAL" stamp, dark professional background, neon green accent, legal letterhead style',
  'tpl-car-sale': 'A vehicle bill of sale document with a car silhouette and dollar sign, professional legal document style, dark background, neon green accent',
  'tpl-social-media': 'A content creator agreement showing social media icons and camera, professional contract document, dark background with neon green glow accents',
  'tpl-wedding-vendor': 'An elegant event vendor contract with champagne glasses and calendar, dark background, sophisticated neon green accent, professional document style',
  'tpl-art-commission': 'An artist commission agreement showing a paintbrush and artwork frame, professional contract document, dark background, neon green accent',
  'tpl-loan-personal': 'A simple loan agreement document with a handshake and currency symbol, dark background, neon green accent, clean minimal design',
  'tpl-partnership-simple': 'A joint venture agreement showing two puzzle pieces coming together and a rocket, dark professional background, neon green accent',
  'tpl-house-sitting': 'A house sitting agreement document with a key and paw print, dark background, neon green accent, clean minimal style',
  'tpl-equipment-rental': 'An equipment rental agreement showing a camera and tools, professional legal document, dark background, neon green accent',
  'tpl-invoice-formal': 'A formal invoice document with billing columns and a checkmark seal, dark professional background, neon green accent',
  'tpl-legal-demand': 'A formal demand letter document with scales of justice and gavel, dark professional background, neon green accent, legal style',
  'tpl-tool-loan': 'A tool lending agreement document with wrench and drill icons, dark background, neon green accent, minimal design',
  'tpl-pet-care': 'A pet care agreement showing a dog paw and heart, professional document style, dark background, neon green accent',
  'tpl-freelance-help': 'A freelance work agreement document with pen and lightbulb, dark background, neon green accent, clean style',
  'tpl-borrow-gear': 'A borrowing agreement document with various tool icons, dark background, neon green accent',
  'tpl-ride-share': 'A road trip gas split agreement showing a car on a highway and dollar signs, dark background, neon green accent',
  'tpl-side-hustle': 'A side hustle partnership agreement with rocket and profit chart, dark background, neon green accent',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get('id');

  if (!templateId) {
    return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
  }

  const prompt = TEMPLATE_PROMPTS[templateId] ||
    'A professional legal contract document, dark elegant background, neon green accent color, minimal clean design';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' } as any);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Create a professional document preview thumbnail image: ${prompt}. Style: dark obsidian background (#010101), neon emerald green (#00FFD1) accents, minimal professional look, no text, abstract representation, 16:9 aspect ratio, high quality.` }] }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      } as any,
    });

    const parts = result.response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));

    if (imagePart?.inlineData) {
      const imageData = Buffer.from(imagePart.inlineData.data, 'base64');
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': imagePart.inlineData.mimeType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  } catch (err) {
    console.error('Template image gen error:', err);
    return NextResponse.json({ error: 'Image generation unavailable' }, { status: 500 });
  }
}
