import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  AlertCircle
} from 'lucide-react';

export const ArchitectConsole: React.FC = () => {
  const defaultPrompt =
    "Draft a high-level architecture roadmap to transition our microservices TLS 1.2 communication " +
    "to a quantum-resistant state. Detail the hybrid key exchange mechanisms and how we will " +
    "handle the increased certificate sizes associated with FIPS 204 (ML-DSA).";

  const [prompt, setPrompt] = useState<string>(defaultPrompt);
  const [response, setResponse] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('gemini-2.5-pro');
  const [loading, setLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetPrompts = [
    {
      title: "Default Cleared Architect Prompt",
      desc: "Microservices TLS 1.2 to Quantum-Resistant & FIPS 204 Cert Bloat",
      promptText: defaultPrompt,
    },
    {
      title: "Zero-Trust mTLS with ML-DSA",
      desc: "Handling high-frequency service mesh mTLS handshakes with ML-DSA-65",
      promptText: "Provide a detailed architecture for mutual TLS (mTLS) in an Istio/Kubernetes service mesh transitioning to NIST FIPS 204 (ML-DSA-65). How do we prevent CPU and memory exhaustion from high-frequency handshake verifications and manage short-lived ephemeral certificates?",
    },
    {
      title: "Crypto-Agility SPI & Hot-Swapping",
      desc: "Decoupling application code with pluggable crypto providers",
      promptText: "Specify the software design patterns for a Crypto-Agility Abstraction Layer across Go, Java, and Rust microservices. How should the dynamic algorithm provider interface be structured to swap algorithms in production without application recompilation?",
    },
    {
      title: "HSM & KMS PQC Envelope Encryption",
      desc: "Data-at-rest hardening with AES-256 and FIPS 203 KEM envelopes",
      promptText: "Draft the enterprise data-at-rest migration strategy to satisfy the Senior Architect mandate of AES-256 / ChaCha20 with 256-bit keys and Post-Quantum envelope encryption (DEK wrapping with ML-KEM-768/1024). Detail KMS and HSM firmware upgrade requirements.",
    },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResponse('');

    try {
      // Use streaming endpoint
      setIsStreaming(true);
      const res = await fetch('/api/architect/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error('Streaming response body empty');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              if (data.text) {
                accumulatedText += data.text;
                setResponse(accumulatedText);
              }
              if (data.error) {
                setErrorMsg(data.error);
              }
            } catch {
              // Ignore non-json lines
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Streaming failed, trying fallback unary endpoint:', err);
      try {
        const fallbackRes = await fetch('/api/architect/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: textToSubmit }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && fallbackData.text) {
          setResponse(fallbackData.text);
          if (fallbackData.model) setModelUsed(fallbackData.model);
        } else {
          setErrorMsg(fallbackData.error || 'Failed to generate response.');
        }
      } catch (unaryErr: any) {
        setErrorMsg(unaryErr.message || 'Network error communicating with architect service.');
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Architect-Response-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                AI ARCHITECT CONSULTATION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: {modelUsed} &bull; Temperature: 0.0 &bull; Cleared Persona
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Live Senior Cybersecurity Architect Consultation Console
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interact directly with the cleared Senior Cybersecurity Architect persona adhering to NIST FIPS 203/204/205 standards and TCG guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/architect/export-md"
              download="PQC-Transition-Architecture-Roadmap.md"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Roadmap (.md)</span>
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              TEMPERATURE: 0.0 LOCKED
            </span>
          </div>
        </div>
      </div>

      {/* Preset Queries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {presetPrompts.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(preset.promptText);
              handleGenerate(preset.promptText);
            }}
            className="p-3.5 bg-slate-900/80 hover:bg-slate-800/90 rounded-xl border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                {preset.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.desc}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
              <span>Execute Analysis</span>
              <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition" />
            </div>
          </button>
        ))}
      </div>

      {/* Input Prompt Box */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Architectural Prompt Query</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Temperature: 0.0 (Deterministic Architectural Precision)
          </span>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a technical PQC architecture question..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 font-mono resize-y leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Base rules enforced: TCG readiness, hybrid X25519+ML-KEM in transit, AES-256 at rest, crypto-agility.
          </span>

          <button
            disabled={loading || !prompt.trim()}
            onClick={() => handleGenerate()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Architect Reasoning...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Query to Architect</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Panel */}
      {(response || loading || errorMsg) && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Response Top Bar */}
          <div className="bg-slate-900/90 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white">
                Cleared Senior Cybersecurity Architect Response
              </span>
              {isStreaming && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  Streaming Output...
                </span>
              )}
            </div>

            {response && (
              <div className="flex items-center gap-2">
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
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download .md</span>
                </button>
              </div>
            )}
          </div>

          {/* Response Content Area */}
          <div className="p-6 text-slate-200 text-xs leading-relaxed max-h-[650px] overflow-y-auto font-mono whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
            {errorMsg ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <div className="font-bold text-sm">Consultation Service Alert</div>
                  <div className="mt-1 text-xs">{errorMsg}</div>
                </div>
              </div>
            ) : response ? (
              response
            ) : (
              <div className="flex items-center gap-3 text-slate-400 py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Architect is formulating standards-compliant transition roadmap...</span>
              </div>
            )}
          </div>

          {/* Response Footer */}
          <div className="bg-slate-900/80 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>TCG PQC Readiness Guidelines &bull; NIST FIPS 203 / 204</span>
            <span className="font-mono text-emerald-400">Deterministic Evaluation (T=0.0)</span>
          </div>
        </div>
      )}
    </div>
  );
};
