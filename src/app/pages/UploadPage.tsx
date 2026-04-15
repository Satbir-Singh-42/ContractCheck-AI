import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, X, AlertCircle, Info, CheckCircle, Shield, Lock, Zap } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';

const ACCEPTED = ['.pdf', '.docx', '.doc', '.txt'];
const MAX_MB = 10;

type Stage = 'idle' | 'uploading' | 'done';

export function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return `File type not supported. Use: ${ACCEPTED.join(', ')}`;
    if (f.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB}MB.`;
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError('');
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    setStage('uploading');
    setProgress(0);

    // Simulated upload + processing progress
    const intervals = [10, 30, 55, 75, 90, 100];
    for (const p of intervals) {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      setProgress(p);
    }

    setStage('done');
    // Navigate to a mock process ID
    await new Promise(r => setTimeout(r, 400));
    navigate('/process/proc_' + Date.now());
  };

  const remaining = user ? user.uploadsLimit - user.uploadsUsed : 0;
  const canUpload = remaining > 0;

  return (
    <AppLayout>
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Upload Contract</h1>
          <p className="text-sm text-slate-400">
            Upload a contract to analyze it against Indian regulations — DPDP Act 2023, GST rules, Labour Laws & Contract Act.
          </p>
        </div>

        {!canUpload && (
          <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <AlertCircle size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Upload limit reached</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                You've used all {user?.uploadsLimit} free analyses. <button onClick={() => navigate('/pricing')} className="underline hover:no-underline">Upgrade to Pro</button> for more.
              </p>
            </div>
          </div>
        )}

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && canUpload && inputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl transition-all',
            dragOver && canUpload ? 'border-blue-500 bg-blue-500/5' : 'border-white/10',
            !file && canUpload ? 'cursor-pointer hover:border-white/20 hover:bg-white/[0.02]' : '',
            !canUpload ? 'opacity-50 cursor-not-allowed' : ''
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="hidden"
            disabled={!canUpload}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {!file ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Upload size={28} className="text-slate-400" />
              </div>
              <p className="font-semibold text-white mb-1">Drop your contract here</p>
              <p className="text-sm text-slate-400 mb-4">or click to browse</p>
              <div className="flex flex-wrap justify-center gap-2">
                {ACCEPTED.map(ext => (
                  <span key={ext} className="text-[11px] uppercase px-2 py-0.5 rounded bg-white/5 text-slate-500 font-mono">{ext}</span>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-3">Max {MAX_MB}MB</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {stage === 'idle' && (
                  <button
                    onClick={e => { e.stopPropagation(); setFile(null); setProgress(0); setStage('idle'); }}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X size={15} className="text-slate-400" />
                  </button>
                )}
              </div>

              {stage !== 'idle' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{stage === 'done' ? 'Upload complete!' : 'Uploading & extracting text...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300', stage === 'done' ? 'bg-emerald-500' : 'bg-blue-500')}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-start gap-3 bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-4">
            <Shield size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">4 Indian Laws</strong><br />
              DPDP Act, GST, Contract Act, Labour Laws
            </div>
          </div>
          <div className="flex items-start gap-3 bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-4">
            <Lock size={16} className="text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Secure Processing</strong><br />
              Files processed in-memory, never stored
            </div>
          </div>
          <div className="flex items-start gap-3 bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-4">
            <Zap size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Under 30 Seconds</strong><br />
              AI-powered instant analysis
            </div>
          </div>
        </div>

        {/* Usage Indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{remaining} of {user?.uploadsLimit} analyses remaining this month</span>
          <button onClick={() => navigate('/pricing')} className="text-blue-400 hover:text-blue-300 transition-colors">Need more?</button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || stage !== 'idle' || !canUpload}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
        >
          {stage === 'uploading' ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
          ) : stage === 'done' ? (
            <><CheckCircle size={18} /> Redirecting to analysis...</>
          ) : (
            <><Upload size={18} /> Analyze Contract</>
          )}
        </button>
      </div>
    </AppLayout>
  );
}