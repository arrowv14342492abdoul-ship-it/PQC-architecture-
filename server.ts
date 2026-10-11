import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ARCHITECT_SYSTEM_INSTRUCTION =
  "You are a cleared Senior Cybersecurity Architect specializing in Post-Quantum " +
  "Cryptography (PQC) transition strategies and crypto-agility. Your objective is to " +
  "design secure, hybrid migration roadmaps for enterprise applications. " +
  "Strict rules: Base all designs on the Trusted Computing Group's PQC readiness guidelines " +
  "and NIST standards. Always mandate hybrid cryptography (e.g., X25519 + ML-KEM) for " +
  "data-in-transit to protect against 'Harvest Now, Decrypt Later' attacks while providing " +
  "a classical safety net. Mandate AES-256 or ChaCha20 with 256-bit keys for data-at-rest. " +
  "Ensure all designs abstract the cryptographic layer so algorithms can be swapped " +
  "dynamically (crypto-agility) without rewriting the core application logic.";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Canonical deep architecture roadmap pre-generated for high availability & instant display
const CANONICAL_ROADMAP = {
  title: "Microservices TLS 1.2 to Quantum-Resistant State Transition Roadmap",
  version: "1.0-ENTERPRISE-CLEARED",
  classification: "RESTRICTED // CYBERSECURITY ARCHITECTURE",
  standardsCompliance: [
    "NIST FIPS 203 (ML-KEM - Module-Lattice-Based Key-Encapsulation Mechanism)",
    "NIST FIPS 204 (ML-DSA - Module-Lattice-Based Digital Signature Algorithm)",
    "NIST FIPS 205 (SLH-DSA - Stateless Hash-Based Digital Signature Algorithm)",
    "Trusted Computing Group (TCG) PQC Readiness Guidelines v1.2",
    "IETF RFC 8446 (TLS 1.3) & RFC 8879 (TLS Certificate Compression)",
    "IETF RFC 9345 (Delegated Credentials for TLS)",
    "IETF draft-ietf-tls-hybrid-design (Post-Quantum Hybrid Key Exchange in TLS 1.3)",
    "NIST SP 800-208 (Stateful Hash-Based Signature Schemes)"
  ],
  threatModel: {
    primaryVector: "Harvest Now, Decrypt Later (HNDL / Store Now, Decrypt Later - SNDL)",
    quantumVulnerability: {
      asymmetricKeyExchange: "CRITICAL: Shor's algorithm renders RSA-2048/4096 and ECDH (P-256, P-384, X25519) solvable in polynomial time.",
      digitalSignatures: "HIGH (Long-term): Shor's algorithm enables signature forgery; critical for root CAs and code signing.",
      symmetricEncryption: "LOW: Grover's algorithm provides quadratic speedup (reducing key search from 2^256 to 2^128). AES-256 and ChaCha20 remain quantum-safe."
    }
  },
  executiveSummary: "This architecture mandates an agile, multi-phase migration of enterprise microservices communication from legacy TLS 1.2 to a quantum-resistant posture. The strategy enforces immediate deployment of IETF-standardized hybrid key exchange (X25519 + ML-KEM-768) in TLS 1.3 to permanently neutralize HNDL attacks while maintaining a classical FIPS 140-3 safety net. To resolve the 10x-15x certificate expansion induced by FIPS 204 (ML-DSA), we deploy a five-tier bloat mitigation matrix combining RFC 8879 Brotli/Zstandard certificate compression, TLS delegated credentials (RFC 9345), intermediate certificate caching in Envoy/Istio sidecars, and TCP Initial Congestion Window (initcwnd) tuning. Core microservices logic is shielded via an abstracted Crypto-Agility Provider Interface (CAPI), guaranteeing algorithmic hot-swapping without recompiling or redeploying service binaries.",
  phases: [
    {
      id: "phase-1",
      name: "Phase 1: Cryptography Discovery & Automated CBOM Generation",
      timeline: "Months 1 - 3",
      objectives: [
        "Automate deep cryptographic asset discovery across all microservices, API gateways, service meshes, and message buses.",
        "Generate dynamic CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) for every containerized workload.",
        "Identify and catalog all hardcoded cipher suites, static X.509 cert references, and legacy TLS 1.2 endpoints."
      ],
      deliverables: [
        "Continuous CBOM scanner integrated into CI/CD pipelines (e.g., static analysis of Go crypto/tls, Java JCA/JCE providers, OpenSSL linkages).",
        "Egress/Ingress network cipher suite telemetry via eBPF probes in Kubernetes clusters.",
        "Legacy vulnerability register detailing endpoints vulnerable to HNDL."
      ]
    },
    {
      id: "phase-2",
      name: "Phase 2: Crypto-Agility Abstraction Layer & TLS 1.3 Mesh Base",
      timeline: "Months 4 - 6",
      objectives: [
        "Decouple application business logic from cryptographic implementations via a uniform Crypto-Agility Provider Interface (CAPI).",
        "Upgrade ingress and service mesh sidecars (Envoy / Istio) to TLS 1.3 as mandatory baseline.",
        "Establish runtime configuration driven cipher suite negotiation without code modifications."
      ],
      deliverables: [
        "Standardized CAPI client libraries (Go, Rust, Java SPI, Node.js) delegating TLS termination to mesh sidecars or modern cryptographic engines.",
        "Deprecation of TLS 1.0, 1.1, and classical non-PFS TLS 1.2 cipher suites across the enterprise.",
        "Policy engine (Open Policy Agent / Kyverno) blocking microservices deployment with hardcoded cryptographic primitives."
      ]
    },
    {
      id: "phase-3",
      name: "Phase 3: Hybrid Key Exchange (X25519 + ML-KEM-768) Deployment",
      timeline: "Months 7 - 10",
      objectives: [
        "Deploy hybrid key exchange for all East-West microservices and North-South edge ingress.",
        "Enforce dual-key encapsulation combining classical X25519 Elliptic Curve Diffie-Hellman with NIST FIPS 203 ML-KEM-768.",
        "Provide zero-regression fallback: if ML-KEM experiences unforeseen cryptanalytic weaknesses, X25519 maintains classical security; if classical ECDH is broken by a CRQC, ML-KEM prevents retrospective decryption."
      ],
      deliverables: [
        "Envoy / Istio EnvoyFilter configuration enforcing NamedGroup `X25519MLKEM768` (Code point 0x11ec) and `SecP256r1MLKEM768` (0x11ed).",
        "Benchmark report confirming handshake latency overhead remains under 1.5ms on intra-cluster traffic.",
        "Zero disruption to existing classical PKI/CA infrastructure by decoupling key exchange from authentication."
      ]
    },
    {
      id: "phase-4",
      name: "Phase 4: FIPS 204 (ML-DSA) Authentication & Certificate Bloat Mitigation",
      timeline: "Months 11 - 16",
      objectives: [
        "Transition mutual TLS (mTLS) microservices authentication to NIST FIPS 204 (ML-DSA-65).",
        "Mitigate the dramatic certificate chain size explosion (ML-DSA-65 signature: 3,309 bytes, public key: 1,952 bytes vs ECDSA: ~64 bytes / 64 bytes).",
        "Prevent TCP fragmentation, multi-packet Initial Congestion Window (initcwnd) stalls, and handshake latency degradation."
      ],
      deliverables: [
        "Implementation of RFC 8879 TLS Certificate Compression using Brotli and Zstandard algorithms (reducing chain size by 45-55%).",
        "Deployment of RFC 9345 Delegated Credentials with short-lived (6-24 hour) leaf credentials.",
        "Intermediate Certificate Caching across Envoy sidecars, eliminating redundant transmission of intermediate CA certificates.",
        "Kernel TCP tuning across Kubernetes nodes: MTU set to 9000 (Jumbo frames) for VPC/pod networks, and TCP `initcwnd` tuned from default 10 to 32 segments."
      ]
    },
    {
      id: "phase-5",
      name: "Phase 5: Data-at-Rest Hardening & KMS Post-Quantum Transition",
      timeline: "Months 17 - 20",
      objectives: [
        "Mandate AES-256-GCM or ChaCha20-Poly1305 with 256-bit keys for all persistent volumes, databases, and message queues.",
        "Transition Key Management Services (KMS) and Hardware Security Modules (HSMs) to post-quantum envelope encryption.",
        "Deploy FIPS 203 ML-KEM-768 for Data Encryption Key (DEK) encapsulation."
      ],
      deliverables: [
        "Automated cryptographic key rotation pipelines with zero downtime.",
        "HSM firmware verification adhering to TCG PQC and NIST FIPS 140-3 Level 3/4 standards.",
        "Post-quantum envelope encryption adapter for S3/Blob storage, PostgreSQL, Kafka, and Redis."
      ]
    },
    {
      id: "phase-6",
      name: "Phase 6: Full PQC Steady State & Continuous Algorithmic Agility",
      timeline: "Months 21 - 24+",
      objectives: [
        "Retire classical fallback mechanisms as quantum computing milestones approach.",
        "Automate continuous crypto-policy compliance audits and rapid algorithmic replacement drills.",
        "Achieve complete TCG PQC Readiness Level 4 (Fully Agile, Quantum-Hardened Enterprise)."
      ],
      deliverables: [
        "Quarterly crypto-agility cutover exercises (simulating algorithm compromise and dynamic replacement in under 60 minutes).",
        "Executive PQC compliance dashboard with real-time fleet verification."
      ]
    }
  ],
  certificateMitigationDetails: {
    problemStatement: "Classical ECDSA certificates require ~1.2 KB for a full 3-tier chain. FIPS 204 (ML-DSA-65) increases leaf and intermediate public keys to 1,952 bytes and signatures to 3,309 bytes each. A standard 3-tier certificate chain expands to 15.8 KB - exceeding the standard TCP Initial Congestion Window (initcwnd = 10 packets * 1,460 MSS = ~14.6 KB). This induces multi-packet IP fragmentation, dropped UDP/QUIC datagrams, and additional Round Trip Time (RTT) stalls during connection establishment.",
    mitigationMatrix: [
      {
        strategy: "RFC 8879 TLS Certificate Compression",
        mechanism: "Negotiate Brotli (algorithm 2) and Zstandard (algorithm 3) compression algorithms in TLS ClientHello.",
        impact: "Compresses repetitive ASN.1 structure and lattice polynomial coefficients by 45-55%, compressing 15.8 KB chain down to ~7.2 KB, fitting entirely within a single initial congestion window.",
        deploymentLocation: "Envoy / NGINX Ingress & Sidecar TLS terminators."
      },
      {
        strategy: "TLS Delegated Credentials (RFC 9345)",
        mechanism: "Issue short-lived delegated credentials (valid for 6-24 hours) signed by long-lived intermediate CA using compact classical or ML-DSA signatures. Clients cache the intermediate CA.",
        impact: "Omits repeated transmission of bulky intermediate certificate chains in high-frequency microservice mTLS handshakes.",
        deploymentLocation: "Service mesh CA (Istio Citadel / HashiCorp Vault)."
      },
      {
        strategy: "Intermediate Certificate Suppression & Pre-distribution",
        mechanism: "Distribute intermediate CA certificates out-of-band via Kubernetes ConfigMaps or SPIFFE trust bundles. Servers transmit only the leaf certificate in the TLS Certificate handshake message.",
        impact: "Eliminates ~5.3 KB of intermediate CA payload per handshake.",
        deploymentLocation: "Internal VPC / Service Mesh East-West communications."
      },
      {
        strategy: "Network Layer & TCP Tuning (Jumbo Frames & initcwnd)",
        mechanism: "Configure VPC network interfaces with MTU 9000 (Jumbo frames) for all internal container networks. Increase Linux TCP `initcwnd` from default 10 to 32.",
        impact: "Enables up to 46 KB of unfragmented initial transmission without waiting for TCP ACKs, neutralizing latency overhead.",
        deploymentLocation: "Kubernetes worker node OS kernel (`net.ipv4.tcp_wmem`, `sysctl`)."
      },
      {
        strategy: "Decoupled Authentication Phasing (Dual Certificates)",
        mechanism: "Decouple key exchange from identity authentication. Enforce hybrid X25519+ML-KEM key exchange immediately to block HNDL, while maintaining ECDSA P-256 for leaf certificates during external WAN ingress until RFC 8879 is universally supported by client clients.",
        impact: "Provides immediate quantum-safe privacy protection without breaking bandwidth-constrained external clients.",
        deploymentLocation: "Public Edge API Gateway / Cloudflare / AWS ALB."
      }
    ]
  },
  cryptoAgilityArchitecture: {
    corePrinciple: "No microservice shall directly call cryptographic primitives or hardcode algorithm identifiers. All encryption, key derivation, and TLS handshakes must pass through an abstracted Provider interface configured via dynamic policy.",
    components: [
      {
        name: "Service Mesh Sidecar Offloading (Preferred)",
        description: "Applications communicate over plaintext or local Unix Domain Sockets to a local Envoy proxy. Envoy manages all TLS 1.3 negotiation, hybrid key exchange, cert compression, and cipher rotation transparently."
      },
      {
        name: "Crypto-Agility Provider Interface (CAPI SDK)",
        description: "For services requiring application-layer data-at-rest encryption or message-level security, a unified SDK exposes high-level contracts (EncryptPayload, SignToken, DeriveSessionKey) backed by pluggable providers (OpenSSL 3.x OQS, Bouncy Castle PQC, Rustls-PQC)."
      },
      {
        name: "Dynamic Configuration & Policy Control Plane",
        description: "A centralized control plane (Istio / Consul / Vault) pushes cipher suite and algorithm preferences at runtime without requiring application container rebuilds."
      }
    ]
  }
};

// API: Get canonical architecture roadmap
app.get('/api/architect/preset', (_req, res) => {
  res.json(CANONICAL_ROADMAP);
});

// API: Download full architecture roadmap markdown file
app.get('/api/architect/export-md', (_req, res) => {
  const mdPath = path.resolve(__dirname, 'PQC-Transition-Architecture-Roadmap.md');
  res.download(mdPath, 'PQC-Transition-Architecture-Roadmap.md');
});

// API: Download CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) for Aikido / SAST
app.get('/api/architect/export-cbom', (_req, res) => {
  const cbomPath = path.resolve(__dirname, 'cyclonedx-cbom.json');
  res.download(cbomPath, 'cyclonedx-cbom.json');
});

// API: Generate architecture via Gemini
app.post('/api/architect/generate', async (req, res) => {
  const { prompt } = req.body;
  const userPrompt =
    prompt ||
    "Draft a high-level architecture roadmap to transition our microservices TLS 1.2 communication " +
    "to a quantum-resistant state. Detail the hybrid key exchange mechanisms and how we will " +
    "handle the increased certificate sizes associated with FIPS 204 (ML-DSA).";

  try {
    // Model selection: gemini-2.5-pro as requested by user, or fallback to gemini-3.8-flash
    let modelName = 'gemini-2.5-pro';
    let response;

    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.0,
        },
      });
    } catch (modelErr: any) {
      console.warn(`Attempt with ${modelName} encountered error:`, modelErr?.message || modelErr);
      // Fallback to gemini-3.8-flash
      modelName = 'gemini-3.8-flash';
      response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.0,
        },
      });
    }

    res.json({
      success: true,
      model: modelName,
      text: response.text,
    });
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate architectural analysis.',
      fallback: CANONICAL_ROADMAP,
    });
  }
});

// API: Stream architecture via Gemini
app.post('/api/architect/stream', async (req, res) => {
  const { prompt } = req.body;
  const userPrompt =
    prompt ||
    "Draft a high-level architecture roadmap to transition our microservices TLS 1.2 communication " +
    "to a quantum-resistant state. Detail the hybrid key exchange mechanisms and how we will " +
    "handle the increased certificate sizes associated with FIPS 204 (ML-DSA).";

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    let modelName = 'gemini-2.5-pro';
    let streamResponse;

    try {
      streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.0,
        },
      });
    } catch {
      modelName = 'gemini-3.8-flash';
      streamResponse = await ai.models.generateContentStream({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.0,
        },
      });
    }

    for await (const chunk of streamResponse) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming failure' })}\n\n`);
    res.end();
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const fs = await import('fs');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PQC Architect Platform server listening on port ${PORT}`);
  });
}

startServer();
