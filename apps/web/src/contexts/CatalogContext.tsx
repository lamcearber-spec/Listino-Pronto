'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProductRow {
  id: string;
  original_description: string;
  ean?: string;
  price?: number;
  manufacturer_code?: string;
  brand?: string;
  quantity?: number;
  etim_class_code?: string;
  etim_class_name?: string;
  confidence_score?: number;
  reasoning?: string;
  extracted_features?: Array<{
    feature_code: string;
    feature_name: string;
    value: string | number;
    unit?: string;
  }>;
  approved?: boolean;
  status?: 'pending' | 'classified' | 'approved' | 'error';
}

export interface ColumnMapping {
  description: string;
  ean?: string;
  price?: string;
  manufacturer_code?: string;
  brand?: string;
  quantity?: string;
}

interface CatalogContextType {
  rows: ProductRow[];
  setRows: (rows: ProductRow[]) => void;
  columnMapping: ColumnMapping | null;
  setColumnMapping: (mapping: ColumnMapping | null) => void;
  rawHeaders: string[];
  setRawHeaders: (headers: string[]) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');

  return (
    <CatalogContext.Provider value={{
      rows, setRows,
      columnMapping, setColumnMapping,
      rawHeaders, setRawHeaders,
      fileName, setFileName,
    }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within CatalogProvider');
  return context;
}
