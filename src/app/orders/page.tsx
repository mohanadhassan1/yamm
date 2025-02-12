'use client'
import { useEffect, useState } from 'react';
import { Table } from '../components/Table';
import { RefundOrder, Decision } from '@/models';
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [orders, setOrders] = useState<RefundOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchOrders = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?page=${page}&per_page=5`);
      const data = await response.json();
      console.log('data', data);
      
      setOrders(data.orders);
      setTotalPages(Math.ceil(data.total / 5));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active: status }),
      });
      setOrders(orders.map(order => 
        order.id === id ? { ...order, active: status } : order
      ));
      toast({
        title: "Success",
        description: `Order status has been ${status ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDecisionChange = async (id: string, decision: Decision) => {
    try {
      await fetch(`/api/orders/${id}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({ decision }),
      });
      setOrders(orders.map(order => 
        order.id === id ? { ...order, decision } : order
      ));
      toast({
        title: "Success",
        description: `Order decision has been updated to ${decision}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update decision",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'reason', header: 'Reason' },
    { key: 'store_name', header: 'Store Name' },
    {
      key: 'store_logo',
      header: 'Logo',
      render: (row: RefundOrder) => (
        <img src={row.store_logo} alt={row.store_name} className="w-8 h-8 rounded-full" />
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: RefundOrder) => `$${row.amount.toFixed(2)}`,
    },
    {
      key: 'active',
      header: 'Active',
      render: (row: RefundOrder) => (
        <Switch
          checked={row.active}
          onCheckedChange={(checked) => handleStatusChange(row.id, checked)}
        />
      ),
    },
    {
      key: 'decision',
      header: 'Decision',
      render: (row: RefundOrder) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {row.decision || 'Not yet'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['accept', 'reject', 'escalate'].map((decision) => (
              <DropdownMenuItem
                key={decision}
                onClick={() => handleDecisionChange(row.id, decision as Decision)}
              >
                {decision}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (row: RefundOrder) => row.items.length,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: RefundOrder) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/orders/${row.id}`)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Refund Orders</h1>
      <Table
        data={orders}
        columns={columns}
        onStatusChange={handleStatusChange}
        onDecisionChange={handleDecisionChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}