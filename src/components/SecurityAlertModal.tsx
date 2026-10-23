import React from 'react';
import { AlertTriangle, ShieldX, Maximize2, Lock } from 'lucide-react';

interface SecurityAlertModalProps {
  isOpen: boolean;
  reason: string;
  violationCount: number;
  maxViolations: number;
  isExamLocked: boolean;
  onDismiss: () => void;
}

export const SecurityAlertModal: React.FC<SecurityAlertModalProps> = ({
  isOpen,
  reason,
  violationCount,
  maxViolations,
  isExamLocked,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const remaining = Math.max(0, maxViolations - violationCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center gap-3 ${isExamLocked ? 'bg-red-700 text-white' : 'bg-red-600 text-white'}`}>
          {isExamLocked ? (
            <ShieldX className="w-6 h-6 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 shrink-0" />
          )}
          <div>
            <h3 className="text-base font-bold tracking-tight">
              {isExamLocked ? 'Exam Locked: Violation Limit Reached' : 'Safe Exam Browser Warning'}
            </h3>
            <p className="text-xs text-red-100">
              Integrity Monitoring Protocol
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-900 leading-relaxed">
            <span className="font-semibold block mb-1">Violation Logged:</span>
            {reason || 'Unauthorized window activity or navigation away from exam interface.'}
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Total Violations</span>
              <span className="text-2xl font-bold font-mono text-red-600 tabular-nums">
                {violationCount} / {maxViolations}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Remaining Warnings</span>
              <span className={`text-2xl font-bold font-mono tabular-nums ${remaining === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {remaining}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
            <p className="font-medium text-slate-800">Safe Exam Browser Rules:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Do not switch tabs, minimize, or navigate to other websites.</li>
              <li>Remain in full-screen mode throughout the Olympiad test.</li>
              <li>Right-click, text selection, and keyboard shortcuts are disabled.</li>
              <li>Reaching {maxViolations} violations will trigger immediate automatic submission.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          {isExamLocked ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700">
              <Lock className="w-4 h-4" />
              Submitting test paper automatically...
            </div>
          ) : (
            <button
              onClick={onDismiss}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              I Understand — Return to Exam Fullscreen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
