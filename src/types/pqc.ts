export type TabType = 
  | 'roadmap' 
  | 'audit_report'
  | 'handshake' 
  | 'calculator' 
  | 'blueprints' 
  | 'console' 
  | 'audit';

export interface ThreatModel {
  primaryVector: string;
  quantumVulnerability: {
    asymmetricKeyExchange: string;
    digitalSignatures: string;
    symmetricEncryption: string;
  };
}

export interface RoadmapPhase {
  id: string;
  name: string;
  timeline: string;
  objectives: string[];
  deliverables: string[];
}

export interface CertificateMitigationItem {
  strategy: string;
  mechanism: string;
  impact: string;
  deploymentLocation: string;
}

export interface CanonicalRoadmapData {
  title: string;
  version: string;
  classification: string;
  standardsCompliance: string[];
  threatModel: ThreatModel;
  executiveSummary: string;
  phases: RoadmapPhase[];
  certificateMitigationDetails: {
    problemStatement: string;
    mitigationMatrix: CertificateMitigationItem[];
  };
  cryptoAgilityArchitecture: {
    corePrinciple: string;
    components: {
      name: string;
      description: string;
    }[];
  };
}

export interface HandshakePacket {
  id: string;
  sender: 'client' | 'server';
  message: string;
  description: string;
  approxSize: string;
  securityNote: string;
  isEncrypted: boolean;
  highlight?: boolean;
}

export interface HandshakeScenario {
  id: string;
  name: string;
  protocol: string;
  keyExchange: string;
  auth: string;
  compression: string;
  rtt: number;
  hndlProtected: boolean;
  totalCertSize: string;
  riskLevel: 'critical' | 'moderate' | 'optimal' | 'experimental';
  summary: string;
  packets: HandshakePacket[];
}

export interface SignatureAlgorithmData {
  id: string;
  name: string;
  standard: string;
  family: 'lattice' | 'stateless-hash' | 'classical-ecc' | 'classical-rsa';
  pubKeyBytes: number;
  sigBytes: number;
  quantumSafe: boolean;
  nistSecurityLevel: number | string;
}

export interface KemAlgorithmData {
  id: string;
  name: string;
  standard: string;
  pubKeyBytes: number;
  cipherTextBytes: number;
  quantumSafe: boolean;
  isHybrid: boolean;
  nistSecurityLevel: number | string;
}

export interface AuditItem {
  id: string;
  category: 'discovery' | 'transit' | 'rest' | 'agility' | 'governance';
  title: string;
  description: string;
  nistReference: string;
  status: 'passed' | 'in_progress' | 'failed' | 'not_started';
}

export interface DiscoveredCryptoAsset {
  id: string;
  name: string;
  category: string;
  codeLocation: string;
  hardcodedSecret: boolean;
  algorithm: string;
  classicalBits: number | string;
  quantumVulnerability: 'FATAL_SHOR_BROKEN' | 'GROVER_SECURITY_HALVED' | 'INSECURE_WRAPPER';
  failureMechanism: string;
  dataLongevityRisk: 'CRITICAL_HNDL' | 'HIGH' | 'MEDIUM';
  nistTarget: string;
  recommendedReplacement: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  remediated: boolean;
  remediationDetails: string;
}

export interface MoscaTheoremData {
  dataShelfLifeX: number; // 15 years
  migrationTimelineY: number; // 3 years
  quantumHorizonZ: number; // 7 years to Q-day
  equationVerdict: string;
  auditorVerdict: string;
}
