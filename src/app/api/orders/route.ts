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
    const per_page = Number(searchParams.get('per_page') || 15);

    const startIndex = (page - 1) * per_page;
    const endIndex = startIndex + per_page;

    const orders = jsonData.orders.slice(startIndex, endIndex);

    return NextResponse.json({ orders, total: jsonData.orders.length });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { active, decision } = await req.json();

    const data = fs.readFileSync(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);

    const orderIndex = jsonData.orders.findIndex((order: any) => order.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (active !== undefined) {
      jsonData.orders[orderIndex].active = active;
    }

    if (decision !== undefined) {
      jsonData.orders[orderIndex].decision = decision;
    }

    fs.writeFileSync(dbPath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json(jsonData.orders[orderIndex]);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}