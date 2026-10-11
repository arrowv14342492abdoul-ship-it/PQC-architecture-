import React, { useState } from 'react';
import { AUDIT_CHECKLIST } from '../data/pqcData';
import { AuditItem } from '../types/pqc';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Filter, 
  Download, 
  BarChart3, 
  Layers, 
  Check
} from 'lucide-react';

interface ComplianceAuditProps {
  onScoreChange?: (score: number) => void;
}

export const ComplianceAudit: React.FC<ComplianceAuditProps> = ({ onScoreChange }) => {
  const [items, setItems] = useState<AuditItem[]>(AUDIT_CHECKLIST);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const passedCount = items.filter(i => i.status === 'passed').length;
  const inProgressCount = items.filter(i => i.status === 'in_progress').length;
  const failedCount = items.filter(i => i.status === 'failed').length;
  const notStartedCount = items.filter(i => i.status === 'not_started').length;

  const readinessScore = Math.round((passedCount / items.length) * 100);

  const handleStatusToggle = (id: string, newStatus: AuditItem['status']) => {
    const updated = items.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setItems(updated);
    const newPassed = updated.filter(i => i.status === 'passed').length;
    const newScore = Math.round((newPassed / updated.length) * 100);
    if (onScoreChange) onScoreChange(newScore);
  };

  const handleEnforceAll = () => {
    const updated = items.map(item => ({ ...item, status: 'passed' as const }));
    setItems(updated);
    if (onScoreChange) onScoreChange(100);
  };

  const filteredItems = items.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleExportAudit = () => {
    const data = {
      auditTimestamp: new Date().toISOString(),
      governingStandards: "TCG PQC Readiness Guidelines & NIST FIPS 203/204/205",
      readinessScore: `${readinessScore}%`,
      breakdown: { passed: passedCount, inProgress: inProgressCount, failed: failedCount, notStarted: notStartedCount },
      checklist: items,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TCG-PQC-Readiness-Audit-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Readiness Meter */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                TCG &amp; NIST AUDIT MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Level 3 Post-Quantum Assurance
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              TCG PQC Readiness &amp; Cryptographic Compliance Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify enterprise microservices compliance across Discovery, Data-in-Transit (Hybrid TLS), Data-at-Rest (AES-256), and Crypto-Agility.
            </p>
          </div>

          {/* Readiness Score Widget */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Enterprise PQC Score
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5 flex items-center justify-end gap-1.5">
                <span>{readinessScore}%</span>
                {readinessScore === 100 && (
                  <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    FULL PQC
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">
                {passedCount} of {items.length} Mandates Met
              </div>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-slate-700 flex items-center justify-center relative overflow-hidden bg-slate-900">
              <div 
                className="absolute inset-0 bg-emerald-500/20" 
                style={{ clipPath: `inset(${100 - readinessScore}% 0 0 0)` }}
              />
              <ShieldCheck className="w-7 h-7 text-emerald-400 relative z-10" />
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                onClick={handleEnforceAll}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-sm"
                title="Enforce 100% Quantum Hardened State"
              >
                <Check className="w-3.5 h-3.5" />
                <span>100% Enforce</span>
              </button>

              <button
                onClick={handleExportAudit}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition cursor-pointer flex items-center justify-center"
                title="Export Audit JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/30">
            <div className="text-[11px] text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Passed &amp; Enforced</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {passedCount}
            </div>
          </div>

          <div className="p-3 bg-indigo-950/20 rounded-lg border border-indigo-500/30">
            <div className="text-[11px] text-indigo-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>In Transition</span>
            </div>
            <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5">
              {inProgressCount}
            </div>
          </div>

          <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-500/30">
            <div className="text-[11px] text-rose-300 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Failed / Non-Compliant</span>
            </div>
            <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
              {failedCount}
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Not Scheduled</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-300 mt-0.5">
              {notStartedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-semibold">Filter Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white cursor-pointer"
          >
            <option value="all">All Domains ({items.length})</option>
            <option value="discovery">Discovery &amp; CBOM</option>
            <option value="transit">Data-in-Transit (TLS)</option>
            <option value="rest">Data-at-Rest &amp; KMS</option>
            <option value="agility">Crypto-Agility &amp; SPI</option>
            <option value="governance">Governance &amp; Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="passed">Passed</option>
            <option value="in_progress">In Progress</option>
            <option value="failed">Failed</option>
            <option value="not_started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 rounded-xl border border-slate-800 p-4.5 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-indigo-400 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Ref: {item.nistReference}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Status Button Actions */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <button
                onClick={() => handleStatusToggle(item.id, 'passed')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  item.status === 'passed'
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Mark Passed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Passed</span>
              </button>

              <button
                onClick={() => handleStatusToggle(item.id, 'in_progress')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  item.status === 'in_progress'
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Mark In Progress"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>In Progress</span>
              </button>

              <button
                onClick={() => handleStatusToggle(item.id, 'failed')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  item.status === 'failed'
                    ? 'bg-rose-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Mark Failed"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Failed</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
