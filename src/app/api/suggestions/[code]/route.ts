import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  // Ensure we have the required environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // In Next.js 15, params can be a Promise
    const resolvedParams = await Promise.resolve(params);
    const stationCode = resolvedParams.code;
    console.log(`Searching for stations with query: ${stationCode}`);
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const code = stationCode.toUpperCase();

    // Search by both station_name and station_code
    const { data, error } = await supabase
      .from('Stations')
      .select('*')
      .or(`station_code.ilike.%${code}%,station_name.ilike.%${code}%`)
      .limit(10);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: `Database query error: ${error.message}` },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      console.log('No stations found matching the query');
      return NextResponse.json([]);
    }
   
    // Transform the results to rename the fields
    const transformedData = data.map(station => ({
      name: station.station_name,
      code: station.station_code
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions. Please try again.' },
      { status: 500 }
    );
  }
}

