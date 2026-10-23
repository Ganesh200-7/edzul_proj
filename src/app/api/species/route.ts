import { NextRequest, NextResponse } from 'next/server';
import { searchWildlife, getSampleWildlife } from '@/services/wildlifeService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const iconicTaxon = searchParams.get('iconicTaxon') || 'All';
  const forceFallback = searchParams.get('fallback') === '1' || searchParams.get('fallback') === 'true';

  if (!q.trim()) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required.' },
      { status: 400 }
    );
  }

  try {
    const data = await searchWildlife(q, {
      forceFallback,
      iconicTaxon,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred while fetching wildlife data.',
        query: q,
        canFallback: true,
      },
      { status: 502 }
    );
  }
}
