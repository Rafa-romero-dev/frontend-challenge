import { useState } from "react";
import { ToastProvider } from "./components/ToastContext";
import "./components/ToastContext.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/Header";
import CartModal from "./components/CartModal";
import QuoteModal from "./components/QuoteModal";
import { CartProvider } from "./context/CartContext";
import { Product } from "./types/Product";

import "./App.css";
import "./pageTransitions.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const location = useLocation();

  const handleQuoteProduct = (product: Product) => {
    setQuoteProduct(product);
    setQuoteOpen(true);
  };

  return (
    <ToastProvider>
      <CartProvider>
        <div className="App">
          <Header onCartClick={() => setCartOpen(true)} />
          <CSSTransition
            in={cartOpen}
            timeout={250}
            classNames="modal-fade"
            unmountOnExit
          >
            <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          </CSSTransition>
          <CSSTransition
            in={quoteOpen}
            timeout={250}
            classNames="modal-fade"
            unmountOnExit
          >
            <QuoteModal
              isOpen={quoteOpen}
              onClose={() => setQuoteOpen(false)}
              product={quoteProduct}
            />
          </CSSTransition>
          <main>
            <SwitchTransition>
              <CSSTransition
                key={location.pathname}
                classNames="page-fade"
                timeout={350}
                unmountOnExit
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={
                      <ProductList onQuoteProduct={handleQuoteProduct} />
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <ProductDetail onQuoteProduct={handleQuoteProduct} />
                    }
                  />
                </Routes>
              </CSSTransition>
            </SwitchTransition>
          </main>
        </div>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
