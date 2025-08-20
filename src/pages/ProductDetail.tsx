import { useState, useEffect } from "react";
import SpinnerOverlay from "../components/SpinnerOverlay";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import { Product } from "../types/Product";
import PricingCalculator from "../components/PricingCalculator";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ToastContext";
import "./ProductDetail.css";

const ProductDetail = ({
  onQuoteProduct,
}: {
  onQuoteProduct?: (product: Product) => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainPhotoIdx, setMainPhotoIdx] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    if (id) {
      setTimeout(() => {
        const foundProduct = products.find((p) => p.id === parseInt(id));
        setProduct(foundProduct || null);

        // Set default selections
        if (foundProduct?.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        if (foundProduct?.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        setLoading(false);
      }, 200);
    } else {
      setProduct(null);
      setLoading(false);
    }
  }, [id]);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  if (loading) {
    return <SpinnerOverlay />;
  }
  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <span className="material-icons">error_outline</span>
          <h2 className="h2">Producto no encontrado</h2>
          <p className="p1">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/" className="btn btn-primary cta1">
            <span className="material-icons">arrow_back</span>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Validate product status
  const canAddToCart = product.status === "active" && product.stock > 0;

  // Always use a safe index for main photo
  const safePhotoIdx = product.photos && product.photos.length > 0
    ? Math.min(mainPhotoIdx, product.photos.length - 1)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link l1">
            Catálogo
          </Link>
          <span className="breadcrumb-separator l1">/</span>
          <span className="breadcrumb-current l1">{product.name}</span>
        </nav>

        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              {product.photos && product.photos.length > 0 ? (
                <img
                  src={product.photos[safePhotoIdx]}
                  alt={product.name}
                  className="product-img-real"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', background: '#f3f3f3' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                  }}
                />
              ) : (
                <div className="image-placeholder">
                  <span className="material-icons">image</span>
                </div>
              )}
            </div>

            {product.photos && product.photos.length > 1 && (
              <div className="image-thumbnails">
                {product.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail${safePhotoIdx === idx ? ' selected' : ''}`}
                    style={{ cursor: 'pointer', border: safePhotoIdx === idx ? '2px solid #0070f3' : '2px solid transparent', borderRadius: 6, padding: 2, background: '#fff' }}
                    onClick={() => setMainPhotoIdx(idx)}
                  >
                    <img
                      src={photo}
                      alt={`Miniatura ${idx + 1}`}
                      style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x36?text=Sin+Img';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-details">
            <div className="product-header">
              <h1 className="product-title h2">{product.name}</h1>
              <p className="product-sku p1">SKU: {product.sku}</p>

              {/* Status */}
              <div className="product-status">
                {product.status === "active" ? (
                  <span className="status-badge status-active l1">
                    ✓ Disponible
                  </span>
                ) : product.status === "pending" ? (
                  <span className="status-badge status-pending l1">
                    ⏳ Pendiente
                  </span>
                ) : (
                  <span className="status-badge status-inactive l1">
                    ❌ No disponible
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="product-description">
                <h3 className="p1-medium">Descripción</h3>
                <p className="p1">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3 className="p1-medium">Características</h3>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index} className="feature-item l1">
                      <span className="material-icons">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="selection-group">
                <h3 className="selection-title p1-medium">Color disponibles</h3>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <div className="color-preview"></div>
                      <span className="l1">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="selection-group">
                <h3 className="selection-title p1-medium">
                  Tallas disponibles
                </h3>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span className="l1">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label className="quantity-label l1">Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    <span className="material-icons">remove</span>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const parsed = isNaN(val) ? 1 : val;
                      const clamped = Math.min(
                        product.stock,
                        Math.max(1, parsed)
                      );
                      setQuantity(clamped);
                    }}
                    className="quantity-input"
                    min={1}
                    max={product.stock}
                    aria-label={`Cantidad, máximo ${product.stock}`}
                  />
                  <button
                    onClick={() => {
                      if (quantity >= product.stock) {
                        showToast('No hay suficiente stock para agregar más unidades.', 'error');
                        return;
                      }
                      setQuantity(Math.min(product.stock, quantity + 1));
                    }}
                    className="quantity-btn"
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
                <div className="quantity-help l1">
                  Máximo {product.stock} unidades disponibles
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className={`btn btn-primary cta1 ${
                    !canAddToCart ? "disabled" : ""
                  }`}
                  disabled={!canAddToCart}
                  onClick={() => {
                    if (!canAddToCart) {
                      showToast('Este producto no está disponible para agregar al carrito.', 'error');
                      return;
                    }
                    if (quantity > product.stock) {
                      showToast('No hay suficiente stock para esa cantidad.', 'error');
                      return;
                    }
                    addToCart(product, quantity, {
                      color: selectedColor,
                      size: selectedSize,
                    });
                  }}
                >
                  <span className="material-icons">shopping_cart</span>
                  {canAddToCart ? "Agregar al carrito" : "No disponible"}
                </button>

                <button
                  className="btn btn-secondary cta1"
                  onClick={() => onQuoteProduct && onQuoteProduct(product)}
                >
                  <span className="material-icons">calculate</span>
                  Solicitar cotización
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Calculator */}
        <div className="pricing-section">
          <PricingCalculator product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
