import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/localStorage';

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  sku?: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: string;
  description?: string;
  image?: string;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
  taxInclusive: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  getLowStockProducts: () => Product[];
  updateStock: (id: string, quantity: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = storage.getProducts();
    setProducts(savedProducts);
  }, []);

  useEffect(() => {
    storage.saveProducts(products);
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      taxInclusive: productData.taxInclusive || false
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (query: string) => {
    if (!query) return products;
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.barcode?.includes(query) ||
      product.sku?.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
  };

  const updateStock = (id: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, stock: product.stock - quantity, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      searchProducts,
      getLowStockProducts,
      updateStock
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};