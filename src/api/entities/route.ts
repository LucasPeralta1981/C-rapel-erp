import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get('type');
  
  let where: any = { isActive: true };
  if (typeParam) {
    const types = typeParam.split(',');
    where.type = { in: types };
  }

  try {
    const entities = await prisma.entity.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(entities);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching entities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, cuil, email, phone, address, city } = body;

    if (!name || !email || !type) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    const entity = await prisma.entity.create({
      data: {
        name,
        type,
        cuil,
        email,
        phone,
        address,
        city: city || 'Tandil',
        isActive: true
      }
    });

    return NextResponse.json(entity);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear entidad' }, { status: 500 });
  }
}