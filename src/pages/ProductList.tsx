import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [selectedSupplier, setSelectedSupplier] = useState(searchParams.get('supplier') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');

  // Filter and sort products based on all criteria
  const filterProducts = (
    category: string,
    search: string,
    sort: string,
    supplier: string,
    min: string,
    max: string
  ) => {
    let filtered = [...allProducts];

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Supplier filter
    if (supplier) {
      filtered = filtered.filter((product) => product.supplier === supplier);
    }

    // Price range filter
    const minVal = min ? parseInt(min) : null;
    const maxVal = max ? parseInt(max) : null;
    if (minVal !== null) {
      filtered = filtered.filter((product) => product.basePrice >= minVal);
    }
    if (maxVal !== null) {
      filtered = filtered.filter((product) => product.basePrice <= maxVal);
    }

    // Search filter
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
      );
    }

    // Sorting logic
    switch (sort) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const updateURLParams = (params: {
    category?: string;
    q?: string;
    sort?: string;
    supplier?: string;
    min?: string;
    max?: string;
  }) => {
    const newParams: any = {};
    if (params.category && params.category !== 'all') newParams.category = params.category;
    if (params.q) newParams.q = params.q;
    if (params.sort && params.sort !== 'name') newParams.sort = params.sort;
    if (params.supplier) newParams.supplier = params.supplier;
    if (params.min) newParams.min = params.min;
    if (params.max) newParams.max = params.max;
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURLParams({
      category,
      q: searchQuery,
      sort: sortBy,
      supplier: selectedSupplier,
      min: minPrice,
      max: maxPrice,
    });
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    updateURLParams({
      category: selectedCategory,
      q: search,
      sort: sortBy,
      supplier: selectedSupplier,
      min: minPrice,
      max: maxPrice,
    });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURLParams({
      category: selectedCategory,
      q: searchQuery,
      sort,
      supplier: selectedSupplier,
      min: minPrice,
      max: maxPrice,
    });
  };

  const handleSupplierChange = (supplier: string) => {
    setSelectedSupplier(supplier);
    updateURLParams({
      category: selectedCategory,
      q: searchQuery,
      sort: sortBy,
      supplier,
      min: minPrice,
      max: maxPrice,
    });
  };

  const handleMinPriceChange = (min: string) => {
    setMinPrice(min);
    updateURLParams({
      category: selectedCategory,
      q: searchQuery,
      sort: sortBy,
      supplier: selectedSupplier,
      min,
      max: maxPrice,
    });
  };

  const handleMaxPriceChange = (max: string) => {
    setMaxPrice(max);
    updateURLParams({
      category: selectedCategory,
      q: searchQuery,
      sort: sortBy,
      supplier: selectedSupplier,
      min: minPrice,
      max,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSelectedSupplier("");
    setMinPrice("");
    setMaxPrice("");
    setFilteredProducts(allProducts);
    setSearchParams({});
  };

  // Sincroniza el filtrado cada vez que cambian los query params
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'name';
    const supplier = searchParams.get('supplier') || '';
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    setSelectedCategory(category);
    setSearchQuery(q);
    setSortBy(sort);
    setSelectedSupplier(supplier);
    setMinPrice(min);
    setMaxPrice(max);
    filterProducts(category, q, sort, supplier, min, max);
    // eslint-disable-next-line
  }, [searchParams]);

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">6</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSupplier={selectedSupplier}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onSupplierChange={handleSupplierChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onClearFilters={handleClearFilters}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button
                className="btn btn-primary cta1"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  filterProducts("all", "", sortBy, "", "", "");
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
