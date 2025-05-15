
import { ethers } from "ethers";
import { toast } from "sonner";
import { CONTRACT_ABI, CONTRACT_ADDRESS, EVENT_NAMES } from "./constants";

let provider: ethers.BrowserProvider | null = null;
let contract: ethers.Contract | null = null;
let signer: ethers.Signer | null = null;

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) {
    toast.error("Metamask not installed. Please install Metamask to continue.");
    return null;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    
    if (accounts.length === 0) {
      toast.error("No accounts found. Please connect to Metamask.");
      return null;
    }

    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    toast.success("Wallet connected successfully");
    return accounts[0];
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    toast.error("Failed to connect wallet");
    return null;
  }
}

export async function getConnectedAddress(): Promise<string | null> {
  if (!provider) return null;
  
  try {
    const accounts = await provider.send("eth_accounts", []);
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting address:", error);
    return null;
  }
}

export async function addCFSL(cfslAddress: string, ipfsHash: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addCFSL(cfslAddress, ipfsHash);
    await tx.wait();
    toast.success("CFSL added successfully");
    return true;
  } catch (error) {
    console.error("Error adding CFSL:", error);
    toast.error("Failed to add CFSL");
    return false;
  }
}

export async function addFSL(fslAddress: string, ipfsHash: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addFSL(fslAddress, ipfsHash);
    await tx.wait();
    toast.success("FSL added successfully");
    return true;
  } catch (error) {
    console.error("Error adding FSL:", error);
    toast.error("Failed to add FSL");
    return false;
  }
}

export async function addFSLMember(memberAddress: string, ipfsHash: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addFSLMember(memberAddress, ipfsHash);
    await tx.wait();
    toast.success("FSL Member added successfully");
    return true;
  } catch (error) {
    console.error("Error adding FSL Member:", error);
    toast.error("Failed to add FSL Member");
    return false;
  }
}

export async function addPoliceStation(policeStationAddress: string, ipfsHash: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addPoliceStation(policeStationAddress, ipfsHash);
    await tx.wait();
    toast.success("Police Station added successfully");
    return true;
  } catch (error) {
    console.error("Error adding Police Station:", error);
    toast.error("Failed to add Police Station");
    return false;
  }
}

export async function addCase(caseId: string, ipfsHash: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addCase(caseId, ipfsHash);
    await tx.wait();
    toast.success("Case added successfully");
    return true;
  } catch (error) {
    console.error("Error adding Case:", error);
    toast.error("Failed to add Case");
    return false;
  }
}

export async function acceptCase(caseId: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.AcceptCase(caseId);
    await tx.wait();
    toast.success("Case accepted successfully");
    return true;
  } catch (error) {
    console.error("Error accepting Case:", error);
    toast.error("Failed to accept Case");
    return false;
  }
}

export async function initializeTestReport(
  reportId: string,
  caseId: string,
  members: string[],
  reportHead: string
): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.initializeTestReport(reportId, caseId, members, reportHead);
    await tx.wait();
    toast.success("Test report initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing test report:", error);
    toast.error("Failed to initialize test report");
    return false;
  }
}

export async function addDigitalSignature(reportId: string): Promise<boolean> {
  if (!contract || !signer) {
    toast.error("Wallet not connected");
    return false;
  }

  try {
    const tx = await contract.addDigitalSignature(reportId);
    await tx.wait();
    toast.success("Digital signature added successfully");
    return true;
  } catch (error) {
    console.error("Error adding digital signature:", error);
    toast.error("Failed to add digital signature");
    return false;
  }
}

// Event listeners
export function setupEventListeners(callbacks: {
  onCFSLAdded?: (cfslAddress: string, ipfsHash: string) => void;
  onFSLAdded?: (fslAddress: string, cfslAddress: string, ipfsHash: string) => void;
  onFSLMemberAdded?: (memberAddress: string, ipfsHash: string, fslAddress: string) => void;
  onPoliceStationAdded?: (policeStationAddress: string, fslAddress: string, ipfsHash: string) => void;
  onCaseAdded?: (caseId: string, policeStationAddress: string, ipfsHash: string) => void;
  onCaseAcceptedByFSL?: (fslAddress: string, caseData: any) => void;
  onTestReportInitialized?: (reportId: string, caseId: string, head: string, members: string[]) => void;
  onDigitalSignatureAdded?: (reportId: string, memberAddress: string) => void;
}) {
  if (!contract || !provider) return;

  // Remove any existing listeners
  contract.removeAllListeners();

  // Set up new listeners
  contract.on(EVENT_NAMES.CFSL_ADDED, (cfslAddress, ipfsHash) => {
    if (callbacks.onCFSLAdded) callbacks.onCFSLAdded(cfslAddress, ipfsHash);
  });

  contract.on(EVENT_NAMES.FSL_ADDED, (fslAddress, cfslAddress, ipfsHash) => {
    if (callbacks.onFSLAdded) callbacks.onFSLAdded(fslAddress, cfslAddress, ipfsHash);
  });

  contract.on(EVENT_NAMES.FSL_MEMBER_ADDED, (memberAddress, ipfsHash, fslAddress) => {
    if (callbacks.onFSLMemberAdded) callbacks.onFSLMemberAdded(memberAddress, ipfsHash, fslAddress);
  });

  contract.on(EVENT_NAMES.POLICE_STATION_ADDED, (policeStationAddress, fslAddress, ipfsHash) => {
    if (callbacks.onPoliceStationAdded) callbacks.onPoliceStationAdded(policeStationAddress, fslAddress, ipfsHash);
  });

  contract.on(EVENT_NAMES.CASE_ADDED, (caseId, policeStationAddress, ipfsHash) => {
    if (callbacks.onCaseAdded) callbacks.onCaseAdded(caseId, policeStationAddress, ipfsHash);
  });

  contract.on(EVENT_NAMES.CASE_ACCEPTED_BY_FSL, (fslAddress, caseData) => {
    if (callbacks.onCaseAcceptedByFSL) callbacks.onCaseAcceptedByFSL(fslAddress, caseData);
  });

  contract.on(EVENT_NAMES.TEST_REPORT_INITIALIZED, (reportId, caseId, head, members) => {
    if (callbacks.onTestReportInitialized) callbacks.onTestReportInitialized(reportId, caseId, head, members);
  });

  contract.on(EVENT_NAMES.DIGITAL_SIGNATURE_ADDED, (reportId, memberAddress) => {
    if (callbacks.onDigitalSignatureAdded) callbacks.onDigitalSignatureAdded(reportId, memberAddress);
  });
}
