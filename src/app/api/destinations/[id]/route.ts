import { NextResponse } from 'next/server';
import { connectDb } from '@/src/app/lib/db/conn';
import { Destination } from '@/src/app/lib/types';
import { updateDestination } from '@/src/app/lib/db/destinations';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    
    const data = await request.json();
    const destinationId = params.id;

    // Validate required fields
    if (!data.country || !data.start_date || !data.end_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a clean destination object
    const destination: Partial<Destination> = {
      country: data.country,
      city: data.city || '',
      region: data.region || '',
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      accommodation: {
        name: data.accommodation.name,
        type: data.accommodation.type,
        address: data.accommodation.address,
        total_cost: Number(data.accommodation.cost),
        currency: data.accommodation.currency
      }
    };

    const result = await updateDestination(destinationId, destination);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update destination' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error updating destination:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 