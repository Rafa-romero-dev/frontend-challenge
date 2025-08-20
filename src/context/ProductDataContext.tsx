import React, { createContext, useContext, useMemo } from "react";
import { products as productsData } from "../data/products";
import type { Product } from "../types/Product";

interface ProductDataContextType {
  products: Product[];
  getProductById: (id: number) => Product | undefined;
}

const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined);

export const ProductDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Memoize products and lookup
  const value = useMemo(() => {
    const getProductById = (id: number) => productsData.find(p => p.id === id);
    return { products: productsData, getProductById };
  }, []);
  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};

export function useProductData() {
  const ctx = useContext(ProductDataContext);
  if (!ctx) throw new Error("useProductData must be used within ProductDataProvider");
  return ctx;
}
