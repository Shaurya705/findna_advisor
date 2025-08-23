import React, { useMemo, useState } from 'react';
import Header from 'components/ui/Header';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';
import Button from 'components/ui/Button';

const sample = [
  { name: 'Jan', revenue: 100, expense: 60 },
  { name: 'Feb', revenue: 120, expense: 70 },
  { name: 'Mar', revenue: 115, expense: 65 },
  { name: 'Apr', revenue: 130, expense: 80 },
];

const AnalyticsReports = () => {
  const [series, setSeries] = useState(sample);
  const [forecast, setForecast] = useState([]);

  const net = useMemo(() => series.map(p => ({ name: p.name, net: p.revenue - p.expense })), [series]);

  const runForecast = async () => {
    try {
  const res = await fetch('/api/forecast', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ horizon: 6 })});
      const data = await res.json();
      setForecast(data.series || []);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Analytics & Reports</h1>
              <p className="text-sm text-text-secondary mt-1">Trends, performance and baseline forecasts</p>
            </div>
            <Button onClick={runForecast} iconName="TrendingUp">Forecast</Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-cultural h-72">
              <div className="text-sm text-text-secondary mb-2">Revenue vs Expense</div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="colRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" /><YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#1E40AF" fillOpacity={1} fill="url(#colRev)" />
                  <Area type="monotone" dataKey="expense" stroke="#EA580C" fillOpacity={1} fill="url(#colExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card-cultural h-72">
              <div className="text-sm text-text-secondary mb-2">Net Profit</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={net}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" /><YAxis />
                  <Tooltip />
                  <Bar dataKey="net" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {forecast.length > 0 && (
            <div className="card-cultural h-72">
              <div className="text-sm text-text-secondary mb-2">Forecast (baseline)</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" /><YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsReports;
