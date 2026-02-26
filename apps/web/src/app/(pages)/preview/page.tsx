'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCatalog, type ProductRow } from '@/contexts/CatalogContext';
import { Brain, Check, Pencil, Download, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

function ConfidenceBar({ score }: { score: number }) {
  const color = score >= 0.9 ? 'bg-green-500' : score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = score >= 0.9 ? 'text-green-700' : score >= 0.7 ? 'text-yellow-700' : 'text-red-700';

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(score * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score * 100}%` }} />
      </div>
      <span className={`text-xs font-medium ${textColor}`}>{Math.round(score * 100)}%</span>
    </div>
  );
}

export default function PreviewPage() {
  const t = useTranslations('preview');
  const { rows, setRows } = useCatalog();
  const [classifying, setClassifying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClass, setEditClass] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const classifyAll = async () => {
    setClassifying(true);
    try {
      const pending = rows.filter(r => r.status === 'pending');
      const { data } = await axios.post(`${API_URL}/api/v1/match-classes`, {
        descriptions: pending.map(r => r.original_description),
      });

      const classResult = await axios.post(`${API_URL}/api/v1/classify`, {
        items: data.results.map((r: { description: string; candidates: Array<{ class_id: string; class_name: string }> }, i: number) => ({
          description: r.description,
          candidates: r.candidates,
        })),
      });

      const updatedRows = [...rows];
      let classIdx = 0;
      for (let i = 0; i < updatedRows.length; i++) {
        if (updatedRows[i].status === 'pending') {
          const result = classResult.data.results[classIdx];
          updatedRows[i] = {
            ...updatedRows[i],
            etim_class_code: result.etim_class_code,
            etim_class_name: result.etim_class_name || result.etim_class_code,
            confidence_score: result.confidence_score,
            reasoning: result.reasoning,
            extracted_features: result.extracted_features,
            status: 'classified',
          };
          classIdx++;
        }
      }
      setRows(updatedRows);
    } catch (err) {
      console.error('Classification failed:', err);
    } finally {
      setClassifying(false);
    }
  };

  const approveRow = (id: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, status: 'approved', approved: true } : r));
  };

  const approveAll = () => {
    setRows(rows.map(r => r.status === 'classified' ? { ...r, status: 'approved', approved: true } : r));
  };

  const saveEdit = (id: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, etim_class_code: editClass, etim_class_name: editClass } : r));
    setEditingId(null);
    setEditClass('');
  };

  const exportFile = async (format: 'bmecat' | 'ecp') => {
    const approved = rows.filter(r => r.approved);
    const companyId = localStorage.getItem('listino-pronto-company-id') || 'XXX';
    const brandId = localStorage.getItem('listino-pronto-brand-id') || 'Unknown';

    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/export/${format}`,
        { products: approved, company_id: companyId, brand_id: brandId },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      a.download = format === 'bmecat' ? `listino-${date}.xml` : `metel-ecp-${date}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const totalPages = Math.ceil(rows.length / pageSize);
  const pageRows = rows.slice(page * pageSize, (page + 1) * pageSize);

  if (rows.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <div className="flex gap-3">
          <button
            onClick={classifyAll}
            disabled={classifying}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors"
            aria-label={t('classifyAll')}
          >
            {classifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {classifying ? t('processing') : t('classifyAll')}
          </button>
          <button
            onClick={approveAll}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            aria-label={t('approveAll')}
          >
            <Check className="h-4 w-4" />
            {t('approveAll')}
          </button>
          <button
            onClick={() => exportFile('bmecat')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label={t('exportXml')}
          >
            <Download className="h-4 w-4" />
            {t('exportXml')}
          </button>
          <button
            onClick={() => exportFile('ecp')}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            aria-label={t('exportEcp')}
          >
            <FileText className="h-4 w-4" />
            {t('exportEcp')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="ETIM classification results">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">{t('original')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">{t('etimClass')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">{t('features')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">{t('confidence')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((row) => (
                <tr key={row.id} className={row.approved ? 'bg-green-50' : ''}>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-900" title={row.original_description}>
                    {row.original_description}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === row.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                          aria-label="Edit ETIM class"
                        />
                        <button onClick={() => saveEdit(row.id)} className="text-green-600 hover:text-green-800" aria-label="Save edit">
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-mono text-xs">{row.etim_class_code || '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {row.extracted_features?.slice(0, 2).map((f, i) => (
                      <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded mr-1 mb-1">
                        {f.feature_name}: {f.value}{f.unit ? ` ${f.unit}` : ''}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    {row.confidence_score != null ? (
                      <ConfidenceBar score={row.confidence_score} />
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingId(row.id); setEditClass(row.etim_class_code || ''); }}
                        className="text-gray-500 hover:text-brand-500"
                        aria-label={`${t('edit')} ${row.original_description}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {!row.approved && row.etim_class_code && (
                        <button
                          onClick={() => approveRow(row.id)}
                          className="text-gray-500 hover:text-green-600"
                          aria-label={`${t('approve')} ${row.original_description}`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="text-sm text-gray-600 hover:text-brand-500 disabled:opacity-50"
              aria-label="Previous page"
            >
              &larr; Prev
            </button>
            <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="text-sm text-gray-600 hover:text-brand-500 disabled:opacity-50"
              aria-label="Next page"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
