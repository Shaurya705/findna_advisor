import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';

const seed = [
  { id: 1, date: '2025-06-01', description: 'Vendor A', amount: 15000, category: 'Supplies' },
  { id: 2, date: '2025-06-08', description: 'Vendor B', amount: 250000, category: 'Equipment' },
  { id: 3, date: '2025-06-15', description: 'Refund', amount: -5000, category: 'Adjustments' },
];

const Transactions = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rows, setRows] = useState(seed);
  const [result, setResult] = useState(null);

  const runAnalyze = async () => {
    try {
  const res = await fetch('/api/analyze', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(rows)
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <Header />
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(v=>!v)} />
      <main className={`pt-20 transition-all ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Transactions</h1>
              <p className="text-sm text-text-secondary mt-1">Ledger view with quick anomaly detection</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" iconName="Upload">Import CSV</Button>
              <Button onClick={runAnalyze} iconName="ScanLine">Analyze</Button>
            </div>
          </div>

          <div className="card-cultural overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-text-secondary">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const flagged = Math.abs(r.amount) > 100000;
                  return (
                  <tr key={r.id} className={`border-t ${idx % 2 ? 'bg-surface-secondary/40' : ''} ${flagged ? 'bg-warning/10' : ''}`}>
                    <td className="py-2 pr-4">{r.date}</td>
                    <td className="py-2 pr-4">{r.description}</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-1 rounded-md text-xs border border-border bg-surface-secondary">{r.category}</span>
                    </td>
                    <td className={`py-2 pr-4 ${flagged ? 'text-warning font-semibold' : ''}`}>₹{r.amount.toLocaleString()}</td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {result && (
            <div className="card-cultural">
              <h3 className="font-medium mb-2">Anomalies</h3>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result.anomalies, null, 2)}</pre>
              <h3 className="font-medium mt-4 mb-2">Summary</h3>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result.summary, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
