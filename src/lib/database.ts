import { USER_ROLES } from "./constants";
import { User } from "./types";

// Mock database
const users: User[] = [
  {
    address: "0x79d29913e7380f67e9b9c241bda7c169b7f961d7",
    role: USER_ROLES.INDIAN_GOVT,
  },
  {
    address: "0x79d29913e7380f67e9b9c241bda7c169b7f961d7",
    role: USER_ROLES.CFSL,
  },
  {
    address: "0x79d29913e7380f67e9b9c241bda7c169b7f961d7",
    role: USER_ROLES.FSL,
  },
  {
    address: "0x79d29913e7380f67e9b9c241bda7c169b7f961d7",
    role: USER_ROLES.POLICE_STATION,
  },
  {
    address: "0x79d29913e7380f67e9b9c241bda7c169b7f961d7",
    role: USER_ROLES.FSL_MEMBER,
  },
];

const cfsls = [
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    ipfsHash: "QmWATGH6WjFj9STsmf6m4cW269j9s9czYu8Yeqgsx5s999",
    exists: true,
  },
];

const fsls = [
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    cfslAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    ipfsHash: "QmZ5Wj9Jz9E9P9Wj9Jz9E9P9Wj9Jz9E9P9Wj9Jz9E9",
    exists: true,
  },
];

const fslMembers = [
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    ipfsHash: "QmbWqxBEKC3P8tqsKc98xmWNz9xxDNStJoBa6w732E8Z4w",
    fslAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    exists: true,
  },
];

const policeStations = [
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    ipfsHash: "QmYRp9LFCy996999999999999999999999999999",
    fslAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    exists: true,
  },
];

const cases = [
  {
    id: "CASE-2024-001",
    ipfsHash: "QmWLcK58E5Jz99999999999999999999999999999",
    policeStationAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    isAcceptedByFSL: false,
  },
];

const testReports = [];

// User related functions
export const getUser = (address: string): User | undefined => {
  return users.find((user) => user.address === address);
};

// CFSL related functions
export const getAllCFSLs = () => {
  return cfsls;
};

export const addCFSL = (cfsl:any) => {
  cfsls.push(cfsl);
};

// FSL related functions
export const getFSLsByCFSL = (cfslAddress: string) => {
  return fsls.filter((fsl) => fsl.cfslAddress === cfslAddress);
};

export const getAllFSLs = () => {
  return fsls;
};

export const addFSL = (fsl: any) => {
  fsls.push(fsl);
};

// FSL Member related functions
export const getAllFSLMembers = (fslAddress: string) => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return [];
};

// Police Station related functions
export const getAllPoliceStations = (fslAddress: string) => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return [];
};

// Case related functions
export const getCasesByFSL = (fslAddress: string) => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return [];
};

export const getCasesByPoliceStation = (policeStationAddress: string) => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return cases.filter((c) => c.policeStationAddress === policeStationAddress);
};

export const getNonAcceptedCases = () => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return cases.filter((c) => !c.isAcceptedByFSL);
};

export const addCase = (newCase: any) => {
  cases.push(newCase);
};

export const updateCase = (caseId: string, updatedCase: any) => {
  const caseIndex = cases.findIndex((c) => c.id === caseId);
  if (caseIndex !== -1) {
    cases[caseIndex] = { ...cases[caseIndex], ...updatedCase };
  }
};

// Test Report related functions
export const getTestReportsByMember = (memberAddress: string) => {
  // In a real app, this would be a database query
  // For now, mock implementation returning empty array
  return testReports.filter(report => report.members.includes(memberAddress));
};

export const addTestReport = (report: any) => {
  // Mock implementation for storing a test report
  // Will be replaced with actual storage in a database
  testReports.push(report);
};

export const addSignatureToReport = (reportId: string, memberAddress: string) => {
  const reportIndex = testReports.findIndex((report) => report.id === reportId);
  if (reportIndex !== -1) {
    const report = testReports[reportIndex];
    if (!report.signatures) {
      report.signatures = [];
    }
    if (!report.signatures.includes(memberAddress)) {
      report.signatures.push(memberAddress);
    }
  }
};

export const addFSLMember = (member: any) => {
  fslMembers.push(member);
};

export const addPoliceStation = (station: any) => {
  policeStations.push(station);
};
