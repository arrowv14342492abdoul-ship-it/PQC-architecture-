/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, CanonicalRoadmapData } from './types/pqc';
import { INITIAL_ROADMAP } from './data/pqcData';
import { Header } from './components/Header';
import { RoadmapView } from './components/RoadmapView';
import { HandshakeSimulator } from './components/HandshakeSimulator';
import { CertCalculator } from './components/CertCalculator';
import { CryptoAgilityBlueprints } from './components/CryptoAgilityBlueprints';
import { ArchitectConsole } from './components/ArchitectConsole';
import { ComplianceAudit } from './components/ComplianceAudit';
import { AuditReportView } from './components/AuditReportView';
import { ShieldCheck, Lock, ExternalLink, Cpu, GitBranch } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('roadmap');
  const [roadmapData, setRoadmapData] = useState<CanonicalRoadmapData>(INITIAL_ROADMAP);
  const [readinessScore, setReadinessScore] = useState<number>(100);

  useEffect(() => {
    // Attempt to load live server canonical roadmap
    fetch('/api/architect/preset')
      .then(res => res.json())
      .then(data => {
        if (data && data.phases) {
          setRoadmapData(data);
        }
      })
      .catch(err => {
        console.warn('Using local canonical roadmap fixture:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readinessScore={readinessScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmapData}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'audit_report' && (
          <AuditReportView
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'handshake' && (
          <HandshakeSimulator />
        )}

        {activeTab === 'calculator' && (
          <CertCalculator />
        )}

        {activeTab === 'blueprints' && (
          <CryptoAgilityBlueprints />
        )}

        {activeTab === 'console' && (
          <ArchitectConsole />
        )}

        {activeTab === 'audit' && (
          <ComplianceAudit onScoreChange={(score) => setReadinessScore(score)} />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">
              Post-Quantum Cryptography (PQC) Transition Architecture &amp; Crypto-Agility Workbench
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>NIST FIPS 203 (ML-KEM)</span>
            <span>&bull;</span>
            <span>NIST FIPS 204 (ML-DSA)</span>
            <span>&bull;</span>
            <span>NIST FIPS 205 (SLH-DSA)</span>
            <span>&bull;</span>
            <span>TCG PQC Guidelines</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            Mandated Security Baseline: Hybrid Key Exchange (X25519 + ML-KEM-768) &bull; AES-256 Data-at-Rest &bull; RFC 8879 Compression
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Anti-HNDL Shield Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
