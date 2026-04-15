import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { label: 'Extracting text from document', duration: 1200 },
  { label: 'Detecting contract clauses', duration: 1500 },
  { label: 'Running compliance checks (DPDP, GST, Labour)', duration: 2000 },
  { label: 'Scoring risk levels per clause', duration: 1200 },
  { label: 'Generating AI fix suggestions', duration: 1800 },
  { label: 'Building your report', duration: 800 },
];

export function ProcessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let step = 0;

    const runStep = () => {
      if (step >= STEPS.length) {
        setDone(true);
        setTimeout(() => navigate('/result/rep_12345'), 800);
        return;
      }
      setCurrentStep(step);
      setTimeout(() => {
        setCompleted(prev => [...prev, step]);
        step++;
        runStep();
      }, STEPS[step].duration);
    };

    const t = setTimeout(runStep, 400);
    return () => clearTimeout(t);
  }, [navigate]);

  const progress = Math.round((completed.length / STEPS.length) * 100);

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-[520px]">
          {/* Animated Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" strokeWidth="4" className="stroke-white/10" fill="none" />
                <circle
                  cx="48" cy="48" r="40" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className={cn('transition-all duration-700', done ? 'stroke-emerald-500' : 'stroke-blue-500')}
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {done ? (
                  <CheckCircle size={32} className="text-emerald-400" />
                ) : (
                  <span className="text-xl font-bold text-white">{progress}%</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {done ? 'Analysis Complete!' : 'Analyzing your contract...'}
            </h1>
            <p className="text-sm text-slate-400">
              {done ? 'Redirecting you to your report...' : 'Our AI is reviewing your document against Indian regulations.'}
            </p>
            {id && <p className="text-xs text-slate-600 mt-2 font-mono">Job ID: {id}</p>}
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const isDone = completed.includes(i);
              const isActive = currentStep === i && !isDone;

              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300',
                    isDone ? 'bg-emerald-500/5 border-emerald-500/20' :
                    isActive ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-[#0B0B0E] border-white/[0.04] opacity-40'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                    isDone ? 'bg-emerald-500' : isActive ? 'bg-blue-500' : 'bg-white/10'
                  )}>
                    {isDone ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  <span className={cn(
                    'text-sm',
                    isDone ? 'text-emerald-300' : isActive ? 'text-white font-medium' : 'text-slate-500'
                  )}>
                    {step.label}
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
        </div>
      </div>
    </AppLayout>
  );
}
