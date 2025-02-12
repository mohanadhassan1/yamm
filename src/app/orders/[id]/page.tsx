'use client'

import { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import { RefundOrder } from '@/models';
import Loading from '@/app/loading'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<RefundOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/orders/${id}`)
        if (!response.ok) {
          throw new Error('Order not found')
        }
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, toast])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button onClick={() => router.push('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/orders')}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Image 
                  src={order.store_logo} 
                  alt={order.store_name} 
                  width={500}
                  height={500}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">{order.store_name}</p>
                  <Link
                    href={order.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">${order.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{order.active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Decision</p>
                  <p className="font-medium">{order.decision || 'Not yet'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="font-medium">{order.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div 
                  key={item.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <p className="font-medium">{item.name}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Quantity: {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right text-sm font-medium">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}