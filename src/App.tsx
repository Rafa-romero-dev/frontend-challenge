import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CartModal from './components/CartModal'
import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import './App.css'


function App() {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <CartProvider>
      <div className="App">
        <Header onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  )
}

export default App