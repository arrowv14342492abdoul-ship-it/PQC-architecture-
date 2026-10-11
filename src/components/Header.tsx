import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Cpu, 
  Network, 
  Calculator, 
  Code2, 
  Bot, 
  CheckCircle2, 
  Lock,
  Layers
} from 'lucide-react';
import { TabType } from '../types/pqc';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  readinessScore: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  readinessScore 
}) => {
  const tabs = [
    { id: 'roadmap', label: 'Transition Roadmap', icon: Layers, badge: 'NIST & TCG' },
    { id: 'audit_report', label: 'Audit Report & CBOM', icon: ShieldAlert, badge: 'Mosca & Assets' },
    { id: 'handshake', label: 'TLS Handshake Inspector', icon: Network, badge: 'Hybrid Flow' },
    { id: 'calculator', label: 'FIPS 204 Cert & MTU Calculator', icon: Calculator, badge: 'Latency Model' },
    { id: 'blueprints', label: 'Crypto-Agility Architecture', icon: Code2, badge: 'Envoy / Go / Python' },
    { id: 'console', label: 'AI Architect Consultation', icon: Bot, badge: 'T=0.0' },
    { id: 'audit', label: 'TCG Readiness Audit', icon: CheckCircle2, badge: `${readinessScore}%` },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Cleared Architect Security Banner */}
      <div className="bg-linear-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 px-4 py-2 border-b border-emerald-500/20 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CLEARED // SENIOR CYBERSECURITY ARCHITECT
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            TCG PQC Readiness &bull; NIST FIPS 203 / 204 / 205 Standards
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">HNDL Threat Shield:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[11px] border border-amber-500/20">
              <Lock className="w-3 h-3 text-amber-400" />
              MANDATING X25519+ML-KEM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Enterprise PQC Score:</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-400/50 flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {readinessScore}% {readinessScore === 100 && '(OPTIMAL)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main App Title & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                PQC Architect &amp; Crypto-Agility Platform
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.0 FIPS-Aligned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Microservices TLS 1.2 to Quantum-Resistant State Transition &bull; Hybrid Key Exchange &bull; FIPS 204 Bloat Mitigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs text-slate-400 font-mono">CRYPTOGRAPHIC TARGET</span>
            <span className="text-xs font-semibold text-emerald-300 font-mono">
              X25519 + ML-KEM-768 &bull; AES-256-GCM
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/60" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`group whitespace-nowrap py-2.5 px-3.5 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive 
                      ? 'bg-indigo-700 text-indigo-100' 
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
