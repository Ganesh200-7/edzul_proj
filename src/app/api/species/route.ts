import { NextRequest, NextResponse } from 'next/server';
import { searchWildlife } from '@/services/wildlifeService';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const country = searchParams.get('country') || undefined;
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
      country,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred while querying GBIF biodiversity data.';
    return NextResponse.json(
      {
        error: message,
        query: q,
        canFallback: true,
      },
      { status: 502 }
    );
  }
}
