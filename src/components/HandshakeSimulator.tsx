import React, { useState, useEffect } from 'react';
import { HANDSHAKE_SCENARIOS } from '../data/pqcData';
import { HandshakeScenario, HandshakePacket } from '../types/pqc';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ArrowLeft,
  Server,
  Laptop,
  Layers,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const HandshakeSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('hybrid-tls13');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2000); // ms per step
  const [selectedPacket, setSelectedPacket] = useState<HandshakePacket | null>(null);

  const scenario: HandshakeScenario = 
    HANDSHAKE_SCENARIOS.find(s => s.id === selectedScenarioId) || HANDSHAKE_SCENARIOS[0];

  useEffect(() => {
    setActiveStep(0);
    setSelectedPacket(scenario.packets[0] || null);
    setIsPlaying(false);
  }, [selectedScenarioId]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (activeStep < scenario.packets.length - 1) {
          const next = activeStep + 1;
          setActiveStep(next);
          setSelectedPacket(scenario.packets[next]);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, scenario.packets, playbackSpeed]);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
    setSelectedPacket(scenario.packets[idx]);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedPacket(scenario.packets[0]);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                INTERACTIVE PACKET FLOW
              </span>
              <span className="text-xs text-slate-400 font-mono">
                RFC 8446 vs RFC 8879 Compression
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              TLS Handshake Inspector &amp; Packet Sizing Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare round trips (RTT), cryptographic key encapsulation, certificate bloat, and TCP Initial Window (initcwnd) behavior.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {HANDSHAKE_SCENARIOS.map((sc) => {
              const active = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-semibold'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    sc.riskLevel === 'optimal' ? 'bg-emerald-400' :
                    sc.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <span>{sc.name.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Metric Snapshot */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Key Exchange</span>
            <div className="text-xs font-bold text-white font-mono mt-0.5 truncate">
              {scenario.keyExchange}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {scenario.hndlProtected ? 'Quantum Protected' : 'Vulnerable to Shor'}
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Handshake Latency</span>
            <div className="text-xs font-bold text-white font-mono mt-0.5">
              {scenario.rtt} RTT (Round Trip Time)
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {scenario.rtt === 1 ? 'Zero ACK stall' : 'Extra round-trip penalty'}
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400">Certificate Flight Size</span>
            <div className="text-xs font-bold text-indigo-300 font-mono mt-0.5">
              {scenario.totalCertSize}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Compression: {scenario.compression}
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400">HNDL Risk Posture</span>
            <div className="text-xs font-bold mt-0.5 flex items-center gap-1 font-mono">
              {scenario.hndlProtected ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">SAFE (ML-KEM)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">CRITICAL LEAK</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {scenario.hndlProtected ? 'Dual-key safety net' : 'Passive capture threat'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Handshake Wire Animation */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            {/* Playback Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Reset to step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 ml-2">
                  <span>Speed:</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 text-xs"
                  >
                    <option value={3000}>0.5x</option>
                    <option value={2000}>1x</option>
                    <option value={1000}>2x</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Step <span className="text-indigo-400 font-bold">{activeStep + 1}</span> of {scenario.packets.length}
              </div>
            </div>

            {/* Microservice Client & Server Host Headers */}
            <div className="grid grid-cols-2 gap-4 pb-4 mb-4 text-center">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Client Microservice / Ingress</span>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Target Service / Mesh Envoy Sidecar</span>
              </div>
            </div>

            {/* Wire Timeline Packets */}
            <div className="space-y-4 py-2">
              {scenario.packets.map((pkt, idx) => {
                const isClient = pkt.sender === 'client';
                const isSelected = activeStep === idx;
                const isPassed = idx <= activeStep;

                return (
                  <div
                    key={pkt.id}
                    onClick={() => handleStepClick(idx)}
                    className={`relative p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                        : isPassed
                        ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                        : 'bg-slate-900/40 border-slate-800 opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                          #{idx + 1}
                        </span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                          {pkt.message}
                        </span>
                        {pkt.isEncrypted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Lock className="w-2.5 h-2.5" />
                            Encrypted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Unlock className="w-2.5 h-2.5" />
                            Plaintext Flight
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {pkt.approxSize}
                        </span>
                        <div className={`p-1 rounded ${isClient ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {isClient ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pkt.description}
                    </p>

                    {pkt.highlight && (
                      <div className="mt-2 text-[11px] text-amber-300 font-medium flex items-center gap-1 bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{pkt.securityNote}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stepper Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
            <button
              disabled={activeStep === 0}
              onClick={() => handleStepClick(Math.max(0, activeStep - 1))}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 font-medium transition cursor-pointer"
            >
              Previous Packet
            </button>
            <span className="text-xs text-slate-400">
              Click any packet to inspect cryptographic details
            </span>
            <button
              disabled={activeStep === scenario.packets.length - 1}
              onClick={() => handleStepClick(Math.min(scenario.packets.length - 1, activeStep + 1))}
              className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs text-white font-medium transition cursor-pointer"
            >
              Next Packet
            </button>
          </div>
        </div>

        {/* Right Col: Deep Packet Inspector */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                PACKET PAYLOAD INSPECTOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Wire Analysis
              </span>
            </div>

            {selectedPacket ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/80">
                  <div className="text-xs text-slate-400">Message Name</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedPacket.message}
                  </div>
                  <div className="text-xs font-mono text-indigo-400 mt-1">
                    Flight: {selectedPacket.sender.toUpperCase()} &rarr; {selectedPacket.sender === 'client' ? 'SERVER' : 'CLIENT'}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-300">Payload Wire Size</span>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                      {selectedPacket.approxSize}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-300">Encryption Status</span>
                    <div className="text-xs mt-0.5 flex items-center gap-1.5">
                      {selectedPacket.isEncrypted ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Encrypted via Handshake Secret</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-300 font-medium">Transmitted in Plaintext</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-300">Architectural Note</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedPacket.securityNote}
                    </p>
                  </div>
                </div>

                {/* Scenario Summary Box */}
                <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30">
                  <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scenario Verdict</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scenario.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a packet to view payload inspection.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            TCG Rule: Hybrid key shares mandate dual encapsulation so classical security remains even if lattice primitives are contested.
          </div>
        </div>
      </div>
    </div>
  );
};
