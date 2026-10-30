import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useStore } from '../store'
import { CATEGORIES } from '../data/products'
import { ProductCard, Qty, money } from '../components'

export function Home() {
  const { products } = useStore()
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-end gap-12 px-5 pb-20 pt-12 md:grid-cols-12 md:px-10 md:pt-20">
        <div className="md:col-span-7">
          <h1 className="rise font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-[8.5rem]">Objects made slowly, kept for decades.</h1>
          <p className="rise mt-8 max-w-md text-lg text-ink/65" style={{ animationDelay: '.25s' }}>Ceramics, textiles and light from independent workshops. Pay on delivery, wherever we ship.</p>
          <div className="rise mt-10 flex gap-4" style={{ animationDelay: '.4s' }}>
            <Link to="/shop" className="btn">Shop the collection</Link>
            <Link to="/shop?c=Light" className="btn btn-line">Browse lighting</Link>
          </div>
        </div>
        <div className="rise md:col-span-5" style={{ animationDelay: '.15s' }}>
          <img src="https://picsum.photos/seed/halden-hero/1000/1250" alt="Styled interior with stoneware and linen" className="aspect-[4/5] w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-10 flex items-end justify-between"><h2 className="font-display text-4xl md:text-5xl">New this season</h2><Link to="/shop" className="text-sm underline underline-offset-4">View all</Link></div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="mx-auto mt-32 grid max-w-7xl gap-px bg-ink/10 px-5 md:grid-cols-4 md:px-10">
        {CATEGORIES.map((c) => {
          const p = products.find((x) => x.category === c)
          return (
            <Link key={c} to={`/shop?c=${c}`} className="group relative aspect-[3/4] overflow-hidden bg-mist">
              {p && <img src={p.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 font-display text-3xl text-porcelain">{c}</span>
            </Link>
          )
        })}
      </section>

      <section className="mx-auto mt-32 grid max-w-7xl gap-12 px-5 md:grid-cols-3 md:px-10">
        {[['Made in small batches', 'Every piece comes from a named workshop, in runs of fewer than a hundred.'], ['Free shipping over $200', 'Orders under $200 ship for a flat $12.'], ['Pay when it arrives', 'Cash on delivery on every order. No card needed.']].map(([t, d]) => (
          <div key={t} className="border-t border-ink/20 pt-6"><h3 className="font-display text-2xl">{t}</h3><p className="mt-3 text-ink/60">{d}</p></div>
        ))}
      </section>
    </>
  )
}

export function Shop() {
  const { products } = useStore()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const cat = params.get('c') || 'All'
  const list = products.filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 md:px-10">
      <h1 className="font-display text-6xl">{cat === 'All' ? 'The collection' : cat}</h1>
      <div className="mt-10 flex flex-col gap-6 border-y border-ink/10 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setParams(c === 'All' ? {} : { c })} className={`px-4 py-2 text-sm transition ${cat === c ? 'bg-ink text-porcelain' : 'border border-ink/20 hover:border-ink'}`}>{c}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className="field md:max-w-xs" />
      </div>
      {list.length ? (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <p className="py-24 text-center text-ink/60">Nothing matches “{q}”. Try a different word or <button className="underline" onClick={() => { setQ(''); setParams({}) }}>clear filters</button>.</p>
      )}
    </div>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const { products, add } = useStore()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const p = products.find((x) => x.id === id)
  if (!p) return <p className="py-40 text-center">Product not found. <Link to="/shop" className="underline">Back to shop</Link></p>
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 md:px-10">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <img src={p.image} alt={p.name} className="aspect-[4/5] w-full bg-mist object-cover" />
        <div className="md:sticky md:top-28 md:self-start">
          <Link to={`/shop?c=${p.category}`} className="text-sm text-ink/55 underline underline-offset-4">{p.category}</Link>
          <h1 className="mt-3 font-display text-5xl leading-none md:text-6xl">{p.name}</h1>
          <p className="mt-5 text-2xl">{money(p.price)}</p>
          <p className="mt-8 max-w-md leading-relaxed text-ink/70">{p.description}</p>
          <p className={`mt-6 text-sm ${p.stock < 5 ? 'text-brass' : 'text-ink/55'}`}>{p.stock < 5 ? `Only ${p.stock} left` : 'In stock'}</p>
          <div className="mt-8 flex gap-4">
            <Qty value={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <button className="btn flex-1" onClick={() => { add(p.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1800) }}>{added ? 'Added to bag' : 'Add to bag'}</button>
          </div>
          <p className="mt-6 text-sm text-ink/55">Pay on delivery. Free shipping over $200.</p>
        </div>
      </div>
      {related.length > 0 && <section className="mt-28"><h2 className="mb-10 font-display text-4xl">More in {p.category}</h2><div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </div>
  )
}
