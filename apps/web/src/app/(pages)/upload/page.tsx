'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useCatalog, type ColumnMapping, type ProductRow } from '@/contexts/CatalogContext';

const STANDARD_FIELDS = ['description', 'ean', 'price', 'manufacturer_code', 'brand', 'quantity'] as const;

const KNOWN_ALIASES: Record<string, string[]> = {
  description: ['Prod_Desc', 'Description', 'Descrizione', 'Beschreibung', 'desc', 'product_description', 'nome', 'name', 'product_name'],
  ean: ['EAN', 'ean_code', 'barcode', 'EAN13', 'codice_ean', 'gtin'],
  price: ['Price', 'Prezzo', 'price_net', 'prezzo_netto', 'unit_price', 'list_price'],
  manufacturer_code: ['manufacturer_code', 'codice_produttore', 'SKU', 'sku', 'article_number', 'codice_articolo', 'product_code', 'cod_art'],
  brand: ['Brand', 'Marca', 'brand_name', 'manufacturer', 'produttore'],
  quantity: ['quantity', 'carton_qty', 'quantita', 'packing_unit', 'qty', 'confezione'],
};

function autoMap(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};
  for (const [field, aliases] of Object.entries(KNOWN_ALIASES)) {
    const match = headers.find(h =>
      aliases.some(a => h.toLowerCase().trim() === a.toLowerCase())
    );
    if (match) (mapping as Record<string, string>)[field] = match;
  }
  return mapping;
}

export default function UploadPage() {
  const t = useTranslations('upload');
  const router = useRouter();
  const { setRows, setColumnMapping, setRawHeaders, setFileName, rawHeaders, columnMapping } = useCatalog();
  const [parsedData, setParsedData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  const [step, setStep] = useState<'upload' | 'mapping'>('upload');

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const h = results.meta.fields || [];
          setHeaders(h);
          setRawHeaders(h);
          setParsedData(results.data as Record<string, string>[]);
          setMapping(autoMap(h));
          setStep('mapping');
        },
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
        const h = data.length > 0 ? Object.keys(data[0]) : [];
        setHeaders(h);
        setRawHeaders(h);
        setParsedData(data);
        setMapping(autoMap(h));
        setStep('mapping');
      };
      reader.readAsArrayBuffer(file);
    }
  }, [setFileName, setRawHeaders]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && processFile(files[0]),
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const handleConfirmMapping = () => {
    if (!mapping.description) return;

    const finalMapping = mapping as ColumnMapping;
    setColumnMapping(finalMapping);

    const productRows: ProductRow[] = parsedData.map((row, idx) => ({
      id: `row-${idx}`,
      original_description: row[finalMapping.description] || '',
      ean: finalMapping.ean ? row[finalMapping.ean] : undefined,
      price: finalMapping.price ? parseFloat(row[finalMapping.price]) || undefined : undefined,
      manufacturer_code: finalMapping.manufacturer_code ? row[finalMapping.manufacturer_code] : undefined,
      brand: finalMapping.brand ? row[finalMapping.brand] : undefined,
      quantity: finalMapping.quantity ? parseInt(row[finalMapping.quantity]) || undefined : undefined,
      status: 'pending',
    }));

    setRows(productRows);
    localStorage.setItem('listino-pronto-mapping', JSON.stringify(finalMapping));
    router.push('/preview');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      {step === 'upload' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
          }`}
          aria-label={t('dropzone')}
        >
          <input {...getInputProps()} aria-label="File upload input" />
          <div className="flex flex-col items-center gap-4">
            {isDragActive ? (
              <FileSpreadsheet className="h-16 w-16 text-brand-500" />
            ) : (
              <Upload className="h-16 w-16 text-gray-400" />
            )}
            <p className="text-lg text-gray-700">{t('dropzone')}</p>
            <p className="text-sm text-gray-500">{t('dropzoneAlt')}</p>
            <p className="text-xs text-gray-400">{t('formats')}</p>
          </div>
        </div>
      )}

      {step === 'mapping' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('mapping')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('mappingDesc')}</p>

          <div className="space-y-4">
            {STANDARD_FIELDS.map((field) => (
              <div key={field} className="flex items-center gap-4">
                <label className="w-48 text-sm font-medium text-gray-700" htmlFor={`map-${field}`}>
                  {t(field)}
                  {field === 'description' && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  id={`map-${field}`}
                  value={(mapping as Record<string, string>)[field] || ''}
                  onChange={(e) => setMapping({ ...mapping, [field]: e.target.value || undefined })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  aria-label={`Map ${field}`}
                >
                  <option value="">-- Select column --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirmMapping}
              disabled={!mapping.description}
              className="flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={t('confirm')}
            >
              {t('confirm')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
