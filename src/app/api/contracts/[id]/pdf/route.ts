import { PDFDocument, rgb } from 'pdf-lib';
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const contract: any = await redis.get(`contract:${userId}:${params.id}`);
    if (!contract) return new NextResponse('Contract not found', { status: 404 });

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    let y = height - 50;
    
    // Draw Title
    page.drawText(contract.title, { x: 50, y, size: 20, color: rgb(0, 0, 0) });
    y -= 30;

    // Draw Parties
    contract.parties.forEach((p: any) => {
      page.drawText(`${p.role.toUpperCase()}: ${p.name}`, { x: 50, y, size: 12 });
      y -= 20;
    });

    y -= 20;
    // Draw Clauses
    contract.clauses.forEach((c: any, index: number) => {
      if (y < 100) { page = pdfDoc.addPage(); y = height - 50; }
      page.drawText(`${index + 1}. ${c.title}`, { x: 50, y, size: 14, color: rgb(0, 0, 0) });
      y -= 20;
      
      // Simple text wrapping for content (assuming ~90 chars per line)
      const words = c.content.split(' ');
      let line = '';
      for (const word of words) {
        if ((line + word).length > 90) {
          page.drawText(line, { x: 50, y, size: 10 });
          y -= 15;
          line = word + ' ';
        } else {
          line += word + ' ';
        }
      }
      if (line) {
        page.drawText(line, { x: 50, y, size: 10 });
        y -= 25;
      }
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${contract.title.replace(/\\s+/g, '_')}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF export error:', err);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
