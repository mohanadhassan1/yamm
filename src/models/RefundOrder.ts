import { Decision } from "./Decision";
import { OrderItem } from "./OrderItem";

export interface RefundOrder {
  id: string;
  reason: string;
  store_name: string;
  store_logo: string;
  store_url: string;
  amount: number;
  active: boolean;
  decision: Decision | null;
  items: OrderItem[];
}