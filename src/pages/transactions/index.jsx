import React, { useEffect, useRef, useState, useMemo } from 'react';
import Header from 'components/ui/Header';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { transactionsAPI, apiRequest, apiUtils } from 'services/api';

const seed = [
  { id: 1, date: '2025-06-01', description: 'Vendor A', amount: 15000, category: 'Supplies', type: 'expense', merchant: 'Vendor A' },
  { id: 2, date: '2025-06-08', description: 'Vendor B', amount: 250000, category: 'Equipment', type: 'expense', merchant: 'Vendor B' },
  { id: 3, date: '2025-06-15', description: 'Refund', amount: -5000, category: 'Adjustments', type: 'income', merchant: 'Company XYZ' },
  { id: 4, date: '2025-07-01', description: 'Office Supplies', amount: 8500, category: 'Supplies', type: 'expense', merchant: 'Staples' },
  { id: 5, date: '2025-07-15', description: 'Software License', amount: 12000, category: 'Technology', type: 'expense', merchant: 'Microsoft' },
  { id: 6, date: '2025-08-01', description: 'Consulting Fee', amount: -45000, category: 'Income', type: 'income', merchant: 'Client ABC' },
];

const Transactions = () => {
  // Core state
  const [rows, setRows] = useState(seed);
  const [result, setResult] = useState(null);
  const [importInfo, setImportInfo] = useState(null);
  const [importError, setImportError] = useState(null);
  const [analyzeInfo, setAnalyzeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Enhanced state for new features
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // table, cards, charts
  const [showFilters, setShowFilters] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Enhanced data processing with intelligent filtering and analytics
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter(row => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!row.description?.toLowerCase().includes(searchLower) &&
            !row.category?.toLowerCase().includes(searchLower) &&
            !row.merchant?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Category filter
      if (selectedCategory !== 'all' && row.category !== selectedCategory) {
        return false;
      }
      
      // Type filter
      if (selectedType !== 'all') {
        const rowType = row.amount < 0 ? 'income' : 'expense';
        if (rowType !== selectedType) return false;
      }
      
      // Date range filter
      if (dateRange.start && row.date < dateRange.start) return false;
      if (dateRange.end && row.date > dateRange.end) return false;
      
      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'amount') {
        aVal = Math.abs(Number(aVal));
        bVal = Math.abs(Number(bVal));
      } else if (sortField === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rows, searchTerm, selectedCategory, selectedType, dateRange, sortField, sortDirection]);

  // Smart analytics and insights
  const analytics = useMemo(() => {
    const totalExpenses = rows.filter(r => r.amount > 0).reduce((sum, r) => sum + r.amount, 0);
    const totalIncome = rows.filter(r => r.amount < 0).reduce((sum, r) => sum + Math.abs(r.amount), 0);
    const netFlow = totalIncome - totalExpenses;
    
    // Category breakdown
    const categoryBreakdown = rows.reduce((acc, row) => {
      const category = row.category || 'Uncategorized';
      if (!acc[category]) acc[category] = { count: 0, amount: 0 };
      acc[category].count++;
      acc[category].amount += Math.abs(row.amount);
      return acc;
    }, {});
    
    // Monthly trend
    const monthlyTrend = rows.reduce((acc, row) => {
      const month = row.date.slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      if (row.amount < 0) {
        acc[month].income += Math.abs(row.amount);
      } else {
        acc[month].expense += row.amount;
      }
      return acc;
    }, {});
    
    // Find largest transactions
    const largeTransactions = rows.filter(r => Math.abs(r.amount) > 50000);
    
    // Spending patterns
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b.amount - a.amount)
      .slice(0, 5);
    
    return {
      totalTransactions: rows.length,
      totalExpenses,
      totalIncome,
      netFlow,
      categoryBreakdown,
      monthlyTrend,
      largeTransactions,
      topCategories,
      averageTransaction: rows.length ? rows.reduce((sum, r) => sum + Math.abs(r.amount), 0) / rows.length : 0
    };
  }, [rows]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(rows.map(r => r.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [rows]);

  // Load transactions from server when authenticated
  useEffect(() => {
    const loadTransactions = async () => {
      const tkn = localStorage.getItem('authToken');
      const isDemo = tkn && tkn.startsWith('demo-jwt-token-');
      if (!tkn || isDemo) return;
      
      setLoading(true);
      try {
        const list = await transactionsAPI.getTransactions({ limit: 200 });
        if (Array.isArray(list) && list.length) {
          const mapped = list.map((t, i) => ({
            id: t.id ?? i + 1,
            date: (t.date && String(t.date).slice(0, 10)) || '',
            description: t.description || t.merchant_name || '',
            amount: (t.type === 'income' || t.type?.value === 'income') ? -Number(t.amount) : Number(t.amount),
            category: t.category || 'Uncategorized',
            type: t.type || (t.amount < 0 ? 'income' : 'expense'),
            merchant: t.merchant_name || t.description || '',
          }));
          setRows(mapped);
          setImportInfo(`Loaded ${mapped.length} transactions from your account`);
        }
      } catch (err) {
        console.warn('Failed to load server transactions', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, []);

  // Smart categorization helper
  const suggestCategory = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('coffee') || desc.includes('restaurant') || desc.includes('food')) return 'Food & Dining';
    if (desc.includes('gas') || desc.includes('fuel') || desc.includes('uber') || desc.includes('taxi')) return 'Transportation';
    if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store')) return 'Shopping';
    if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('utilities')) return 'Housing';
    if (desc.includes('salary') || desc.includes('payroll') || desc.includes('income')) return 'Income';
    if (desc.includes('insurance') || desc.includes('medical') || desc.includes('health')) return 'Healthcare';
    if (desc.includes('gym') || desc.includes('entertainment') || desc.includes('movie')) return 'Entertainment';
    if (desc.includes('software') || desc.includes('subscription') || desc.includes('netflix')) return 'Technology';
    return 'Miscellaneous';
  };

  // Enhanced CSV parsing with smart categorization
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) throw new Error('CSV is empty');

    const headerCells = splitCSVLine(lines[0]).map(h => h.toLowerCase());
    const hasHeader = ['date', 'description', 'amount', 'category']
      .some(h => headerCells.includes(h));

    let headers = headerCells;
    let startIdx = 1;
    if (!hasHeader) {
      headers = ['date', 'description', 'amount', 'category'];
      startIdx = 0;
    }

    const idx = {
      date: headers.findIndex(h => h.includes('date')),
      description: headers.findIndex(h => h.includes('desc')),
      amount: headers.findIndex(h => h.includes('amount') || h.includes('amt')),
      category: headers.findIndex(h => h.includes('category') || h.includes('cat')),
    };

    if (idx.description === -1 && headers.length > 1) idx.description = 1;
    if (idx.amount === -1 && headers.length > 2) idx.amount = 2;
    if (idx.category === -1 && headers.length > 3) idx.category = 3;
    if (idx.date === -1) idx.date = 0;

    const parsed = [];
    for (let li = startIdx; li < lines.length; li++) {
      const cells = splitCSVLine(lines[li]);
      if (cells.length === 0 || cells.every(c => c.trim() === '')) continue;
      
      const date = cells[idx.date] || '';
      const description = cells[idx.description] || '';
      const amountRaw = cells[idx.amount];
      let category = cells[idx.category] || '';
      const amount = parseCurrency(amountRaw);
      
      if (!Number.isFinite(amount)) continue;
      
      // Smart categorization if category is missing
      if (!category) {
        category = suggestCategory(description);
      }
      
      parsed.push({ 
        date, 
        description, 
        amount, 
        category,
        type: amount < 0 ? 'income' : 'expense',
        merchant: description.split(' ')[0] // Extract potential merchant name
      });
    }
    return parsed;
  };

  const splitCSVLine = (line) => {
    // Split a CSV line respecting quoted fields and escaped quotes
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { // escaped quote
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.trim());
  };

  const parseCurrency = (val) => {
    if (val == null) return NaN;
    const cleaned = String(val)
      .replace(/[$€£₹\s]/g, '')
      .replace(/,/g, '')
      .trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : NaN;
  };

  const mapToBackendTransactions = (items) => {
    // Backend requires amount, type, date. We'll infer type from sign and normalize amounts to positive.
    return items.map((r) => {
      const isIncome = Number(r.amount) < 0; // treat negatives as inflow/refund
      const amountAbs = Math.abs(Number(r.amount));
      return {
        amount: amountAbs,
        type: isIncome ? 'income' : 'expense',
        category: r.category || (isIncome ? 'refund' : 'uncategorized'),
        description: r.description || '',
        date: r.date, // assume ISO-like string from CSV
      };
    });
  };

  const onFileChange = async (e) => {
    setImportError(null);
    setImportInfo(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) throw new Error('No valid rows found in CSV');
      // Add ids and replace current rows
      let nextId = 1;
      const withIds = parsed.map(r => ({ id: nextId++, ...r }));
      setRows(withIds);
      // Try to push to backend in the background (auth required). Don't block UI if it fails.
      try {
        const tkn = localStorage.getItem('authToken');
        const isDemo = tkn && tkn.startsWith('demo-jwt-token-');
        if (tkn && !isDemo) {
          const payload = mapToBackendTransactions(withIds);
          const res = await transactionsAPI.bulkImport(payload);
          setImportInfo(`${withIds.length} rows loaded. ${res.imported_count || payload.length} saved to account from ${file.name}.`);
        } else {
          setImportInfo(`${withIds.length} rows loaded locally from ${file.name}. Login to save to your account.`);
        }
      } catch (err) {
        const apiErr = apiUtils?.handleApiError ? apiUtils.handleApiError(err) : null;
        setImportInfo(`${withIds.length} rows loaded from ${file.name}. (Cloud save skipped: ${apiErr?.message || 'network error'})`);
      }
    } catch (err) {
      console.error(err);
      setImportError(err?.message || 'Failed to import CSV');
    } finally {
      // reset input to allow re-upload of same file
      e.target.value = '';
    }
  };

  const localAnalyze = (items) => {
    // Basic client-side analysis as a fallback when backend isn't reachable or user is not logged in
    const anomalies = [];
    let income = 0;
    let expense = 0;
    const byCategory = {};

    items.forEach((r, i) => {
      const amt = Number(r.amount) || 0;
      const isFlag = Math.abs(amt) > 100000;
      if (isFlag) {
        anomalies.push({
          id: r.id ?? i + 1,
          type: 'transaction',
          score: 0.8,
          reason: 'Unusually large transaction amount',
          data: {
            amount: amt,
            description: r.description,
            category: r.category,
            date: r.date,
          },
          timestamp: new Date().toISOString(),
        });
      }
      // Infer type from sign for local stats only
      if (amt < 0) income += Math.abs(amt); else expense += amt;
      const cat = r.category || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + (amt < 0 ? 0 : amt);
    });

    const total = items.reduce((s, r) => s + Math.abs(Number(r.amount) || 0), 0);
    const summary = {
      period: (() => {
        const dates = items.map(r => new Date(r.date)).filter(d => !isNaN(d));
        if (!dates.length) return 'N/A';
        const min = new Date(Math.min(...dates));
        const max = new Date(Math.max(...dates));
        const f = (d) => d.toISOString().slice(0, 10);
        return `${f(min)} to ${f(max)}`;
      })(),
      total_transactions: items.length,
      total_amount: total,
      income_amount: income,
      expense_amount: expense,
      net_amount: income - expense,
      anomaly_count: anomalies.length,
      category_breakdown: byCategory,
    };
    const insights = [];
    if (expense > income) insights.push('Negative cash flow detected locally');
    if (Object.keys(byCategory).length) {
      const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
      if (top) insights.push(`Highest expense category: ${top[0]} (₹${top[1].toLocaleString('en-IN')})`);
    }
    return { anomalies, summary, insights, recommendations: [] };
  };

  const runAnalyze = async () => {
    setAnalyzeInfo(null);
    try {
      const tkn = localStorage.getItem('authToken');
      const isDemo = tkn && tkn.startsWith('demo-jwt-token-');
      if (tkn && !isDemo) {
        // Determine date range from current rows to guide server analysis
        const dates = rows.map(r => new Date(r.date)).filter(d => !isNaN(d));
        const start = dates.length ? new Date(Math.min(...dates)).toISOString() : undefined;
        const end = dates.length ? new Date(Math.max(...dates)).toISOString() : undefined;
        const data = await apiRequest('/api/analyze', 'POST', {
          start_date: start,
          end_date: end,
          include_forecasts: false,
        });
        setResult(data);
        setAnalyzeInfo('Analysis completed using server');
      } else {
        const fallback = localAnalyze(rows);
        setResult(fallback);
        setAnalyzeInfo('Analysis completed locally (offline/unauthenticated)');
      }
    } catch (e) {
      console.warn('Server analysis failed, using local analysis.', e);
      const fallback = localAnalyze(rows);
      setResult(fallback);
      setAnalyzeInfo('Analysis completed locally (offline/unauthenticated)');
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Transaction Intelligence Hub</h1>
              <p className="text-text-secondary mt-2">AI-powered transaction management with smart insights</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFileChange}
              />
              <Button variant="outline" iconName="Upload" onClick={handleImportClick} className="flex items-center gap-2">
                <Icon name="upload" />
                Smart Import
              </Button>
              <Button onClick={runAnalyze} iconName="ScanLine" className="flex items-center gap-2">
                <Icon name="brain" />
                AI Analyze
              </Button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-cultural p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Total Transactions</p>
                    <p className="text-2xl font-bold text-text-primary">{result.summary?.total_transactions || 0}</p>
                  </div>
                  <Icon name="activity" className="text-blue-500 w-8 h-8" />
                </div>
              </div>
              
              <div className="card-cultural p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Total Amount</p>
                    <p className="text-2xl font-bold text-text-primary">₹{(result.summary?.total_amount || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <Icon name="wallet" className="text-green-500 w-8 h-8" />
                </div>
              </div>
              
              <div className="card-cultural p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Net Amount</p>
                    <p className={`text-2xl font-bold ${(result.summary?.net_amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(result.summary?.net_amount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Icon name={result.summary?.net_amount >= 0 ? "trending-up" : "trending-down"} className={`w-8 h-8 ${result.summary?.net_amount >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
              
              <div className="card-cultural p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Anomalies</p>
                    <p className="text-2xl font-bold text-orange-600">{result.anomalies?.length || 0}</p>
                  </div>
                  <Icon name="alert-triangle" className="text-orange-500 w-8 h-8" />
                </div>
              </div>
            </div>
          )}

          {/* Smart Insights */}
          {result?.insights && result.insights.length > 0 && (
            <div className="card-cultural p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Icon name="lightbulb" className="text-yellow-500" />
                AI Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.insights.map((insight, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                      <Icon name="info" className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-text-primary">{insight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(importInfo || importError) && (
            <div className={`card-cultural p-4 ${importError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <div className="flex items-center gap-2">
                <Icon name={importError ? "alert-circle" : "check-circle"} />
                <span className="text-sm">{importError || importInfo}</span>
              </div>
            </div>
          )}
          
          {analyzeInfo && (
            <div className="card-cultural p-4 bg-blue-50 text-blue-700">
              <div className="flex items-center gap-2">
                <Icon name="info" />
                <span className="text-sm">{analyzeInfo}</span>
              </div>
            </div>
          )}

          <div className="card-cultural">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Transaction Intelligence Hub</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-secondary">{rows.length} transactions</span>
                  {result?.anomalies?.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {result.anomalies.length} anomalies detected
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-text-secondary bg-surface-secondary/20">
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Amount</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const flagged = Math.abs(r.amount) > 100000;
                    const isAnomaly = result?.anomalies?.some(a => a.transaction_id === r.id || a.description?.includes(r.description));
                    return (
                      <tr key={r.id} className={`border-t border-border hover:bg-surface-secondary/30 ${idx % 2 ? 'bg-surface-secondary/10' : ''} ${flagged || isAnomaly ? 'bg-orange-50' : ''}`}>
                        <td className="py-3 px-4 text-text-primary">{r.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-text-primary font-medium">{r.description}</span>
                            {isAnomaly && (
                              <span className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                                <Icon name="alert-triangle" className="w-3 h-3" />
                                Anomaly detected
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-md text-xs border border-border bg-surface-secondary text-text-primary">
                            {r.category}
                          </span>
                        </td>
                        <td className={`py-3 px-4 font-semibold ${r.amount < 0 ? 'text-red-600' : 'text-green-600'} ${flagged ? 'text-orange-600' : ''}`}>
                          {r.amount < 0 ? '-' : '+'}₹{Math.abs(r.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {flagged && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                High Value
                              </span>
                            )}
                            {isAnomaly && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Anomaly
                              </span>
                            )}
                            {!flagged && !isAnomaly && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Normal
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Anomalies Section */}
              {result.anomalies && result.anomalies.length > 0 && (
                <div className="card-cultural p-6">
                  <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Icon name="alert-triangle" className="text-orange-500" />
                    Detected Anomalies
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {result.anomalies.map((anomaly, idx) => (
                      <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-3">
                          <Icon name="warning" className="text-orange-600 mt-1 w-4 h-4" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-orange-800">
                              {anomaly.type || 'Anomaly'}: {anomaly.description || anomaly.reason}
                            </p>
                            {anomaly.amount && (
                              <p className="text-xs text-orange-600 mt-1">
                                Amount: ₹{Math.abs(anomaly.amount).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Section */}
              <div className="card-cultural p-6">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Icon name="bar-chart" className="text-blue-500" />
                  Financial Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Period:</span>
                    <span className="text-text-primary font-medium">{result.summary?.period || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Income:</span>
                    <span className="text-green-600 font-medium">₹{(result.summary?.income_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Expenses:</span>
                    <span className="text-red-600 font-medium">₹{(result.summary?.expense_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-text-secondary font-medium">Net Amount:</span>
                    <span className={`font-bold ${(result.summary?.net_amount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(result.summary?.net_amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Category Breakdown */}
                {result.summary?.category_breakdown && Object.keys(result.summary.category_breakdown).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-text-primary mb-3">Top Categories</h4>
                    <div className="space-y-2">
                      {Object.entries(result.summary.category_breakdown)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([category, amount]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-text-secondary text-sm">{category}</span>
                            <span className="text-text-primary font-medium text-sm">₹{amount.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
