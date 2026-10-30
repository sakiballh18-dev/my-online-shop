import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore, load, shippingFor } from '../store'
import { Qty, money } from '../components'

function Summary({ children }) {
  const { lines, subtotal } = useStore()
  const ship = shippingFor(subtotal)
  return (
    <aside className="h-fit bg-mist/60 p-8">
      <h2 className="font-display text-3xl">Summary</h2>
      <ul className="mt-6 space-y-3 text-sm">{lines.map((l) => <li key={l.id} className="flex justify-between"><span>{l.name} × {l.qty}</span><span>{money(l.price * l.qty)}</span></li>)}</ul>
      <dl className="mt-6 space-y-2 border-t border-ink/15 pt-6 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Shipping</dt><dd>{ship ? money(ship) : 'Free'}</dd></div>
        <div className="flex justify-between pt-2 text-lg"><dt>Total</dt><dd>{money(subtotal + ship)}</dd></div>
      </dl>
      {children}
    </aside>
  )
}

export function Cart() {
  const { lines, setQty } = useStore()
  if (!lines.length) return <div className="py-40 text-center"><h1 className="font-display text-5xl">Your bag is empty</h1><Link to="/shop" className="btn mt-8">Browse the collection</Link></div>
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-5 pt-14 md:grid-cols-[1fr_380px] md:px-10">
      <div>
        <h1 className="font-display text-6xl">Your bag</h1>
        <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-5 py-6">
              <img src={l.image} alt="" className="h-28 w-24 bg-mist object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4"><Link to={`/product/${l.id}`} className="font-display text-2xl leading-tight">{l.name}</Link><span>{money(l.price * l.qty)}</span></div>
                <div className="flex items-center justify-between"><Qty value={l.qty} onChange={(n) => setQty(l.id, n)} /><button onClick={() => setQty(l.id, 0)} className="text-sm underline underline-offset-4">Remove</button></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Summary><Link to="/checkout" className="btn mt-8 w-full">Continue to checkout</Link></Summary>
    </div>
  )
}

const F = ({ name, label, type = 'text', span }) => (
  <label className={`block text-sm text-ink/60 ${span ? 'sm:col-span-2' : ''}`}>{label}<input required={name !== 'notes'} name={name} type={type} className="field text-base text-ink" /></label>
)

export function Checkout() {
  const { lines, placeOrder } = useStore()
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  if (!lines.length && !busy) return <Navigate to="/cart" replace />
  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    await placeOrder(Object.fromEntries(new FormData(e.target)))
    nav('/confirmation')
  }
  return (
    <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-16 px-5 pt-14 md:grid-cols-[1fr_380px] md:px-10">
      <div>
        <h1 className="font-display text-6xl">Checkout</h1>
        <h2 className="mt-12 font-display text-3xl">Your details</h2>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <F name="name" label="Full name" span /><F name="email" label="Email" type="email" /><F name="phone" label="Phone" type="tel" />
          <F name="address" label="Delivery address" span /><F name="city" label="City" /><F name="postcode" label="Postcode" />
          <F name="notes" label="Delivery notes (optional)" span />
        </div>
        <h2 className="mt-14 font-display text-3xl">Payment</h2>
        <label className="mt-6 flex items-start gap-4 border border-ink p-5">
          <input type="radio" checked readOnly className="mt-1 accent-ink" />
          <span><span className="block font-medium">Cash on delivery</span><span className="text-sm text-ink/60">Pay the courier in cash when your order arrives.</span></span>
        </label>
      </div>
      <Summary><button disabled={busy} className="btn mt-8 w-full disabled:opacity-50">{busy ? 'Placing order' : 'Place order'}</button></Summary>
    </form>
  )
}

export function Confirmation() {
  const o = load('halden_last', null)
  if (!o) return <Navigate to="/" replace />
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="rise font-display text-6xl">Thank you, {o.customer.name.split(' ')[0]}.</h1>
      <p className="mt-6 text-ink/65">Order <b className="text-ink">{o.id}</b> is confirmed. We’ll send details to {o.customer.email}. Have {money(o.total)} ready in cash on delivery.</p>
      <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-left text-sm">{o.items.map((i) => <li key={i.id} className="flex justify-between py-3"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
      <Link to="/shop" className="btn mt-10">Continue shopping</Link>
    </div>
  )
}
