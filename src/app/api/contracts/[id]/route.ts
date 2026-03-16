import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contract = await redis.get(`contract:${userId}:${params.id}`);
    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ contract });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    const existing = await redis.get(`contract:${userId}:${params.id}`);
    
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = { ...(existing as object), ...updates, updatedAt: new Date() };
    await redis.set(`contract:${userId}:${params.id}`, updated);

    return NextResponse.json({ success: true, contract: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await redis.del(`contract:${userId}:${params.id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
