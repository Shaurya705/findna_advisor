import React, { useEffect, useState } from 'react';
import Header from 'components/ui/Header';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { uploadAPI } from 'services/api';

const Invoices = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [ocrResults, setOcrResults] = useState(null);
  const [jobId, setJobId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const onUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const data = await uploadAPI.uploadInvoice(file);
      setPreview(data.preview_text || '');
      setJobId(data.job_id || '');
      setStatus({ message: data.message, confidence: data.confidence });
      setActiveTab('preview');
    } catch (e) {
      console.error(e);
      setStatus({ message: 'Upload failed', confidence: 0 });
    } finally {
      setUploading(false);
    }
  };

  // Enhanced status polling for advanced OCR results
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      try {
        const s = await uploadAPI.getProcessingStatus(jobId);
        if (!cancelled) {
          setStatus(s);
          // If we get detailed OCR results, store them
          if (s?.ocr_results || s?.invoice_data) {
            setOcrResults(s);
            setActiveTab('results');
          }
        }
        const st = (s?.status || '').toString().toLowerCase();
        if (st === 'processed' || st === 'verified' || st === 'failed') {
          clearInterval(interval);
          const list = await uploadAPI.listInvoices({ limit: 10 });
          if (!cancelled) setInvoices(list || []);
        }
      } catch {}
    }, 2500);
    return () => { cancelled = true; clearInterval(interval); };
  }, [jobId]);

  // Initial invoices
  useEffect(() => {
    (async () => {
      try {
        const list = await uploadAPI.listInvoices({ limit: 10 });
        setInvoices(list || []);
      } catch {}
    })();
  }, []);

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format confidence as percentage
  const formatConfidence = (confidence) => {
    if (typeof confidence !== 'number') return '0%';
    return `${Math.round(confidence * 100)}%`;
  };

  // Tab navigation component
  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
        activeTab === tab
          ? 'border-primary text-primary bg-primary/5'
          : 'border-transparent text-text-secondary hover:text-text-primary'
      }`}
    >
      <Icon name={icon} size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      <Header />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Advanced Invoice OCR</h1>
              <p className="text-sm text-text-secondary mt-1">Upload invoices for AI-powered OCR processing and data extraction</p>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">Multi-Engine OCR</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="flex border-b border-border">
              <TabButton tab="upload" label="Upload" icon="Upload" />
              <TabButton tab="preview" label="Preview" icon="Eye" />
              <TabButton tab="results" label="Results" icon="FileText" />
              <TabButton tab="history" label="History" icon="Clock" />
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-surface-muted hover:bg-surface-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icon name="CloudUpload" size={48} className="text-text-secondary mb-4" />
                        <p className="mb-2 text-sm text-text-secondary">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-text-muted">PNG, JPG, PDF up to 10MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                      />
                    </label>
                  </div>
                  
                  {file && (
                    <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <Icon name="File" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-primary">{file.name}</span>
                      <span className="text-xs text-text-secondary">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={onUpload} 
                    disabled={!file || uploading} 
                    loading={uploading} 
                    iconName="Zap"
                    className="w-full"
                  >
                    {uploading ? 'Processing with AI OCR...' : 'Upload & Process'}
                  </Button>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="p-6">
                {preview ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">OCR Preview</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary">Confidence:</span>
                        <span className={`text-sm font-semibold ${status?.confidence > 0.8 ? 'text-success' : status?.confidence > 0.6 ? 'text-warning' : 'text-error'}`}>
                          {formatConfidence(status?.confidence)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface-muted rounded-lg p-4 border border-border">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-text-primary max-h-96 overflow-y-auto">
                        {preview}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No preview available. Upload a file first.</p>
                  </div>
                )}
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="p-6">
                {ocrResults ? (
                  <div className="space-y-6">
                    {/* Header with overall confidence */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Extracted Data</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-text-secondary">Overall Confidence: </span>
                          <span className={`font-semibold ${ocrResults.overall_confidence > 0.8 ? 'text-success' : ocrResults.overall_confidence > 0.6 ? 'text-warning' : 'text-error'}`}>
                            {formatConfidence(ocrResults.overall_confidence)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-text-secondary">Engine: </span>
                          <span className="font-semibold text-primary">{ocrResults.ocr_results?.engine_used}</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Information */}
                    {ocrResults.invoice_data && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg border border-border p-4">
                          <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                            <Icon name="FileText" size={16} className="mr-2" />
                            Invoice Details
                          </h4>
                          <div className="space-y-2">
                            {ocrResults.invoice_data.invoice_number && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Invoice Number:</span>
                                <span className="font-medium">{ocrResults.invoice_data.invoice_number}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.date && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Date:</span>
                                <span className="font-medium">{ocrResults.invoice_data.date}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.due_date && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Due Date:</span>
                                <span className="font-medium">{ocrResults.invoice_data.due_date}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.purchase_order && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">PO Number:</span>
                                <span className="font-medium">{ocrResults.invoice_data.purchase_order}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Vendor Information */}
                        <div className="bg-white rounded-lg border border-border p-4">
                          <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                            <Icon name="Building" size={16} className="mr-2" />
                            Vendor Details
                          </h4>
                          <div className="space-y-2">
                            {ocrResults.invoice_data.vendor_name && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Name:</span>
                                <span className="font-medium">{ocrResults.invoice_data.vendor_name}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.phone && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Phone:</span>
                                <span className="font-medium">{ocrResults.invoice_data.phone}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.email && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Email:</span>
                                <span className="font-medium text-sm">{ocrResults.invoice_data.email}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.gstin && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">GSTIN:</span>
                                <span className="font-medium font-mono text-sm">{ocrResults.invoice_data.gstin}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Amount Information */}
                        <div className="bg-white rounded-lg border border-border p-4">
                          <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                            <Icon name="DollarSign" size={16} className="mr-2" />
                            Amount Details
                          </h4>
                          <div className="space-y-2">
                            {ocrResults.invoice_data.subtotal && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(ocrResults.invoice_data.subtotal)}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.tax_amount && (
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Tax:</span>
                                <span className="font-medium">{formatCurrency(ocrResults.invoice_data.tax_amount)}</span>
                              </div>
                            )}
                            {ocrResults.invoice_data.total_amount && (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-text-primary font-semibold">Total:</span>
                                <span className="font-bold text-primary">{formatCurrency(ocrResults.invoice_data.total_amount)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tax Breakdown */}
                        {(ocrResults.invoice_data.igst_amount || ocrResults.invoice_data.cgst_amount || ocrResults.invoice_data.sgst_amount) && (
                          <div className="bg-white rounded-lg border border-border p-4">
                            <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                              <Icon name="Receipt" size={16} className="mr-2" />
                              Tax Breakdown
                            </h4>
                            <div className="space-y-2">
                              {ocrResults.invoice_data.igst_amount && (
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">IGST:</span>
                                  <span className="font-medium">{formatCurrency(ocrResults.invoice_data.igst_amount)}</span>
                                </div>
                              )}
                              {ocrResults.invoice_data.cgst_amount && (
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">CGST:</span>
                                  <span className="font-medium">{formatCurrency(ocrResults.invoice_data.cgst_amount)}</span>
                                </div>
                              )}
                              {ocrResults.invoice_data.sgst_amount && (
                                <div className="flex justify-between">
                                  <span className="text-text-secondary">SGST:</span>
                                  <span className="font-medium">{formatCurrency(ocrResults.invoice_data.sgst_amount)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Line Items */}
                    {ocrResults.invoice_data?.line_items && ocrResults.invoice_data.line_items.length > 0 && (
                      <div className="bg-white rounded-lg border border-border p-4">
                        <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                          <Icon name="List" size={16} className="mr-2" />
                          Line Items ({ocrResults.invoice_data.line_items.length})
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2">Description</th>
                                <th className="text-right py-2">Qty</th>
                                <th className="text-right py-2">Rate</th>
                                <th className="text-right py-2">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ocrResults.invoice_data.line_items.map((item, index) => (
                                <tr key={index} className="border-b border-border/50">
                                  <td className="py-2 pr-4">{item.description}</td>
                                  <td className="text-right py-2">{item.quantity}</td>
                                  <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                                  <td className="text-right py-2 font-medium">{formatCurrency(item.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Processing Report */}
                    {ocrResults.processing_report && (
                      <div className="bg-white rounded-lg border border-border p-4">
                        <h4 className="font-semibold text-text-primary mb-3 flex items-center">
                          <Icon name="BarChart" size={16} className="mr-2" />
                          Processing Report
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">Extraction Confidence:</span>
                            <span className={`font-semibold ${ocrResults.processing_report.extraction_summary?.confidence_level === 'high' ? 'text-success' : ocrResults.processing_report.extraction_summary?.confidence_level === 'medium' ? 'text-warning' : 'text-error'}`}>
                              {ocrResults.processing_report.extraction_summary?.confidence_level || 'Unknown'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">Fields Extracted:</span>
                            <span className="font-semibold">{ocrResults.processing_report.extraction_summary?.fields_extracted || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">OCR Engine:</span>
                            <span className="font-semibold">{ocrResults.processing_report.ocr_summary?.best_engine}</span>
                          </div>
                          
                          {ocrResults.processing_report.recommendations && ocrResults.processing_report.recommendations.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <h5 className="text-sm font-semibold text-blue-800 mb-2">Recommendations:</h5>
                              <ul className="text-sm text-blue-700 space-y-1">
                                {ocrResults.processing_report.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start">
                                    <Icon name="ArrowRight" size={12} className="mt-0.5 mr-2 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Database" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No results available. Upload and process a file first.</p>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="p-6">
                {invoices?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-text-primary">Recent Invoices</h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={async () => {
                          const list = await uploadAPI.listInvoices({ limit: 10 });
                          setInvoices(list || []);
                        }}
                        iconName="RefreshCw"
                      >
                        Refresh
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      {invoices.map((inv) => (
                        <div key={inv.id} className="border border-border rounded-lg p-4 hover:bg-surface-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <Icon name="FileText" size={16} className="text-primary" />
                                <div>
                                  <div className="font-medium text-text-primary">
                                    Invoice #{inv.invoice_number || inv.id}
                                  </div>
                                  <div className="text-sm text-text-secondary">
                                    Amount: {formatCurrency(inv.total_amount || 0)} • Status: {(inv.status || '').toString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={async () => {
                                  try {
                                    const full = await uploadAPI.getInvoice(inv.id);
                                    if (full?.metadata?.ocr_results) {
                                      setOcrResults(full.metadata.ocr_results);
                                      setActiveTab('results');
                                    } else {
                                      setPreview(full?.metadata?.ocr_text || '');
                                      setActiveTab('preview');
                                    }
                                  } catch (e) {
                                    console.error('Failed to load invoice:', e);
                                  }
                                }}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={async () => {
                                  try {
                                    await uploadAPI.deleteInvoice(inv.id);
                                    setInvoices((prev) => prev.filter(p => p.id !== inv.id));
                                  } catch (e) {
                                    console.error('Failed to delete invoice:', e);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Archive" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No invoices found. Upload your first invoice to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* Status Bar */}
            {(jobId || status) && (
              <div className="px-6 py-4 bg-surface-muted border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {jobId && (
                      <>
                        <Icon name="RefreshCw" size={16} className="text-primary animate-spin" />
                        <span className="text-sm text-text-secondary">Job ID: {jobId}</span>
                      </>
                    )}
                  </div>
                  {status && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">
                        Status: {(status.status || status.message || 'processing').toString()}
                      </span>
                      {typeof status.confidence === 'number' && (
                        <span className="text-sm text-text-secondary">
                          Confidence: {formatConfidence(status.confidence)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invoices;
