import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import Excel from 'exceljs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    return NextResponse.json({ error: 'Worksheet not found' }, { status: 400 });
  }

  let count = 0;

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);

    const sku = String(row.getCell(1).value || '').trim();
    const name = String(row.getCell(2).value || '').trim();
    const cost = parseFloat(String(row.getCell(3).value) || '0');
    const price = parseFloat(String(row.getCell(4).value) || '0');
    const stock = parseInt(String(row.getCell(5).value) || '0');
    const category = String(row.getCell(6).value || 'General');
    const brand = String(row.getCell(7).value || 'Varias');

    if (!sku || !name) continue;

    await prisma.product.upsert({
      where: { sku },
      update: { name, costPrice: cost, salePrice: price, stock, category, brand },
      create: { sku, name, costPrice: cost, salePrice: price, stock, category, brand },
    });

    count++;
  }

  await new Promise(r => setTimeout(r, 500));
  return NextResponse.json({ message: 'Importación completada', count });
}