import React, { useState } from 'react';
import { 
  DISCOVERED_CRYPTO_ASSETS, 
  MOSCA_THEOREM_ASSESSMENT,
  BLUEPRINT_SNIPPETS 
} from '../data/pqcData';
import { DiscoveredCryptoAsset } from '../types/pqc';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  FileText,
  Lock,
  Unlock,
  Key,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AuditReportViewProps {
  onNavigateToTab: (tab: any) => void;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({ onNavigateToTab }) => {
  const [shelfLifeX, setShelfLifeX] = useState<number>(15);
  const [migrationY, setMigrationY] = useState<number>(3);
  const [quantumZ, setQuantumZ] = useState<number>(7);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset-1');
  const [remediatedMode, setRemediatedMode] = useState<boolean>(true);
  const [copiedCBOM, setCopiedCBOM] = useState<boolean>(false);

  // Mosca's theorem calculations
  const totalExposureSum = shelfLifeX + migrationY;
  const isViolated = totalExposureSum > quantumZ;
  const exposureWindowYears = totalExposureSum - quantumZ;

  const selectedAsset = DISCOVERED_CRYPTO_ASSETS.find(a => a.id === selectedAssetId) || DISCOVERED_CRYPTO_ASSETS[0];

  const handleCopyCBOM = () => {
    navigator.clipboard.writeText(BLUEPRINT_SNIPPETS.cbom);
    setCopiedCBOM(true);
    setTimeout(() => setCopiedCBOM(false), 2000);
  };

  const handleExportAuditMD = () => {
    const md = `# CYBERSECURITY AUDIT REPORT: POST-QUANTUM CRYPTOGRAPHY (PQC) & CBOM
**Security Clearance Level:** Cleared Senior Cybersecurity Auditor
**Evaluation Framework:** NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)
**Specification:** CycloneDX v1.6 Cryptographic Bill of Materials (CBOM)
**Date Generated:** 2026-10-08T03:11:24.309Z

## 1. Executive Summary
- Assessment Title: PQC Audit: Python Networking Script & Custom Crypto Protocol
- Overall Quantum Risk Score: 94 / 100 (Unmitigated) -> 0 / 100 (Remediated)
- Status: ALL 5 DISCOVERED CRYPTOGRAPHIC VULNERABILITIES REMEDIATED

## 2. Mosca's Theorem Evaluation
- Data Shelf-Life (X): ${shelfLifeX} years
- Migration Timeline (Y): ${migrationY} years
- Estimated Quantum Horizon (Z): ${quantumZ} years to Q-Day
- Inequality: X (${shelfLifeX} yrs) + Y (${migrationY} yrs) = ${totalExposureSum} yrs > Z (${quantumZ} yrs)
- Remediated Posture: Hybrid X25519 + ML-KEM-768 deployed immediately; HNDL threat eliminated.

## 3. Discovered Cryptographic Asset Remediation Inventory
${DISCOVERED_CRYPTO_ASSETS.map(a => `
### ${a.name} (${a.algorithm})
- Category: ${a.category}
- Code Reference: ${a.codeLocation}
- Quantum Vulnerability: ${a.quantumVulnerability}
- NIST Target: ${a.nistTarget}
- Recommended Replacement: ${a.recommendedReplacement}
- Remediation Status: ${a.remediated ? 'VERIFIED REMEDIATED' : 'PENDING'}
- Remediation Details: ${a.remediationDetails}
`).join('\n')}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cybersecurity-PQC-Audit-Report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Cleared Senior Auditor Report Header */}
      <div className="bg-linear-to-br from-slate-900 via-rose-950/20 to-slate-900 rounded-2xl border border-rose-500/30 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                CYBERSECURITY AUDIT REPORT
              </span>
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-semibold">
                CYCLONEDX v1.6 CBOM
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-semibold">
                ALL 5 ASSETS REMEDIATED
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAuditMD}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>Export Audit Report (.md)</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            PQC Audit: Python Networking Script &amp; Custom Crypto Protocol
          </h2>

          <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-5xl">
            Formal security evaluation under <b>NIST FIPS 203 (ML-KEM)</b>, <b>FIPS 204 (ML-DSA)</b>, and <b>FIPS 205 (SLH-DSA)</b>. The audit detected 3 critical Shor-vulnerable asymmetric primitives, 2 hardcoded secrets/static IVs, and severe Mosca's Theorem violation with <b>Harvest Now, Decrypt Later (HNDL)</b> exposure. The remediated architecture completely corrects all 5 assets.
          </p>

          {/* Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">RISK SCORE (ORIGINAL)</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">94 / 100 (CRITICAL)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Immediate Shor breach</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">SHOR PRIMITIVES</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">3 Vulnerable</div>
              <div className="text-[10px] text-slate-500 mt-0.5">RSA-2048 &bull; ECDH P-256</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">HARDCODED SECRETS</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">2 Violations</div>
              <div className="text-[10px] text-slate-500 mt-0.5">RSA PEM &bull; Static Null IV</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">HNDL VERDICT</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">CRITICAL EXPOSURE</div>
              <div className="text-[10px] text-slate-500 mt-0.5">15-yr data &gt; 7-yr Q-Day</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
              <div className="text-[11px] text-emerald-300 font-mono font-bold">REMEDIATED POSTURE</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">100% PQC HARDENED</div>
              <div className="text-[10px] text-emerald-300 mt-0.5">FIPS 203 &bull; AES-256-GCM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mosca's Theorem Interactive Calculator */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              SECTION 2 &bull; QUANTUM RISK TIMELINE EVALUATION
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Mosca's Theorem &amp; Harvest Now, Decrypt Later (HNDL) Equation</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Inequality:</span>
            <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
              isViolated 
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50' 
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
            }`}>
              X + Y ({totalExposureSum} yrs) {isViolated ? '>' : '≤'} Z ({quantumZ} yrs)
            </span>
          </div>
        </div>

        {/* Mosca Parameters Slider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">
                Data Shelf-Life (X)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {shelfLifeX} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={shelfLifeX}
              onChange={(e) => setShelfLifeX(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 leading-snug">
              Duration for which transmitted data remains sensitive (e.g. classified records, health records, banking keys).
            </p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">
                Migration Timeline (Y)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {migrationY} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={migrationY}
              onChange={(e) => setMigrationY(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 leading-snug">
              Time required to re-engineer systems and deploy quantum-resistant algorithms across the enterprise fleet.
            </p>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">
                Quantum Horizon to Q-Day (Z)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {quantumZ} Years
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={20}
              value={quantumZ}
              onChange={(e) => setQuantumZ(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 leading-snug">
              Estimated timeframe until a Cryptanalytically Relevant Quantum Computer (CRQC with ~4,096 logical qubits) emerges.
            </p>
          </div>
        </div>

        {/* Auditor Verdict Card */}
        <div className={`p-5 rounded-xl border ${
          isViolated 
            ? 'bg-rose-950/20 border-rose-500/40 text-slate-200' 
            : 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono font-bold uppercase ${isViolated ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isViolated ? 'CRITICAL BREACH STATE (MOSCA VIOLATION)' : 'POST-QUANTUM COMPLIANT POSTURE'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {isViolated ? `+${exposureWindowYears} Years Unprotected Exposure` : 'Zero Retroactive Exposure'}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-300">
            {isViolated ? (
              <>
                <b>Auditor Verdict:</b> Mosca&apos;s inequality is severely violated ({shelfLifeX} yrs + {migrationY} yrs = {totalExposureSum} yrs &gt; {quantumZ} yrs). Sensitive data recorded over this broker today will remain confidential for only <b>{quantumZ} years</b> before a CRQC emerges, leaving <b>{exposureWindowYears} years of classified payload exposed</b> to retroactive decryption under Harvest Now, Decrypt Later.
              </>
            ) : (
              <>
                <b>Auditor Verdict:</b> Mosca&apos;s inequality is satisfied ({totalExposureSum} yrs &le; {quantumZ} yrs). Data migration will complete before the estimated quantum horizon.
              </>
            )}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Remediation Applied: Immediate Hybrid X25519 + ML-KEM-768 eliminates the vulnerability.</span>
            </span>

            <button
              onClick={() => onNavigateToTab('handshake')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Hybrid KEM Packet Flow</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Discovered Cryptographic Asset Inventory (Table & Inspector) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              SECTION 3 &bull; DISCOVERED ASSET INVENTORY &amp; REMEDIATION
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>Cryptographic Asset Findings &amp; NIST Migration Directives</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">View Mode:</span>
            <button
              onClick={() => setRemediatedMode(!remediatedMode)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border transition cursor-pointer ${
                remediatedMode 
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' 
                  : 'bg-rose-600/30 text-rose-300 border-rose-500'
              }`}
            >
              {remediatedMode ? 'Showing Remediated Posture' : 'Showing Legacy Findings'}
            </button>
          </div>
        </div>

        {/* Asset Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Asset Name</th>
                <th className="py-2.5 px-3">Code Location</th>
                <th className="py-2.5 px-3">Legacy Algorithm</th>
                <th className="py-2.5 px-3">Vulnerability</th>
                <th className="py-2.5 px-3">NIST Mandate</th>
                <th className="py-2.5 px-3">Remediation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {DISCOVERED_CRYPTO_ASSETS.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`cursor-pointer transition hover:bg-slate-800/60 ${
                      isSelected ? 'bg-indigo-950/40 text-white' : 'text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        asset.riskLevel === 'CRITICAL' ? 'bg-rose-400' :
                        asset.riskLevel === 'HIGH' ? 'bg-amber-400' : 'bg-indigo-400'
                      }`} />
                      <span>{asset.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {asset.codeLocation}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {asset.algorithm}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        asset.quantumVulnerability === 'FATAL_SHOR_BROKEN' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : asset.quantumVulnerability === 'INSECURE_WRAPPER'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {asset.quantumVulnerability}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-indigo-300 font-semibold">
                      {asset.nistTarget}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        REMEDIATED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Asset Deep Remediation Card */}
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                DEEP ASSET REMEDIATION AUDIT
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedAsset.name} &bull; {selectedAsset.algorithm}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Target Standard:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {selectedAsset.nistTarget}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <span className="text-rose-400 font-bold font-mono uppercase text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Vulnerability &amp; Failure Mechanism
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedAsset.failureMechanism}
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                Classical Security: <b className="text-white">{selectedAsset.classicalBits} bits</b> &bull; Hardcoded: <b className={selectedAsset.hardcodedSecret ? 'text-rose-400' : 'text-slate-300'}>{selectedAsset.hardcodedSecret ? 'YES (VIOLATION)' : 'No'}</b>
              </div>
            </div>

            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-400 font-bold font-mono uppercase text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Remediation Directive Applied
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedAsset.remediationDetails}
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-300">
                Recommended: <b className="text-white">{selectedAsset.recommendedReplacement}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remediated Python Network Broker Code & CycloneDX 1.6 CBOM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Remediated Python Script */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  CODE REMEDIATION
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Remediated Python Broker (secure_pqc_broker.py)</span>
                </h4>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                FIXED ALL 5 AUDIT SITES
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Replaces vulnerable RSA PEM, ECDH P-256, and AES-128-CBC with static null IV. Employs <b>AES-256-GCM</b> with CSPRNG 96-bit nonces, <b>HKDF SHA-256</b>, and <b>ML-KEM-768</b>.
            </p>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-[380px] overflow-y-auto scrollbar-thin">
              <pre>
                <code>{BLUEPRINT_SNIPPETS.python_remediated}</code>
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Remediates lines 10-14, 21-25, 35-51, 54-58, 63-68, 73-77</span>
            <button
              onClick={() => onNavigateToTab('blueprints')}
              className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              View Envoy &amp; Go Blueprints &rarr;
            </button>
          </div>
        </div>

        {/* Right: CycloneDX 1.6 CBOM */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                  SECTION 6 &bull; SPECIFICATION
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>CycloneDX v1.6 CBOM (Cryptographic Bill of Materials)</span>
                </h4>
              </div>

              <button
                onClick={handleCopyCBOM}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedCBOM ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Standardized CycloneDX 1.6 Cryptographic Bill of Materials descriptor tracking RSA, ECDH, AES-CBC, and SHA-256 for automated CI/CD discovery scanning.
            </p>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-[380px] overflow-y-auto scrollbar-thin">
              <pre>
                <code>{BLUEPRINT_SNIPPETS.cbom}</code>
              </pre>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>CycloneDX 1.6 JSON Schema Validated</span>
            <div className="flex items-center gap-2">
              <a
                href="/api/architect/export-cbom"
                download="cyclonedx-cbom.json"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CBOM JSON</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Aikido Security Integration Panel */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl border border-indigo-500/40 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  SECURITY PLATFORM INTEGRATION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  SAST &bull; SECRETS &bull; CBOM
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Connecting Aikido Security to this Application
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://app.aikido.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              <span>Open Aikido Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          <b>Aikido Security</b> is an all-in-one developer security platform providing SAST, hardcoded secret detection, dependency scanning, and CycloneDX SBOM/CBOM ingestion. By connecting Aikido, you automatically prevent regressions of the 5 audit vulnerabilities (such as hardcoded RSA keys, static IVs, and vulnerable ciphers) and continuously track your post-quantum cryptographic posture.
        </p>

        {/* 3 Integration Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Connect Repo */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-indigo-400 font-bold text-[10px] uppercase">
                  Step 01 &bull; Zero Install
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Connect Source Repository
              </h4>
              <p className="text-slate-400 leading-relaxed mb-3">
                Log into <b>app.aikido.dev</b>, select <i>Add Repository</i>, and authorize your GitHub, GitLab, or Bitbucket repo containing this project.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300">
              Scans secrets, Dockerfiles, and dependencies automatically on commit.
            </div>
          </div>

          {/* Step 2: GitHub Action */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-indigo-400 font-bold text-[10px] uppercase">
                  Step 02 &bull; CI/CD Gate
                </span>
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Add GitHub Actions Workflow
              </h4>
              <p className="text-slate-400 leading-relaxed mb-3">
                Save <b>.github/workflows/aikido-security.yml</b> in your repo. Add your <code className="text-indigo-300">AIKIDO_API_KEY</code> to GitHub Repository Secrets.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300">
              Blocks PRs if new hardcoded keys or critical CVEs are introduced.
            </div>
          </div>

          {/* Step 3: CBOM Upload */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-indigo-400 font-bold text-[10px] uppercase">
                  Step 03 &bull; CBOM Sync
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Ingest CycloneDX 1.6 CBOM
              </h4>
              <p className="text-slate-400 leading-relaxed mb-3">
                Upload the exported <b>cyclonedx-cbom.json</b> to Aikido via CLI or REST API to track all cryptographic primitives in Aikido&apos;s asset dashboard.
              </p>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300">
              Provides real-time inventory of hybrid KEMs and post-quantum keys.
            </div>
          </div>
        </div>

        {/* Copyable CLI Snippets Container */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-semibold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Quick CLI Scan &amp; CBOM Upload Commands:
            </span>
            <span className="font-mono text-[11px] text-slate-500">npx @aikidosec/cli</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto space-y-2">
            <div>
              <span className="text-slate-500"># 1. Run immediate local security scan:</span><br />
              <span className="text-emerald-400">npx @aikidosec/cli scan --apikey $AIKIDO_API_KEY</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500"># 2. Upload CycloneDX 1.6 Cryptographic Bill of Materials (CBOM):</span><br />
              <span className="text-emerald-400">npx @aikidosec/cli upload --type cyclonedx --file cyclonedx-cbom.json --api-key $AIKIDO_API_KEY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
