import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/safe-auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contract = await redis.get(`contract:${userId}:${id}`);
    if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ contract });
  } catch (err) {
      console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    const existing = await redis.get(`contract:${userId}:${id}`);
    
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = { ...(existing as object), ...updates, updatedAt: new Date() };
    await redis.set(`contract:${userId}:${id}`, updated);

    return NextResponse.json({ success: true, contract: updated });
  } catch (err) {
      console.error('Update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await redis.del(`contract:${userId}:${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
      console.error('Delete error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
