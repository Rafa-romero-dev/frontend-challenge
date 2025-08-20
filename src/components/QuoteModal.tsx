import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useCart } from "../context/CartContext";
import type { Product, CartItem } from "../types/Product";
import "./QuoteModal.css";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { cartItems } = useCart();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [quoteItems, setQuoteItems] = useState<CartItem[]>([]);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setCompany("");
      setEmail("");
      setRut("");
      setCartAdded(false);
      if (product) {
        setQuoteItems([
          {
            ...product,
            quantity: 1,
            unitPrice: product.basePrice,
            totalPrice: product.basePrice * 1,
          },
        ]);
      } else {
        setQuoteItems([]);
      }
    }
  }, [isOpen, product]);

  // Lógica para agregar productos del carrito (sin duplicados)
  const handleAddCartItems = () => {
    // Solo agrega los que no están ya en la cotización (por id, color, size)
    const toAdd = cartItems.filter(
      (cartItem) =>
        !quoteItems.some(
          (qi) =>
            qi.id === cartItem.id &&
            qi.selectedColor === cartItem.selectedColor &&
            qi.selectedSize === cartItem.selectedSize
        )
    );
    setQuoteItems([...quoteItems, ...toAdd]);
    setCartAdded(true);
  };

  // Si el usuario cambia cantidad o elimina un producto que venía del carrito, deshabilita el botón de agregar carrito
  useEffect(() => {
    if (!cartAdded) return;
    // Si algún producto del carrito ya está en la cotización y fue modificado (cantidad distinta), deshabilita el botón
    const modified = cartItems.some((cartItem) => {
      const q = quoteItems.find(
        (qi) =>
          qi.id === cartItem.id &&
          qi.selectedColor === cartItem.selectedColor &&
          qi.selectedSize === cartItem.selectedSize
      );
      return q && q.quantity !== cartItem.quantity;
    });
    if (modified) setCartAdded(false);
  }, [quoteItems, cartItems, cartAdded]);

  const handleQuantityChange = (item: CartItem, quantity: number) => {
    setQuoteItems((qs) =>
      qs.map((qi) =>
        qi.id === item.id &&
        qi.selectedColor === item.selectedColor &&
        qi.selectedSize === item.selectedSize
          ? { ...qi, quantity, totalPrice: qi.unitPrice * quantity }
          : qi
      )
    );
  };

  const handleRemoveItem = (item: CartItem) => {
    setQuoteItems((qs) =>
      qs.filter(
        (qi) =>
          !(
            qi.id === item.id &&
            qi.selectedColor === item.selectedColor &&
            qi.selectedSize === item.selectedSize
          )
      )
    );
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Cotización", 10, 15);
    doc.setFontSize(11);
    doc.text(`Empresa: ${company}`, 10, 25);
    doc.text(`Email: ${email}`, 10, 32);
    doc.text(`RUT: ${rut}`, 10, 39);
    doc.text("Productos:", 10, 49);

    let y = 56;
    quoteItems.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.name} x ${item.quantity} - $${
          item.totalPrice
            ? item.totalPrice.toLocaleString("es-CL")
            : (item.basePrice || 0).toLocaleString("es-CL")
        }`,
        12,
        y
      );
      y += 7;
    });

    const total = quoteItems.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    doc.setFontSize(13);
    doc.text(`Total: $${total.toLocaleString("es-CL")}`, 10, y + 5);

    doc.save("cotizacion.pdf");
  };

  return (
    <div className="quote-modal-overlay" onClick={onClose}>
      <div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="quote-modal-header">
          <h2 id="quote-modal-title">Simulador de Cotización</h2>
          <button className="close-btn" aria-label="Cerrar modal" onClick={onClose}>
            <span className="material-icons" aria-hidden="true">close</span>
          </button>
        </div>
        <form className="quote-form" onSubmit={handleSubmit} aria-labelledby="quote-modal-title">
          <div className="form-group">
            <label htmlFor="company-input">Empresa</label>
            <input
              id="company-input"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rut-input">RUT</label>
            <input
              id="rut-input"
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            {product && (
              <button
                className="btn btn-secondary"
                style={{ marginBottom: 8 }}
                onClick={handleAddCartItems}
                disabled={cartAdded || cartItems.length === 0}
              >
                Agregar productos del carrito
              </button>
            )}
          </div>

          <div className="quote-summary">
            <h3>Resumen de productos</h3>
            {quoteItems.length === 0 ? (
              <div>No hay productos seleccionados.</div>
            ) : (
              <ul>
                {quoteItems.map((item) => (
                  <li
                    key={
                      item.id +
                      (item.selectedColor || "") +
                      (item.selectedSize || "")
                    }
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item,
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      style={{ width: 60 }}
                    />
                    <span>x</span>
                    <span>
                      $
                      {item.totalPrice
                        ? item.totalPrice.toLocaleString("es-CL")
                        : (item.basePrice || 0).toLocaleString("es-CL")}
                    </span>
                    <button
                      type="button"
                      className="remove-btn"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleRemoveItem(item)}
                      title="Eliminar"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="btn btn-primary cta1"
            type="submit"
            disabled={quoteItems.length === 0}
          >
            Generar Cotización
          </button>
        </form>
        {submitted && (
          <div className="quote-success">
            Cotización generada.
            <br />
            <button
              className="btn btn-secondary"
              style={{ marginTop: 12 }}
              onClick={handleExportPDF}
            >
              Descargar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
