/**
 * Products Dashboard Page
 * Lists products from the /api/products endpoint.
 */

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Package, Search, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  name: string
  sku?: string | null
  price: number
  inventory: number
  category?: string | null
  status: string
  currency?: string
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  OUT_OF_STOCK: 'destructive',
  DRAFT: 'outline',
}

async function fetchProducts(search: string): Promise<Product[]> {
  const res = await fetch(`/api/products?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`)
  if (!res.ok) throw new Error('Failed to load products')
  const json = await res.json()
  return json.data ?? []
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', search],
    queryFn: () => fetchProducts(search),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-africa-primary" />
            Catalog
          </CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="py-12 text-center text-destructive">Failed to load products.</p>
          ) : !data || data.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products yet. Add your first product to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Name</th>
                    <th className="py-3 pr-4 font-medium">SKU</th>
                    <th className="py-3 pr-4 font-medium">Category</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">Stock</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{p.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{p.sku || '—'}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{p.category || '—'}</td>
                      <td className="py-3 pr-4">{formatCurrency(p.price, p.currency || 'NGN')}</td>
                      <td className="py-3 pr-4">{p.inventory}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant[p.status] || 'secondary'}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
