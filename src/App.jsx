import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Navbar, Footer } from './components'
import { Home, Shop, ProductPage } from './pages/Store'
import { Cart, Checkout, Confirmation } from './pages/Checkout'
import Admin from './pages/Admin'

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return <><Navbar /><main><Outlet /></main><Footer /></>
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
