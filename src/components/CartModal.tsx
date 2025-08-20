import React from 'react';
import { useToast } from '../components/ToastContext';
import { useCart } from '../context/CartContext';
import { formatToCLP } from '../utils/currency';
  import type { CartItem } from '../types/Product';
import './CartModal.css';
import { products } from '../data/products';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {

  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Get latest stock for a cart item (by id, color, size)
  const getStockForItem = (item: CartItem) => {
    // Here we would call the BE
  const product = products.find((p) => p.id === item.id);
    return product ? product.stock : item.stock;
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Carrito de Compras</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        {cartItems.length === 0 ? (
          <div className="cart-empty">Tu carrito está vacío.</div>
        ) : (
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id + (item.selectedColor || '') + (item.selectedSize || '')}>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-details">
                    <span>SKU: {item.sku}</span>
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
                  </div>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>
                    <span className="material-icons">remove</span>
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => {
                      const val = parseInt(e.target.value)
                      updateQuantity(item, isNaN(val) ? 1 : Math.max(1, val))
                    }}
                    className="cart-qty-input"
                  />
                  <button
                    className="qty-btn"
                    onClick={() => {
                      if (item.quantity >= getStockForItem(item)) {
                        showToast('No hay suficiente stock para agregar más unidades.', 'error');
                        return;
                      }
                      updateQuantity(item, item.quantity + 1);
                    }}
                    disabled={item.quantity >= getStockForItem(item)}
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
                <div className="cart-item-price">{formatToCLP(item.unitPrice)}</div>
                <div className="cart-item-subtotal">{formatToCLP(item.totalPrice)}</div>
                <button className="remove-btn" onClick={() => removeFromCart(item)} title="Eliminar">
                  <span className="material-icons">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="cart-modal-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{formatToCLP(total)}</span>
          </div>
          <button className="btn btn-primary cta1" onClick={() => { alert('¡Gracias por tu compra! (Checkout simulado)'); onClose(); }} disabled={cartItems.length === 0}>
            Ir a checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
