import { NextResponse } from 'next/server';
    import getDb from '@/lib/mongodb';

    export async function GET() {
      try {
        const db = await getDb();
        const sales = await db.collection('ventas').find({}).toArray();
        return NextResponse.json(sales);
      } catch (error) {
        console.error('Error fetching sales:', error);
        return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
      }
    }

    export async function POST(request: Request) {
      try {
        const body = await request.json();
        const db = await getDb();
        const result = await db.collection('ventas').insertOne(body);
        return NextResponse.json({ id: result.insertedId }, { status: 201 });
      } catch (error) {
        console.error('Error saving sale:', error);
        return NextResponse.json({ error: 'Failed to save sale' }, { status: 500 });
      }
    }