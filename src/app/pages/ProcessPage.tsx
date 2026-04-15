import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { apiGetAnalysisStatus } from '../../lib/api';
import { useTopNavigate } from '../hooks/useTopNavigate';

const STEPS = [
  'Extracting text from document',
  'Detecting contract clauses',
  'Running compliance checks (DPDP, GST, Labour)',
  'Scoring risk levels per clause',
  'Generating AI fix suggestions',
  'Building your report',
];

type AnalysisStatus = 'polling' | 'completed' | 'failed';

export function ProcessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useTopNavigate();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<AnalysisStatus>('polling');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Drives the visual step animation independently for smooth UX
  const [visibleStep, setVisibleStep] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    let stepTimer: ReturnType<typeof setTimeout>;
    let pollTimer: ReturnType<typeof setTimeout>;

    // Animate visual steps (UX layer — runs independently of API timing)
    const animateStep = (step: number) => {
      if (cancelled || step > STEPS.length) return;
      setVisibleStep(step);
      stepTimer = setTimeout(() => animateStep(step + 1), 1400);
    };
    animateStep(0);

    // Real API polling loop
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await apiGetAnalysisStatus(id);
        if (cancelled) return;

        setProgress(res.progress_percent);

        if (res.status === 'completed') {
          clearTimeout(stepTimer);
          setVisibleStep(STEPS.length);
          setProgress(100);
          setStatus('completed');
          pollTimer = setTimeout(() => {
            if (!cancelled) navigate(`/result/${id}`);
          }, 900);
        } else if (res.status === 'failed') {
          clearTimeout(stepTimer);
          setStatus('failed');
          setErrorMsg(res.error_message);
        } else {
          // Still processing — re-poll in 2s
          pollTimer = setTimeout(poll, 2000);
        }
      } catch {
        // Network hiccup — retry in 3s
        if (!cancelled) pollTimer = setTimeout(poll, 3000);
      }
    };

    // Start first poll after a short delay to let the visual kick in
    pollTimer = setTimeout(poll, 600);

    return () => {
      cancelled = true;
      clearTimeout(stepTimer);
      clearTimeout(pollTimer);
    };
  }, [id, navigate]);

  const isDone = status === 'completed';
  const isFailed = status === 'failed';
  // Show the higher of API progress vs visual-step progress for a smooth bar
  const displayProgress = isDone
    ? 100
    : Math.max(progress, Math.round((visibleStep / STEPS.length) * 100));

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[80vh] flex items-center justify-center px-4"
      >
        <div className="w-full max-w-[520px]">

          {/* Circular Progress */}
          <div className="flex justify-center mb-10">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" strokeWidth="4" className="stroke-white/10" fill="none" />
                <circle
                  cx="48" cy="48" r="40" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - displayProgress / 100)}`}
                  strokeLinecap="round"
                  className={cn(
                    'transition-all duration-700',
                    isFailed ? 'stroke-red-500' :
                    isDone  ? 'stroke-emerald-500' : 'stroke-blue-500'
                  )}
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isFailed ? (
                  <XCircle size={32} className="text-red-400" />
                ) : isDone ? (
                  <CheckCircle size={32} className="text-emerald-400" />
                ) : (
                  <span className="text-xl font-bold text-white">{displayProgress}%</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {isFailed ? 'Analysis Failed' : isDone ? 'Analysis Complete!' : 'Analyzing your contract...'}
            </h1>
            <p className="text-sm text-slate-400">
              {isFailed
                ? (errorMsg || 'Something went wrong. Please try again.')
                : isDone
                ? 'Redirecting you to your report...'
                : 'Our AI is reviewing your document against Indian regulations.'}
            </p>
            {id && <p className="text-xs text-slate-600 mt-2 font-mono">Job ID: {id}</p>}
          </div>

          {/* Step List */}
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const isDoneStep = i < visibleStep || isDone;
              const isActive = i === visibleStep && !isDone && !isFailed;

              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300',
                    isDoneStep ? 'bg-emerald-500/5 border-emerald-500/20' :
                    isActive   ? 'bg-blue-500/10 border-blue-500/30' :
                                 'bg-[#0B0B0E] border-white/[0.04] opacity-40'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                    isDoneStep ? 'bg-emerald-500' : isActive ? 'bg-blue-500' : 'bg-white/10'
                  )}>
                    {isDoneStep ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  <span className={cn(
                    'text-sm',
                    isDoneStep ? 'text-emerald-300' : isActive ? 'text-white font-medium' : 'text-slate-500'
                  )}>
                    {step}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex gap-0.5">
                      {[0, 1, 2].map(d => (
                        <div key={d} className="w-1 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isFailed && (
            <button
              onClick={() => navigate('/upload')}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              ← Try Again
            </button>
          )}

        </div>
      </motion.div>
    </AppLayout>
  );
}
