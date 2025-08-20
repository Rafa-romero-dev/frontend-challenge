import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { useToast } from '../components/ToastContext';
import { CartItem, Product } from '../types/Product'
import { products } from '../data/products'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity: number, options: { color?: string, size?: string }) => void
  updateQuantity: (item: CartItem, quantity: number) => void
  removeFromCart: (item: CartItem) => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product, quantity: number, options: { color?: string, size?: string }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id &&
        item.selectedColor === options.color &&
        item.selectedSize === options.size
      )
      // Get latest stock from products array
      const latest = products.find(p => p.id === product.id)
      const stock = latest ? latest.stock : product.stock
      let newQty = quantity
      if (existingItem) {
        if (existingItem.quantity >= stock) {
          showToast('Ya tienes el máximo disponible de este producto en el carrito.', 'error');
          return prevItems;
        }
        if (existingItem.quantity + quantity > stock) {
          showToast('No hay suficiente stock para agregar esa cantidad.', 'error');
        }
        newQty = Math.min(stock, existingItem.quantity + quantity)
        return prevItems.map(item =>
          item.id === product.id &&
          item.selectedColor === options.color &&
          item.selectedSize === options.size
            ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
            : item
        )
      } else {
        if (quantity > stock) {
          showToast('No hay suficiente stock para agregar esa cantidad.', 'error');
        }
        newQty = Math.min(stock, quantity)
        const newItem: CartItem = {
          ...product,
          quantity: newQty,
          selectedColor: options.color,
          selectedSize: options.size,
          unitPrice: product.basePrice, // Simplified, could use price breaks
          totalPrice: product.basePrice * newQty,
        }
        return [...prevItems, newItem]
      }
    })
  }

  const updateQuantity = (item: CartItem, quantity: number) => {
    // Get latest stock from products array
    const latest = products.find(p => p.id === item.id)
    const stock = latest ? latest.stock : item.stock
    if (quantity > stock) {
      showToast('No hay suficiente stock para esa cantidad.', 'error');
    }
    const clamped = Math.max(1, Math.min(stock, quantity))
    setCartItems(prevItems => prevItems.map(ci =>
      ci.id === item.id && ci.selectedColor === item.selectedColor && ci.selectedSize === item.selectedSize
        ? { ...ci, quantity: clamped, totalPrice: ci.unitPrice * clamped }
        : ci
    ))
  }

  const removeFromCart = (item: CartItem) => {
    setCartItems(prevItems => prevItems.filter(ci =>
      !(ci.id === item.id && ci.selectedColor === item.selectedColor && ci.selectedSize === item.selectedSize)
    ))
  }

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
