// Portfolio API service for FinDNA
import apiClient from './api';
import { PDFExporter, ExcelExporter } from '../utils/exportUtils';

// Portfolio API endpoints
export const portfolioAPI = {
  // Get portfolio summary data
  getPortfolioSummary: async (period = '1Y') => {
    try {
      // Mock API response for demo
      return {
        totalValue: 10000000,
        totalGain: 26.3,
        todayChange: 45000,
        todayChangePercent: 0.45,
        investedAmount: 7500000,
        monthlyInvestment: 25000,
        period: period,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      throw error;
    }
  },

  // Get asset allocation data
  getAssetAllocation: async () => {
    try {
      // Mock API response for demo
      return {
        categories: [
          { name: 'Equity', value: 45, amount: 4500000 },
          { name: 'Debt', value: 25, amount: 2500000 },
          { name: 'ELSS', value: 15, amount: 1500000 },
          { name: 'PPF/EPF', value: 10, amount: 1000000 },
          { name: 'Gold', value: 5, amount: 500000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching asset allocation:', error);
      throw error;
    }
  },

  // Get portfolio performance metrics
  getPerformanceMetrics: async (period = '1Y') => {
    try {
      // Mock API response for demo
      return {
        returns: 26.3,
        alpha: 6.2,
        sharpeRatio: 1.42,
        volatility: 14.2,
        maxDrawdown: 8.5,
        beta: 0.92,
        period: period
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  },

  // Get AI recommendations for portfolio
  getRecommendations: async () => {
    try {
      // Mock API response for demo
      return {
        recommendations: [
          {
            id: 1,
            type: 'rebalance',
            priority: 'high',
            title: 'Reduce IT Sector Exposure',
            description: 'Your IT sector exposure is 20% which is high given current market conditions.',
            impact: '15% risk reduction',
            potentialGain: '₹45,000'
          },
          {
            id: 2,
            type: 'tax',
            priority: 'medium',
            title: 'Tax-Loss Harvesting Opportunity',
            description: 'Consider selling underperforming assets to offset capital gains.',
            impact: '₹12,000 tax savings',
            potentialGain: '₹12,000'
          },
          {
            id: 3,
            type: 'invest',
            priority: 'medium',
            title: 'Increase SIP for Better Dollar Cost Averaging',
            description: 'Market volatility presents an opportunity to benefit from SIP averaging.',
            impact: 'Long-term growth',
            potentialGain: 'Estimated ₹75,000 over 5 years'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Export portfolio report in various formats
  exportPortfolioReport: async (format = 'pdf', period = '1Y', includeRecommendations = true) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get the necessary data for the report
      const summary = await portfolioAPI.getPortfolioSummary(period);
      const allocation = await portfolioAPI.getAssetAllocation();
      const performance = await portfolioAPI.getPerformanceMetrics(period);
      const recommendations = includeRecommendations ? await portfolioAPI.getRecommendations() : null;
      
      // Combine data for the report
      const reportData = {
        summary,
        allocation,
        performance,
        recommendations: recommendations?.recommendations || [],
        generatedAt: new Date().toISOString(),
        format,
        period
      };
      
      if (format === 'csv') {
        // Create CSV content using enhanced exporter
        ExcelExporter.downloadCSV(reportData, `portfolio_report_${period}.csv`);
      } else if (format === 'excel') {
        // For Excel, create a structured CSV that can be opened in Excel
        const workbook = ExcelExporter.generateWorkbook(reportData);
        const csvContent = convertWorkbookToCSV(workbook);
        downloadFile(csvContent, `portfolio_report_${period}.csv`, 'text/csv');
      } else {
        // PDF format - create a beautiful HTML file that can be printed to PDF
        const htmlContent = PDFExporter.generatePDF(reportData);
        PDFExporter.downloadHTML(htmlContent, `portfolio_report_${period}.html`);
        
        // Also open print dialog for direct PDF creation
        setTimeout(() => {
          PDFExporter.printHTML(htmlContent);
        }, 500);
      }
      
      return {
        success: true,
        message: `Portfolio report exported successfully in ${format.toUpperCase()} format`,
        fileName: `portfolio_report_${period}.${format === 'csv' ? 'csv' : format === 'excel' ? 'json' : 'txt'}`,
        reportData
      };
    } catch (error) {
      console.error(`Error exporting portfolio report as ${format}:`, error);
      throw error;
    }
  }
};

// Helper function to convert workbook to CSV
function convertWorkbookToCSV(workbook) {
  let csvContent = '';
  
  Object.entries(workbook.worksheets).forEach(([sheetName, sheetData]) => {
    csvContent += `"${sheetName}"\n`;
    csvContent += '='.repeat(sheetName.length) + '\n';
    
    sheetData.forEach(row => {
      const escapedRow = row.map(cell => `"${cell}"`);
      csvContent += escapedRow.join(',') + '\n';
    });
    
    csvContent += '\n';
  });
  
  return csvContent;
}

// Enhanced download function
function downloadFile(content, filename, mimeType) {
  const dataBlob = new Blob([content], { type: mimeType });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = filename;
  
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  URL.revokeObjectURL(downloadLink.href);
}

export default portfolioAPI;
