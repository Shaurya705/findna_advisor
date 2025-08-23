// Enhanced export utilities for FinDNA Advisor
// This module provides client-side export functionality without external dependencies

export class PDFExporter {
  static generatePDF(data) {
    // Create HTML content for PDF-like styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Portfolio Report - ${data.period}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #6b7280;
          }
          .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 5px;
          }
          .metric-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .metric-label {
            font-weight: 600;
            color: #374151;
          }
          .metric-value {
            font-weight: bold;
            color: #059669;
          }
          .recommendation {
            background: white;
            border-left: 4px solid #3b82f6;
            margin: 15px 0;
            padding: 15px;
            border-radius: 0 8px 8px 0;
          }
          .rec-title {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .rec-priority {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .priority-high { background: #fee2e2; color: #dc2626; }
          .priority-medium { background: #fef3c7; color: #d97706; }
          .priority-low { background: #d1fae5; color: #065f46; }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f3f4f6;
            font-weight: bold;
            color: #374151;
          }
          @media print {
            body { margin: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Portfolio Intelligence Report</div>
          <div class="subtitle">Generated on ${new Date(data.generatedAt).toLocaleDateString()} | Period: ${data.period}</div>
        </div>

        <div class="section">
          <div class="section-title">Portfolio Summary</div>
          <div class="metric-row">
            <span class="metric-label">Total Portfolio Value</span>
            <span class="metric-value">₹${(data.summary.totalValue / 100000).toFixed(2)} Lakhs</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Total Gains</span>
            <span class="metric-value">${data.summary.totalGain}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Invested Amount</span>
            <span class="metric-value">₹${(data.summary.investedAmount / 100000).toFixed(2)} Lakhs</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Today's Change</span>
            <span class="metric-value">₹${data.summary.todayChange} (${data.summary.todayChangePercent}%)</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Asset Allocation</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Percentage</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.allocation.categories.map(cat => `
                <tr>
                  <td>${cat.name}</td>
                  <td>${cat.value}%</td>
                  <td>₹${(cat.amount / 100000).toFixed(2)} L</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Performance Metrics</div>
          <div class="metric-row">
            <span class="metric-label">Returns</span>
            <span class="metric-value">${data.performance.returns}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Alpha Generated</span>
            <span class="metric-value">${data.performance.alpha}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Sharpe Ratio</span>
            <span class="metric-value">${data.performance.sharpeRatio}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Volatility</span>
            <span class="metric-value">${data.performance.volatility}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Maximum Drawdown</span>
            <span class="metric-value">${data.performance.maxDrawdown}%</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Beta</span>
            <span class="metric-value">${data.performance.beta}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">AI Recommendations</div>
          ${data.recommendations.map((rec, index) => `
            <div class="recommendation">
              <div class="rec-title">
                ${index + 1}. ${rec.title}
                <span class="rec-priority priority-${rec.priority}">${rec.priority}</span>
              </div>
              <p>${rec.description}</p>
              <div style="margin-top: 10px;">
                <strong>Impact:</strong> ${rec.impact} | 
                <strong>Potential Gain:</strong> ${rec.potentialGain}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="footer">
          <p>This report was generated by FinDNA Advisor AI system.</p>
          <p>© 2025 FinDNA Advisor. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  }

  static downloadHTML(htmlContent, filename) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static printHTML(htmlContent) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
}

export class ExcelExporter {
  static generateWorkbook(data) {
    // Create a workbook structure that can be opened in Excel
    const workbook = {
      worksheets: {
        'Summary': this.createSummarySheet(data),
        'Asset Allocation': this.createAllocationSheet(data),
        'Performance': this.createPerformanceSheet(data),
        'Recommendations': this.createRecommendationsSheet(data)
      }
    };

    return workbook;
  }

  static createSummarySheet(data) {
    return [
      ['Portfolio Summary', '', ''],
      ['Total Value', '₹' + (data.summary.totalValue / 100000).toFixed(2) + ' L', ''],
      ['Total Gain', data.summary.totalGain + '%', ''],
      ['Invested Amount', '₹' + (data.summary.investedAmount / 100000).toFixed(2) + ' L', ''],
      ['Period', data.period, ''],
      ['Generated', new Date(data.generatedAt).toLocaleDateString(), '']
    ];
  }

  static createAllocationSheet(data) {
    const headers = ['Category', 'Percentage', 'Amount'];
    const rows = data.allocation.categories.map(cat => [
      cat.name,
      cat.value + '%',
      '₹' + (cat.amount / 100000).toFixed(2) + ' L'
    ]);
    
    return [headers, ...rows];
  }

  static createPerformanceSheet(data) {
    return [
      ['Performance Metrics', 'Value', ''],
      ['Returns', data.performance.returns + '%', ''],
      ['Alpha', data.performance.alpha + '%', ''],
      ['Sharpe Ratio', data.performance.sharpeRatio, ''],
      ['Volatility', data.performance.volatility + '%', ''],
      ['Max Drawdown', data.performance.maxDrawdown + '%', ''],
      ['Beta', data.performance.beta, '']
    ];
  }

  static createRecommendationsSheet(data) {
    const headers = ['Priority', 'Title', 'Description', 'Impact', 'Potential Gain'];
    const rows = data.recommendations.map(rec => [
      rec.priority,
      rec.title,
      rec.description,
      rec.impact,
      rec.potentialGain
    ]);
    
    return [headers, ...rows];
  }

  static downloadCSV(data, filename) {
    let csvContent = '';
    
    // Add all sheets to one CSV
    const workbook = this.generateWorkbook(data);
    
    Object.entries(workbook.worksheets).forEach(([sheetName, sheetData]) => {
      csvContent += sheetName + '\n';
      csvContent += '='.repeat(sheetName.length) + '\n';
      
      sheetData.forEach(row => {
        csvContent += row.join(',') + '\n';
      });
      
      csvContent += '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
