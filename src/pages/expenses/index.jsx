import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';

const Expenses = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [items, setItems] = useState([
    { id: 1, date: '2025-06-03', category: 'Travel', note: 'Client visit', amount: 2400 },
    { id: 2, date: '2025-06-10', category: 'Meals', note: 'Team lunch', amount: 1200 },
  ]);

  const total = items.reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <Header />
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(v=>!v)} />
      <main className={`pt-20 transition-all ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-text-primary">Expenses</h1>
            <div className="text-text-secondary">Monthly total: <span className="font-semibold text-text-primary">₹{total.toLocaleString()}</span></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(i => (
              <div key={i.id} className="card-cultural">
                <div className="text-sm text-text-secondary">{i.date}</div>
                <div className="mt-1 font-medium">{i.category}</div>
                <div className="text-sm">{i.note}</div>
                <div className="mt-2 font-semibold">₹{i.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
