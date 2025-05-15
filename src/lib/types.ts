
import { USER_ROLES } from "./constants";

export interface User {
  address: string;
  role: string;
  ipfsHash?: string;
  metadata?: string;
}

export interface CFSL {
  address: string;
  ipfsHash: string;
  exists: boolean;
}

export interface FSL {
  address: string;
  ipfsHash: string;
  cfslAddress: string;
  exists: boolean;
}

export interface FSLMember {
  address: string;
  ipfsHash: string;
  fslAddress: string;
  exists: boolean;
}

export interface PoliceStation {
  address: string;
  ipfsHash: string;
  fslAddress: string;
  exists: boolean;
}

export interface Case {
  id: string;
  ipfsHash: string;
  isAcceptedByFSL: boolean;
  policeStationAddress: string;
  finalReportId?: string;
}

export interface TestReport {
  id: string;
  ipfsHash: string;
  caseId: string;
  reportHead: string;
  members: string[];
  signatures: string[];
  isReportFinalized: boolean;
}

export interface FinalReport {
  id: string;
  ipfsHash: string;
  caseId: string;
  fslAddress: string;
  testReportIds: string[];
}
