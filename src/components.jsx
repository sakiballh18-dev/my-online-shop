import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from './store'

export const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function Navbar() {
  const { count } = useStore()
  const [open, setOpen] = useState(false)
  const links = [['/shop', 'All'], ['/shop?c=Home', 'Home'], ['/shop?c=Carry', 'Carry'], ['/shop?c=Light', 'Light'], ['/shop?c=Textiles', 'Textiles']]
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link to="/" className="font-display text-3xl tracking-tight">Halden</Link>
        <nav className="hidden gap-9 text-sm md:flex">
          {links.map(([to, label]) => <NavLink key={label} to={to} className="text-ink/70 transition hover:text-ink">{label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/cart" className="flex items-center gap-2">Bag <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs text-porcelain">{count}</span></Link>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && <nav className="flex flex-col gap-4 border-t border-ink/10 px-5 py-6 md:hidden">
        {links.map(([to, label]) => <Link key={label} to={to} onClick={() => setOpen(false)} className="font-display text-2xl">{label}</Link>)}
      </nav>}
    </header>
  )
}

export function ProductCard({ p }) {
  const { add } = useStore()
  return (
    <article className="group relative">
      <Link to={`/product/${p.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-mist">
          <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl leading-tight">{p.name}</h3>
          <span className="text-sm">{money(p.price)}</span>
        </div>
        <p className="mt-1 text-sm text-ink/55">{p.category}</p>
      </Link>
      <button onClick={() => add(p.id)} className="absolute inset-x-3 top-[calc(100%-6.5rem)] hidden bg-porcelain/95 py-3 text-sm opacity-0 backdrop-blur transition hover:bg-ink hover:text-porcelain focus:opacity-100 md:block md:group-hover:opacity-100">Add to bag</button>
      <button onClick={() => add(p.id)} className="mt-3 w-full border border-ink/20 py-2.5 text-sm md:hidden">Add to bag</button>
    </article>
  )
}

export function Qty({ value, onChange }) {
  return (
    <div className="inline-flex items-center border border-ink/20">
      <button aria-label="Decrease" className="h-10 w-10 text-lg" onClick={() => onChange(value - 1)}>−</button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button aria-label="Increase" className="h-10 w-10 text-lg" onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-ink/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 md:flex-row md:justify-between md:px-10">
        <div><p className="font-display text-3xl">Halden</p><p className="mt-2 max-w-xs text-sm text-ink/60">Ceramics, textiles and light from independent workshops.</p></div>
        <div className="flex gap-14 text-sm text-ink/70">
          <div className="flex flex-col gap-2"><Link to="/shop">Shop</Link><Link to="/cart">Bag</Link><Link to="/admin">Admin</Link></div>
          <div className="flex flex-col gap-2"><span>Shipping &amp; returns</span><span>Care guides</span><span>Contact</span></div>
        </div>
      </div>
    </footer>
  )
}
