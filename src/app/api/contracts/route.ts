import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/safe-auth';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const keys = await redis.keys(`contract:${userId}:*`);
    if (keys.length === 0) return NextResponse.json({ contracts: [] });

    const contracts = await redis.mget(...keys);
    return NextResponse.json({ contracts: contracts.filter(Boolean) });
  } catch (err) {
    console.error('Failed to fetch contracts', err);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const contract = await req.json();
    if (!contract.id) return NextResponse.json({ error: 'Missing contract ID' }, { status: 400 });

    await redis.set(`contract:${userId}:${contract.id}`, contract);
    return NextResponse.json({ success: true, contract });
  } catch (err) {
    console.error('Failed to create contract', err);
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 });
  }
}
