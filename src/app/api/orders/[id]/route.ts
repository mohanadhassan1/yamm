import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { RefundOrder } from '@/models';

const dbPath = path.join(process.cwd(), 'src/database/db.json');

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const data = fs.readFileSync(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);
    
    const order = jsonData.orders.find((order: RefundOrder) => order.id === id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to load order' },
      { status: 500 }
    );
  }
}