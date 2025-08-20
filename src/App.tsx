import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/Header";
import CartModal from "./components/CartModal";
import QuoteModal from "./components/QuoteModal";
import { CartProvider } from "./context/CartContext";
import { Product } from "./types/Product";

import "./App.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  const handleQuoteProduct = (product: Product) => {
    setQuoteProduct(product);
    setQuoteOpen(true);
  };

  return (
    <CartProvider>
      <div className="App">
        <Header onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <QuoteModal
          isOpen={quoteOpen}
          onClose={() => setQuoteOpen(false)}
          product={quoteProduct}
        />
        <main>
          <Routes>
            <Route
              path="/"
              element={<ProductList onQuoteProduct={handleQuoteProduct} />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetail onQuoteProduct={handleQuoteProduct} />}
            />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
