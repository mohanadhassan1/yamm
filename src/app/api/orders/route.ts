import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/database/db.json');

export async function GET(req: Request) {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const per_page = Number(searchParams.get('per_page') || 5);

    const startIndex = (page - 1) * per_page;
    const endIndex = startIndex + per_page;

    const orders = jsonData.orders.slice(startIndex, endIndex);

    return NextResponse.json({ orders, total: jsonData.orders.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
