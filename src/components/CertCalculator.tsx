import React, { useState } from 'react';
import { SIGNATURE_ALGORITHMS, KEM_ALGORITHMS } from '../data/pqcData';
import { 
  Calculator, 
  Layers, 
  Network, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  TrendingDown,
  Clock,
  Gauge
} from 'lucide-react';

export const CertCalculator: React.FC = () => {
  const [sigAlgId, setSigAlgId] = useState<string>('mldsa65');
  const [kemAlgId, setKemAlgId] = useState<string>('x25519-mlkem768');
  const [chainDepth, setChainDepth] = useState<number>(3); // 2, 3, 4
  const [compressionType, setCompressionType] = useState<string>('brotli'); // none, zlib, brotli, zstd
  const [mtuSize, setMtuSize] = useState<number>(1500); // 1500 or 9000
  const [initcwndSegments, setInitcwndSegments] = useState<number>(10); // 10 or 32
  const [networkRttMs, setNetworkRttMs] = useState<number>(20); // 0.5, 5, 20, 85

  const selectedSig = SIGNATURE_ALGORITHMS.find(s => s.id === sigAlgId) || SIGNATURE_ALGORITHMS[1];
  const selectedKem = KEM_ALGORITHMS.find(k => k.id === kemAlgId) || KEM_ALGORITHMS[0];

  // Base X.509 ASN.1 metadata per cert in bytes (subject, issuer, extensions, validity, serial)
  const baseCertMetadataBytes = 650;

  // Single cert size = pubKey + sig + metadata
  const singleCertBytes = selectedSig.pubKeyBytes + selectedSig.sigBytes + baseCertMetadataBytes;

  // Chain transmitted by server in TLS Certificate message = (depth - 1) certificates (Root is pre-installed in trust store)
  // Or if client lacks intermediate, all (depth - 1) are sent.
  const transmittedCertCount = Math.max(1, chainDepth - 1);
  const rawCertChainBytes = singleCertBytes * transmittedCertCount;

  // Plus CertificateVerify signature (contains another signature by the leaf cert private key)
  const certificateVerifyBytes = selectedSig.sigBytes;

  // Plus ClientHello/ServerHello KEM keyshare
  const serverHelloKemBytes = selectedKem.cipherTextBytes;

  // Total raw server flight size during handshake
  const totalRawServerFlightBytes = rawCertChainBytes + certificateVerifyBytes + serverHelloKemBytes + 350; // 350 for headers, session params

  // Compression factor
  let compressionRatio = 1.0;
  if (compressionType === 'brotli') compressionRatio = 0.45; // 55% reduction
  else if (compressionType === 'zstd') compressionRatio = 0.52; // 48% reduction
  else if (compressionType === 'zlib') compressionRatio = 0.65; // 35% reduction

  const compressedCertChainBytes = Math.round(rawCertChainBytes * compressionRatio);
  const totalCompressedFlightBytes = compressedCertChainBytes + certificateVerifyBytes + serverHelloKemBytes + 350;

  // MSS (Maximum Segment Size)
  const tcpMss = mtuSize - 40; // 40 bytes for IPv4 + TCP headers
  const maxInitialWindowBytes = initcwndSegments * tcpMss;

  // Packet segments required
  const rawSegments = Math.ceil(totalRawServerFlightBytes / tcpMss);
  const compressedSegments = Math.ceil(totalCompressedFlightBytes / tcpMss);

  // Does it exceed initcwnd?
  const isRawStalled = totalRawServerFlightBytes > maxInitialWindowBytes;
  const isCompressedStalled = totalCompressedFlightBytes > maxInitialWindowBytes;

  // Extra RTTs
  const extraRttRaw = isRawStalled ? Math.ceil((totalRawServerFlightBytes - maxInitialWindowBytes) / (initcwndSegments * tcpMss)) : 0;
  const extraRttCompressed = isCompressedStalled ? Math.ceil((totalCompressedFlightBytes - maxInitialWindowBytes) / (initcwndSegments * tcpMss)) : 0;

  // Total latency overhead
  const baseHandshakeRtt = 1; // TLS 1.3 base
  const totalHandshakeTimeRawMs = (baseHandshakeRtt + extraRttRaw) * networkRttMs;
  const totalHandshakeTimeCompressedMs = (baseHandshakeRtt + extraRttCompressed) * networkRttMs;
  const savedLatencyMs = totalHandshakeTimeRawMs - totalHandshakeTimeCompressedMs;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                NIST FIPS 204 SIZING ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                RFC 8879 Compression &bull; TCP Initcwnd Modeling
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              FIPS 204 Certificate Bloat &amp; Network Latency Calculator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quantify the network impact of ML-DSA lattice signatures, evaluate Brotli/Zstandard compression ratios, and test TCP window tuning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 font-mono">COMPRESSION SAVINGS</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {Math.round((1 - compressionRatio) * 100)}% Payload Reduction
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls, Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Cryptographic &amp; Network Parameters</span>
          </h3>

          {/* 1. Signature Algorithm Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Digital Signature Algorithm (Auth)
            </label>
            <select
              value={sigAlgId}
              onChange={(e) => setSigAlgId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer"
            >
              {SIGNATURE_ALGORITHMS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.standard}) - Sig: {s.sigBytes}B, PubKey: {s.pubKeyBytes}B
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-1 flex justify-between font-mono">
              <span>Sig: <b className="text-white">{selectedSig.sigBytes} B</b></span>
              <span>PubKey: <b className="text-white">{selectedSig.pubKeyBytes} B</b></span>
              <span className={selectedSig.quantumSafe ? "text-emerald-400" : "text-rose-400"}>
                {selectedSig.quantumSafe ? "Quantum Safe" : "Vulnerable"}
              </span>
            </div>
          </div>

          {/* 2. KEM Algorithm Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Key Encapsulation Mechanism (Key Exchange)
            </label>
            <select
              value={kemAlgId}
              onChange={(e) => setKemAlgId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono cursor-pointer"
            >
              {KEM_ALGORITHMS.map(k => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.standard}) - Ciphertext: {k.cipherTextBytes}B
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 mt-1 flex justify-between font-mono">
              <span>Ciphertext: <b className="text-white">{selectedKem.cipherTextBytes} B</b></span>
              <span className="text-indigo-400">{selectedKem.isHybrid ? "Hybrid Mode" : "Pure PQC"}</span>
            </div>
          </div>

          {/* 3. Certificate Chain Depth */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                X.509 Certificate Chain Depth
              </label>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {chainDepth} Tiers ({transmittedCertCount} Sent on Wire)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map(depth => (
                <button
                  key={depth}
                  onClick={() => setChainDepth(depth)}
                  className={`py-1.5 rounded text-xs font-mono border transition cursor-pointer ${
                    chainDepth === depth
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {depth === 2 ? '2-Tier (Leaf+Root)' : depth === 3 ? '3-Tier (Standard)' : '4-Tier (Cross-Signed)'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. RFC 8879 Compression Algorithm */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              TLS Certificate Compression (RFC 8879)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'brotli', label: 'Brotli (Alg 2)', discount: '-55%' },
                { id: 'zstd', label: 'Zstandard (Alg 3)', discount: '-48%' },
                { id: 'zlib', label: 'Zlib (Alg 1)', discount: '-35%' },
                { id: 'none', label: 'None (Uncompressed)', discount: '0%' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCompressionType(c.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs border text-left flex justify-between items-center transition cursor-pointer ${
                    compressionType === c.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{c.discount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Network MTU & Initcwnd */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Network MTU
              </label>
              <select
                value={mtuSize}
                onChange={(e) => setMtuSize(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono cursor-pointer"
              >
                <option value={1500}>1500 B (Standard LAN/WAN)</option>
                <option value={9000}>9000 B (Jumbo Frames VPC)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                TCP initcwnd Window
              </label>
              <select
                value={initcwndSegments}
                onChange={(e) => setInitcwndSegments(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono cursor-pointer"
              >
                <option value={10}>10 segments (~14.6 KB default)</option>
                <option value={32}>32 segments (~46.7 KB tuned)</option>
              </select>
            </div>
          </div>

          {/* 6. Network RTT */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Network Round Trip Time (RTT)
              </label>
              <span className="text-xs font-mono text-indigo-400">{networkRttMs} ms</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'Mesh', rtt: 0.5 },
                { label: 'Metro', rtt: 5 },
                { label: 'Cloud DC', rtt: 20 },
                { label: 'WAN', rtt: 85 },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setNetworkRttMs(item.rtt)}
                  className={`py-1 rounded text-[11px] font-mono border transition cursor-pointer ${
                    networkRttMs === item.rtt
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {item.label} ({item.rtt}ms)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Visual Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Raw Uncompressed Card */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isRawStalled 
                ? 'bg-rose-950/20 border-rose-500/40 text-slate-200' 
                : 'bg-slate-800/40 border-slate-700 text-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Raw Certificate Chain
                  </span>
                  {isRawStalled ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                      STALL: EXCEEDS INITCWND
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      FITS IN WINDOW
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {(totalRawServerFlightBytes / 1024).toFixed(1)} KB
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Cert Chain: {(rawCertChainBytes / 1024).toFixed(1)} KB &bull; Sig: {(certificateVerifyBytes / 1024).toFixed(1)} KB
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required TCP Segments:</span>
                    <span className="font-mono font-semibold text-white">{rawSegments} pkts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initcwnd Window Capacity:</span>
                    <span className="font-mono text-slate-300">{initcwndSegments} pkts ({(maxInitialWindowBytes / 1024).toFixed(1)} KB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extra TCP RTT Stalls:</span>
                    <span className={`font-mono font-bold ${extraRttRaw > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      +{extraRttRaw} RTT ({extraRttRaw * networkRttMs} ms)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Handshake Time:</span>
                <span className="text-sm font-bold font-mono text-white">
                  {totalHandshakeTimeRawMs} ms
                </span>
              </div>
            </div>

            {/* Compressed with RFC 8879 Card */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isCompressedStalled 
                ? 'bg-amber-950/20 border-amber-500/40 text-slate-200' 
                : 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    RFC 8879 ({compressionType.toUpperCase()})
                  </span>
                  {!isCompressedStalled ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      OPTIMIZED: 1 RTT
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      MODERATE STALL
                    </span>
                  )}
                </div>

                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {(totalCompressedFlightBytes / 1024).toFixed(1)} KB
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Compressed Chain: {(compressedCertChainBytes / 1024).toFixed(1)} KB ({Math.round((1 - compressionRatio) * 100)}% saved)
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required TCP Segments:</span>
                    <span className="font-mono font-semibold text-emerald-300">{compressedSegments} pkts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initcwnd Window Capacity:</span>
                    <span className="font-mono text-slate-300">{initcwndSegments} pkts ({(maxInitialWindowBytes / 1024).toFixed(1)} KB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Extra TCP RTT Stalls:</span>
                    <span className={`font-mono font-bold ${extraRttCompressed > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      +{extraRttCompressed} RTT ({extraRttCompressed * networkRttMs} ms)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Handshake Time:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {totalHandshakeTimeCompressedMs} ms
                </span>
              </div>
            </div>
          </div>

          {/* Latency Benefit Banner */}
          {savedLatencyMs > 0 && (
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    Compression Prevented TCP Round-Trip Stall!
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Saved <b className="text-white font-mono">{savedLatencyMs} ms</b> per TLS connection. Avoided multi-packet fragmentation stall on {networkRttMs}ms network.
                  </div>
                </div>
              </div>
              <span className="text-base font-extrabold font-mono text-emerald-400">
                -{savedLatencyMs} ms
              </span>
            </div>
          )}

          {/* Deep Architectural Sizing Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
              Wire Byte Breakdown (Server Flight Payload)
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Leaf Certificate Public Key ({selectedSig.name}):</span>
                <span className="font-mono text-white">{selectedSig.pubKeyBytes} Bytes</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Leaf Certificate Signature (ML-DSA Lattice):</span>
                <span className="font-mono text-white">{selectedSig.sigBytes} Bytes</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Intermediate CA Certificate(s) [{transmittedCertCount - 1} intermediate]:</span>
                <span className="font-mono text-white">{singleCertBytes * (transmittedCertCount - 1)} Bytes</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">CertificateVerify Handshake Signature:</span>
                <span className="font-mono text-white">{certificateVerifyBytes} Bytes</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">ServerHello Key Encapsulation Ciphertext ({selectedKem.name}):</span>
                <span className="font-mono text-white">{serverHelloKemBytes} Bytes</span>
              </div>

              <div className="flex items-center justify-between py-2 pt-3 border-t border-slate-700 font-semibold">
                <span className="text-slate-200">Total Compressed Server Flight Payload:</span>
                <span className="font-mono text-emerald-400 font-bold">{totalCompressedFlightBytes} Bytes ({(totalCompressedFlightBytes / 1024).toFixed(2)} KB)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
