import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { PRODUCTS } from './data/products'

const Ctx = createContext()
export const useStore = () => useContext(Ctx)
export const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
export const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= 200 ? 0 : 12)

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS)
  const [cart, setCart] = useState(() => load('halden_cart', []))
  useEffect(() => { localStorage.setItem('halden_cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => {
    if (!supabase) return
    supabase.from('products').select('*').order('created_at').then(({ data }) => data?.length && setProducts(data))
  }, [])

  const add = (id, n = 1) => setCart((c) => c.find((i) => i.id === id) ? c.map((i) => i.id === id ? { ...i, qty: i.qty + n } : i) : [...c, { id, qty: n }])
  const setQty = (id, qty) => setCart((c) => qty < 1 ? c.filter((i) => i.id !== id) : c.map((i) => i.id === id ? { ...i, qty } : i))
  const lines = useMemo(() => cart.map((i) => ({ ...products.find((p) => p.id === i.id), qty: i.qty })).filter((l) => l.name), [cart, products])
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)

  const placeOrder = async (customer) => {
    const order = {
      id: 'HAL-' + Math.random().toString(36).slice(2, 8).toUpperCase(), customer,
      items: lines.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      total: subtotal + shippingFor(subtotal), payment: 'Cash on Delivery', status: 'Pending', created_at: new Date().toISOString(),
    }
    if (supabase) await supabase.from('orders').insert(order)
    localStorage.setItem('halden_orders', JSON.stringify([order, ...load('halden_orders', [])]))
    localStorage.setItem('halden_last', JSON.stringify(order))
    setCart([])
    return order
  }
  return <Ctx.Provider value={{ products, lines, add, setQty, subtotal, count, placeOrder }}>{children}</Ctx.Provider>
}
