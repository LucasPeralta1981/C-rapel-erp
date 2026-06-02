// src/api/sales/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API de ventas funcionando' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'Venta creada', data: body });
}