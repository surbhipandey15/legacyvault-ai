import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, XCircle, ShieldCheck, Play, RotateCcw } from 'lucide-react';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (scenarioId: string) => Promise<any>;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  onRunScenario
}) => {
  const [results, setResults] = useState<{ [id: string]: { pass: boolean; message: string; details: string } }>({});
  const [runningId, setRunningId] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'SCENARIO_1_UNAUTHORIZED_CONTACT',
      name: '1. Unauthorized Category Request',
      description: 'Trusted contact requests category not granted by owner (e.g. Mother requesting Bank Info).',
      expected: 'DENIED with Authorization Error'
    },
    {
      id: 'SCENARIO_2_SECRET_CREDENTIALS',
      name: '2. Secret Credentials Injection',
      description: 'Attempting to store ATM PINs, UPI PINs, CVVs or passwords.',
      expected: 'REJECTED / Stripped before storage'
    },
    {
      id: 'SCENARIO_3_SILENCE_AS_CONSENT',
      name: '3. Silence as Consent Test',
      description: 'Owner does not respond to pending access request.',
      expected: 'Access remains DENIED (No timeout auto-approval)'
    },
    {
      id: 'SCENARIO_4_INACTIVITY_AS_DEATH',
      name: '4. Inactivity alone = Death Test',
      description: 'Account inactive for 180 days.',
      expected: 'State stays ACTIVE (Inactivity never implies death)'
    },
    {
      id: 'SCENARIO_5_AI_AUTO_CONFIRM',
      name: '5. Unverified AI Field Test',
      description: 'Reading AI extracted fields without human verification.',
      expected: 'Marked as Suggestion (Requires Human-in-the-Loop)'
    },
    {
      id: 'SCENARIO_6_UNVERIFIED_DEATH',
      name: '6. Unverified Death Request',
      description: 'Claiming death access without valid death certificate/proof.',
      expected: 'DENIED (Proof required)'
    },
    {
      id: 'SCENARIO_7_REVOKED_CONTACT',
      name: '7. Revoked Contact Request',
      description: 'Contact whose access was revoked attempts request.',
      expected: 'DENIED (Permission immediately terminated)'
    },
    {
      id: 'SCENARIO_8_DENY_BY_DEFAULT',
      name: '8. Deny by Default Guarantee',
      description: 'Requesting document with no permissions explicit.',
      expected: 'DENIED by default'
    },
    {
      id: 'SCENARIO_9_PROMPTING_BANK_PIN',
      name: '9. UI Banking Secret Check',
      description: 'UI input field requesting confidential PIN/OTP.',
      expected: 'BLOCKED by security policy'
    },
    {
      id: 'SCENARIO_10_AUDIT_LOG_TAMPER',
      name: '10. Audit Log Tampering',
      description: 'Attempting to delete or edit immutable audit records.',
      expected: 'DENIED (Read-only immutable logs)'
    },
    {
      id: 'SCENARIO_11_ADMIN_PRIVACY',
      name: '11. Admin Raw Document Snooping',
      description: 'System Admin trying to read owner vault files directly.',
      expected: 'DENIED (Admin cannot decrypt user data)'
    },
    {
      id: 'SCENARIO_12_HUMAN_OVERRIDE',
      name: '12. Human-in-the-Loop Override',
      description: 'User modifies AI extracted value before confirming.',
      expected: 'User value overrides AI suggestion'
    },
    {
      id: 'SCENARIO_13_DATA_EXPORT',
      name: '13. User Data Ownership Export',
      description: 'User requests complete JSON vault export.',
      expected: 'SUCCESS (Complete portable JSON payload)'
    }
  ];

  const handleRun = async (id: string) => {
    setRunningId(id);
    const res = await onRunScenario(id);
    setRunningId(null);
    setResults(prev => ({ ...prev, [id]: res }));
  };

  const handleRunAll = async () => {
    for (const sc of scenarios) {
      setRunningId(sc.id);
      const res = await onRunScenario(sc.id);
      setResults(prev => ({ ...prev, [sc.id]: res }));
    }
    setRunningId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/80 rounded-2xl max-w-3xl w-full p-6 shadow-xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-lg mb-1">
          <Sparkles className="w-5 h-5" />
          <span>LegacyVault AI — 13 Threat Scenarios Test Harness</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mb-6">
          Validate system resilience against access violations, credential leaks, and privacy threats.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleRunAll}
            disabled={runningId !== null}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-sm shadow-indigo-200"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run All 13 Threat Tests</span>
          </button>
        </div>

        {/* Scenarios List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {scenarios.map(sc => {
            const res = results[sc.id];
            const isRunning = runningId === sc.id;

            return (
              <div
                key={sc.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1 max-w-md">
                  <div className="text-xs font-bold text-slate-900">{sc.name}</div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{sc.description}</p>
                  <div className="text-[10px] text-indigo-600 font-extrabold">Expected: {sc.expected}</div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {res && (
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center space-x-1 ${
                        res.pass
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-rose-50 text-rose-700 border-rose-200/80'
                      }`}>
                        {res.pass ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{res.pass ? 'PASSED' : 'FAILED'}</span>
                      </span>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5 max-w-[160px] truncate">
                        {res.message}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleRun(sc.id)}
                    disabled={isRunning}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-600 hover:bg-indigo-50 transition-colors border border-slate-200 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {isRunning ? 'Running...' : 'Run Test'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
