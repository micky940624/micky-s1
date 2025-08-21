import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './ProductContext';
import { storage } from '../utils/localStorage';

export interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'upi' | 'card';
  customerName?: string;
  customerPhone?: string;
  date: string;
  invoiceNumber: string;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'date' | 'invoiceNumber'>) => Sale;
  getTodaySales: () => Sale[];
  getTotalRevenue: () => number;
  getTodayRevenue: () => number;
  getSalesCount: () => number;
  getTodaySalesCount: () => number;
  getTopProducts: () => Array<{ product: Product; quantity: number; revenue: number }>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const savedSales = storage.getSales();
    setSales(savedSales);
  }, []);

  useEffect(() => {
    storage.saveSales(sales);
  }, [sales]);

  const addSale = (saleData: Omit<Sale, 'id' | 'date' | 'invoiceNumber'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`
    };
    setSales(prev => [...prev, newSale]);
    return newSale;
  };

  const getTodaySales = () => {
    const today = new Date().toDateString();
    return sales.filter(sale => new Date(sale.date).toDateString() === today);
  };

  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const getTodayRevenue = () => {
    return getTodaySales().reduce((total, sale) => total + sale.total, 0);
  };

  const getSalesCount = () => {
    return sales.length;
  };

  const getTodaySalesCount = () => {
    return getTodaySales().length;
  };

  const getTopProducts = () => {
    const productMap = new Map();
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productMap.get(item.product.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.total;
        } else {
          productMap.set(item.product.id, {
            product: item.product,
            quantity: item.quantity,
            revenue: item.total
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  return (
    <SalesContext.Provider value={{
      sales,
      addSale,
      getTodaySales,
      getTotalRevenue,
      getTodayRevenue,
      getSalesCount,
      getTodaySalesCount,
      getTopProducts
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};