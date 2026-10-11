import React, { useState } from 'react';
import { 
  CanonicalRoadmapData 
} from '../types/pqc';
import { 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Download, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Server,
  Layers,
  Sliders,
  AlertTriangle,
  FileCode2
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: CanonicalRoadmapData;
  onNavigateToTab: (tab: any) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ 
  roadmap, 
  onNavigateToTab 
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('phase-3');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    executive: true,
    threat: true,
    mitigation: true,
    agility: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedPhase = roadmap.phases.find(p => p.id === selectedPhaseId) || roadmap.phases[0];

  const handleExportMarkdown = () => {
    let md = `# ${roadmap.title}\n\n`;
    md += `**Classification**: ${roadmap.classification}\n`;
    md += `**Version**: ${roadmap.version}\n\n`;
    md += `## Executive Summary\n\n${roadmap.executiveSummary}\n\n`;
    md += `## Standards Compliance\n\n`;
    roadmap.standardsCompliance.forEach(s => { md += `- ${s}\n`; });
    md += `\n## Threat Model & Quantum Vectors\n\n`;
    md += `- **Primary Vector**: ${roadmap.threatModel.primaryVector}\n`;
    md += `- **Asymmetric Key Exchange**: ${roadmap.threatModel.quantumVulnerability.asymmetricKeyExchange}\n`;
    md += `- **Digital Signatures**: ${roadmap.threatModel.quantumVulnerability.digitalSignatures}\n`;
    md += `- **Symmetric Encryption**: ${roadmap.threatModel.quantumVulnerability.symmetricEncryption}\n\n`;
    md += `## Phased Implementation Roadmap\n\n`;
    roadmap.phases.forEach((p, idx) => {
      md += `### ${idx + 1}. ${p.name} (${p.timeline})\n\n`;
      md += `**Objectives**:\n`;
      p.objectives.forEach(o => { md += `- ${o}\n`; });
      md += `\n**Deliverables**:\n`;
      p.deliverables.forEach(d => { md += `- ${d}\n`; });
      md += `\n`;
    });
    md += `## FIPS 204 (ML-DSA) Certificate Bloat Mitigations\n\n`;
    md += `${roadmap.certificateMitigationDetails.problemStatement}\n\n`;
    roadmap.certificateMitigationDetails.mitigationMatrix.forEach(m => {
      md += `### Strategy: ${m.strategy}\n`;
      md += `- **Mechanism**: ${m.mechanism}\n`;
      md += `- **Impact**: ${m.impact}\n`;
      md += `- **Deployment**: ${m.deploymentLocation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PQC-Transition-Architecture-Roadmap.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Card */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-semibold">
                NIST &amp; TCG ALIGNED ROADMAP
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-semibold">
                MANDATORY HYBRID: X25519 + ML-KEM-768
              </span>
            </div>

            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Full Architecture (.md)</span>
            </button>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {roadmap.title}
          </h2>

          <p className="mt-3 text-slate-300 text-sm lg:text-base leading-relaxed max-w-5xl">
            {roadmap.executiveSummary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Baseline Ingress</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">TLS 1.2 (Deprecated)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">RSA / ECDHE vulnerable</div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Target Key Exchange</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">X25519 + ML-KEM-768</div>
              <div className="text-[11px] text-slate-500 mt-0.5">FIPS 203 Hybrid (0x11ec)</div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Cert Size Bloat Control</div>
              <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">RFC 8879 Brotli</div>
              <div className="text-[11px] text-slate-500 mt-0.5">15.8 KB &rarr; 7.1 KB (45% saved)</div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Data-at-Rest Standard</div>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">AES-256 / ChaCha20</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Grover 128-bit quantum margin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Landscape & Governing Standards Collapsible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Matrix */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Quantum Threat Model &amp; Shor/Grover Vectors</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              HNDL Critical Priority
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-300 text-sm">
                  1. Harvest Now, Decrypt Later (HNDL)
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                  ACTIVE TODAY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Adversaries passively intercept and store encrypted TLS 1.2 microservice traffic across public internet and cloud backbones. Once a Cryptanalytically Relevant Quantum Computer (CRQC) is constructed, Shor's algorithm will crack the archived ephemeral ECDHE/RSA keys, exposing all historical credentials, PII, and financial payloads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Shor's Algorithm Impact
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Solves discrete logs and integer factorization in polynomial time. Permanently breaks RSA, Diffie-Hellman, ECDH (P-256), and ECDSA.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Grover's Algorithm Impact
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Provides quadratic speedup for brute-force symmetric search. AES-128 drops to 64-bit entropy (insecure). AES-256 remains resilient at 128-bit quantum security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Governing Standards */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Governing Standards</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {roadmap.standardsCompliance.map((std, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-800/40 p-2 rounded border border-slate-800">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{std}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigateToTab('audit')}
              className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View TCG Readiness Audit Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Six-Phase Interactive Transition Roadmap */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Enterprise PQC Transition Phase Navigator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any phase below to inspect deep objectives, architectural deliverables, and mitigation protocols.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Phase {selectedPhase.id.replace('phase-', '')} of 6 Selected
          </span>
        </div>

        {/* Phase Timeline Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {roadmap.phases.map((p, idx) => {
            const isSelected = selectedPhaseId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhaseId(p.id)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                      Phase {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.timeline}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1 line-clamp-2">
                    {p.name.split(':')[1] || p.name}
                  </div>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.deliverables.length} Deliverables
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Card */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/80 p-5 lg:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/60 pb-4 mb-5">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                {selectedPhase.timeline}
              </span>
              <h4 className="text-xl font-bold text-white mt-0.5">
                {selectedPhase.name}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {selectedPhase.id === 'phase-3' && (
                <button
                  onClick={() => onNavigateToTab('handshake')}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Inspect Hybrid Handshake</span>
                </button>
              )}
              {selectedPhase.id === 'phase-4' && (
                <button
                  onClick={() => onNavigateToTab('calculator')}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Cert Bloat Calculator</span>
                </button>
              )}
              {selectedPhase.id === 'phase-2' && (
                <button
                  onClick={() => onNavigateToTab('blueprints')}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>View CAPI Abstraction</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Strategic Objectives
              </h5>
              <ul className="space-y-2.5">
                {selectedPhase.objectives.map((obj, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="font-mono text-indigo-400 font-bold text-[11px] shrink-0 mt-0.5">0{i + 1}.</span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                Engineering Deliverables &amp; Artifacts
              </h5>
              <ul className="space-y-2.5">
                {selectedPhase.deliverables.map((del, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive: Handling FIPS 204 (ML-DSA) Certificate Bloat (The Exact Core Requirement) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              CORE ARCHITECTURAL ANALYSIS
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>FIPS 204 (ML-DSA) Certificate Size Bloat Mitigation Strategy</span>
            </h3>
          </div>

          <button
            onClick={() => onNavigateToTab('calculator')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Simulate TCP Initcwnd Impact</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed mb-6">
          <p className="font-semibold text-amber-300 mb-1">
            The Fundamental Network Bottleneck:
          </p>
          {roadmap.certificateMitigationDetails.problemStatement}
        </div>

        {/* The 5 Mitigations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.certificateMitigationDetails.mitigationMatrix.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-4 flex flex-col justify-between hover:border-slate-600 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                    Pillar 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                    {item.deploymentLocation.split('/')[0]}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">
                  {item.strategy}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.mechanism}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 mt-2">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto-Agility Abstraction Layer Philosophy */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              ABSTRACTION PRINCIPLE
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Crypto-Agility Architecture Framework</span>
            </h3>
          </div>

          <button
            onClick={() => onNavigateToTab('blueprints')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View EnvoyFilter &amp; Go SDK Code</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <blockquote className="p-4 rounded-xl bg-slate-800/60 border-l-4 border-emerald-500 text-xs text-slate-200 italic mb-6">
          &ldquo;{roadmap.cryptoAgilityArchitecture.corePrinciple}&rdquo;
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmap.cryptoAgilityArchitecture.components.map((comp, idx) => (
            <div key={idx} className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
              <div className="font-semibold text-indigo-300 text-sm mb-1.5">
                {comp.name}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {comp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
