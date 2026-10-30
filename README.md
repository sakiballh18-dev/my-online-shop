# Halden — React + Tailwind e-commerce

## Run locally
1. Install Node 18+.
2. `npm install`
3. `npm run dev` and open the printed URL.

It works immediately with built-in demo products. Orders and the cart are kept in your browser's localStorage.

## Connect Supabase (free tier)
1. Create a project at supabase.com. In the SQL editor, run:

```sql
create table products (id text primary key, name text, category text, price numeric, description text, image text, stock int default 0, created_at timestamptz default now());
create table orders (id text primary key, customer jsonb, items jsonb, total numeric, payment text, status text default 'Pending', created_at timestamptz default now());
alter table products enable row level security;
alter table orders enable row level security;
create policy "public read products" on products for select using (true);
create policy "public place orders" on orders for insert with check (true);
```
2. Copy `.env.example` to `.env` and fill in the project URL and anon key (Settings → API).
3. Add products in the Table Editor. When the table has rows, the storefront uses them instead of demo data.
4. Restart `npm run dev`.

## Before going live
- The `/admin` route has no login. Add Supabase Auth, restrict `/admin` to signed-in admins, and add an RLS policy so only admins can `select` and `update` orders.
- Replace the placeholder images (picsum.photos) with your own product photos.
- Deploy with `npm run build` to Netlify, Vercel or Cloudflare Pages. Add a rewrite of all paths to `/index.html` for React Router.
