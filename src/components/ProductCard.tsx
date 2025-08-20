import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import './ProductCard.css'
import { formatToCLP } from '../utils/currency'

interface ProductCardProps {
  product: Product;
  onQuoteProduct?: (product: Product) => void;
}

const ProductCard = ({ product, onQuoteProduct }: ProductCardProps) => {
  // Handle product status display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active l1">Disponible</span>
      case 'inactive':
        return <span className="status-badge status-inactive l1">No disponible</span>
      case 'pending':
        return <span className="status-badge status-pending l1">Pendiente</span>
      default:
        return null
    }
  }

  // Check stock availability
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="stock-status out-of-stock l1">Sin stock</span>
    } else if (stock < 10) {
      return <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
    }
    return <span className="stock-status in-stock l1">{stock} disponibles</span>
  }

  // Best discount (lowest unit price across breaks)
  const getBestBreak = () => {
    if (!product.priceBreaks || product.priceBreaks.length <= 1) return null
    return product.priceBreaks.reduce((best, pb) => {
      if (!best) return pb
      if (pb.price < best.price) return pb
      if (pb.price === best.price && pb.minQty > best.minQty) return pb
      return best
    }, null as any)
  }

  return (
  <div className="product-card" role="article" aria-label={`Producto: ${product.name}`}> 
      <Link to={`/product/${product.id}`} className="product-link">
        {/* Product Image */}
        <div className="product-image">
          {product.photos && product.photos.length > 0 ? (
            <img
              src={product.photos[0]}
              alt={`Imagen principal de ${product.name}`}
              className="product-img-real"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', background: '#f3f3f3' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
              }}
            />
          ) : (
            <div className="image-placeholder" aria-hidden="true">
              <span className="material-icons">image</span>
            </div>
          )}
          {/* Status Badge */}
          <div className="product-status">
            {getStatusBadge(product.status)}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium">{product.name}</h3>
            <p className="product-sku l1">{product.sku}</p>
          </div>

          <div className="product-details">
            <div className="product-category">
              <span className="material-icons">category</span>
              <span className="l1">{product.category}</span>
            </div>
            
            {getStockStatus(product.stock)}
          </div>

          {/* Features - show only first 2, and '+N más' if more */}
          {product.features && product.features.length > 0 && (
            <div className="product-features">
              {product.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="feature-tag l1">{feature}</span>
              ))}
              {product.features.length > 2 && (
                <span className="feature-tag l1">+{product.features.length - 2} más</span>
              )}
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">{product.colors.length} colores:</span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} className="color-dot" title={color}></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Footer */}
      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">{formatToCLP(product.basePrice)}</div>
      {getBestBreak() && (
            <div className="discount-info">
        <span className="discount-price l1">{formatToCLP(getBestBreak()!.price)}</span>
        <span className="discount-label l1">desde {getBestBreak()!.minQty} unidades</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button 
            className="btn btn-secondary l1"
            aria-label={`Cotizar producto ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              if (typeof onQuoteProduct === 'function') onQuoteProduct(product);
            }}
          >
            <span className="material-icons" aria-hidden="true">calculate</span>
            Cotizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard