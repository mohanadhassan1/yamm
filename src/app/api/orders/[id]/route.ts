import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/database/db.json');

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);
    
    const order = jsonData.orders.find((order: any) => order.id === params.id);
    
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