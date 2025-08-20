import { categories, suppliers } from '../data/products'
import './ProductFilters.css'

interface ProductFiltersProps {
  selectedCategory: string
  searchQuery: string
  sortBy: string
  selectedSupplier: string
  minPrice: string;
  maxPrice: string;
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: string) => void
  onSupplierChange: (supplier: string) => void
  onMinPriceChange: (min: string) => void
  onMaxPriceChange: (max: string) => void
  onClearFilters: () => void
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSupplier,
  minPrice,
  maxPrice,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters
}: ProductFiltersProps) => {

  const handleMinPriceChange = (val: string) => {
    onMinPriceChange(val);
    const min = parseInt(val);
    const max = parseInt(maxPrice);
    if (!isNaN(min) && !isNaN(max) && max < min) {
      onMaxPriceChange(val);
    }
  };

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => onSearchChange('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            <button
              className={`supplier-btn${selectedSupplier === '' ? ' active' : ''}`}
              onClick={() => onSupplierChange('')}
            >
              Todos
            </button>
            {suppliers.map(supplier => (
              <button
                key={supplier.id}
                className={`supplier-btn${selectedSupplier === supplier.id ? ' active' : ''}`}
                onClick={() => onSupplierChange(supplier.id)}
              >
                {supplier.name} <span className="supplier-count l1">({supplier.products})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de Precios</h3>
          <div className="price-range-inputs">
            <input
              type="number"
              min="0"
              placeholder="Mín"
              value={minPrice}
              onChange={e => handleMinPriceChange(e.target.value)}
              className="price-input"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              min={minPrice || 0}
              placeholder="Máx"
              value={maxPrice}
              onChange={e => onMaxPriceChange(e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="filter-section">
          <button className="btn btn-secondary" onClick={onClearFilters}>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters