import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Sidebar from 'components/ui/Sidebar';
import Button from 'components/ui/Button';

const Invoices = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [jobId, setJobId] = useState('');
  const [uploading, setUploading] = useState(false);

  const onUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploading(true);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setPreview(data.preview_text || '');
      setJobId(data.job_id || '');
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Header />
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(v=>!v)} />
      <main className={`pt-20 transition-all ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Invoices</h1>
              <p className="text-sm text-text-secondary mt-1">Upload invoices for OCR preview and reconciliation</p>
            </div>
          </div>

          <div className="card-cultural">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input aria-label="Select invoice file" type="file" onChange={(e)=> setFile(e.target.files?.[0] || null)} className="input-cultural" />
              <Button onClick={onUpload} disabled={!file || uploading} loading={uploading} iconName="UploadCloud">
                Upload & OCR
              </Button>
            </div>
            {jobId && (
              <p className="text-sm text-text-secondary mt-3">Job: {jobId}</p>
            )}
            {preview && (
              <div className="mt-4 p-4 bg-surface-muted rounded-lg border border-border">
                <div className="text-sm text-text-secondary mb-2">OCR Preview</div>
                <pre className="whitespace-pre-wrap text-sm">{preview}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invoices;
