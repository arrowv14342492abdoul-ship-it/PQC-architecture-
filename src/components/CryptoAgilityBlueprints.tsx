import React, { useState } from 'react';
import { BLUEPRINT_SNIPPETS } from '../data/pqcData';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  BookOpen
} from 'lucide-react';

export const CryptoAgilityBlueprints: React.FC = () => {
  const [activeSnippetKey, setActiveSnippetKey] = useState<keyof typeof BLUEPRINT_SNIPPETS>('envoy');
  const [copied, setCopied] = useState<boolean>(false);

  const snippets = [
    {
      key: 'envoy' as const,
      label: 'Envoy / Istio EnvoyFilter',
      description: 'Production Istio EnvoyFilter enforcing TLS 1.3 hybrid key exchange (X25519MLKEM768) and RFC 8879 certificate compression.',
      language: 'yaml',
    },
    {
      key: 'golang' as const,
      label: 'Go CAPI Provider Interface',
      description: 'Idiomatic Go abstraction pattern decoupling microservice business logic from specific cipher algorithms with runtime hot-swapping.',
      language: 'go',
    },
    {
      key: 'rust' as const,
      label: 'Rust Post-Quantum Client',
      description: 'Hardened Rust client built with rustls and AWS-LC-RS enforcing hybrid KEM groups with zero application rewrites.',
      language: 'rust',
    },
    {
      key: 'kubernetes' as const,
      label: 'Kubernetes cert-manager Spec',
      description: 'Declarative K8s ClusterIssuer & Certificate with short-lived renewals and ML-DSA-65 private key specs.',
      language: 'yaml',
    },
    {
      key: 'python_remediated' as const,
      label: 'Remediated Python Broker',
      description: 'Remediated secure_pqc_broker.py resolving all 5 audit vulnerabilities: AES-256-GCM, CSPRNG nonce, ML-KEM-768, and KMS.',
      language: 'python',
    },
    {
      key: 'cbom' as const,
      label: 'CycloneDX 1.6 CBOM Spec',
      description: 'Cryptographic Bill of Materials JSON asset inventory capturing algorithm agility status for audit automation.',
      language: 'json',
    },
    {
      key: 'aikido_ci' as const,
      label: 'Aikido Security CI/CD Action',
      description: 'GitHub Action workflow integrating Aikido Security SAST, secret detection, and automated CycloneDX 1.6 CBOM ingestion.',
      language: 'yaml',
    },
  ];

  const currentSnippet = snippets.find(s => s.key === activeSnippetKey) || snippets[0];
  const codeContent = BLUEPRINT_SNIPPETS[activeSnippetKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                CRYPTO-AGILITY SPECIFICATIONS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Decoupled Architecture &bull; Zero Recompile Swaps
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Crypto-Agility Architecture Blueprints &amp; Provider Code
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Production configurations and pluggable provider interfaces implementing the Trusted Computing Group's crypto-agility mandate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Selected Spec:</span>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              {currentSnippet.label}
            </span>
          </div>
        </div>
      </div>

      {/* Snippet Selector Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {snippets.map((snip) => {
          const isActive = activeSnippetKey === snip.key;
          return (
            <button
              key={snip.key}
              onClick={() => setActiveSnippetKey(snip.key)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                  {snip.language}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {snip.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Display Container */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Top Bar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-200 font-semibold">
                {currentSnippet.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {currentSnippet.description}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed max-h-[580px] scrollbar-thin">
          <pre>
            <code>{codeContent}</code>
          </pre>
        </div>

        {/* Architectural Insight Footer */}
        <div className="bg-slate-900/80 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              TCG Mandate: Abstracted cryptographic interfaces ensure algorithms can be swapped dynamically without modifying business logic.
            </span>
          </div>
          <span className="font-mono text-[11px] text-indigo-400">
            FIPS 203 / 204 Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
