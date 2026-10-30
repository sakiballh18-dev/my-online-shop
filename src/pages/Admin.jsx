import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useStore, load } from '../store'
import { money } from '../components'

const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled']

// UI only: protect this route with Supabase Auth before going live (see README).
export default function Admin() {
  const { products } = useStore()
  const [orders, setOrders] = useState(() => load('halden_orders', []))
  useEffect(() => {
    if (supabase) supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => data && setOrders(data))
  }, [])
  const setStatus = (id, status) => setOrders((os) => os.map((o) => o.id === id ? { ...o, status } : o))
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
  const stats = [['Orders', orders.length], ['Revenue', money(revenue)], ['Pending', orders.filter((o) => o.status === 'Pending').length], ['Low stock', products.filter((p) => p.stock < 5).length]]
  const th = (hs) => <thead className="border-b border-ink/20 text-ink/55"><tr>{hs.map((h) => <th key={h} className="py-3 font-normal">{h}</th>)}</tr></thead>
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 md:px-10">
      <h1 className="font-display text-6xl">Dashboard</h1>
      <div className="mt-10 grid grid-cols-2 gap-px bg-ink/10 md:grid-cols-4">
        {stats.map(([k, v]) => <div key={k} className="bg-porcelain p-6"><p className="text-sm text-ink/55">{k}</p><p className="mt-2 font-display text-4xl">{v}</p></div>)}
      </div>
      <h2 className="mt-16 font-display text-3xl">Orders</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          {th(['Order', 'Customer', 'Total', 'Payment', 'Status'])}
          <tbody>
            {orders.length === 0 && <tr><td colSpan="5" className="py-10 text-ink/55">No orders yet. Place one from the storefront and it will show here.</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink/10">
                <td className="py-4 font-medium">{o.id}</td><td>{o.customer?.name}</td><td>{money(o.total)}</td><td>{o.payment}</td>
                <td><select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="border border-ink/20 bg-transparent px-2 py-1">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mt-16 font-display text-3xl">Inventory</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          {th(['Product', 'Category', 'Price', 'Stock'])}
          <tbody>{products.map((p) => <tr key={p.id} className="border-b border-ink/10"><td className="py-4">{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td className={p.stock < 5 ? 'text-brass' : ''}>{p.stock}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
