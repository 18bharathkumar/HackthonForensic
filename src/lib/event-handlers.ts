
import { 
  addCase, 
  addCFSL as addCFSLToDB, 
  addFSL as addFSLToDB, 
  addFSLMember as addFSLMemberToDB,
  addPoliceStation as addPoliceStationToDB,
  updateCase,
  addTestReport,
  addSignatureToReport
} from "./database";
import { setupEventListeners } from "./blockchain";
import { toast } from "sonner";

export function initializeEventHandlers() {
  setupEventListeners({
    onCFSLAdded: (cfslAddress, ipfsHash) => {
      console.log(`CFSL Added: ${cfslAddress}, IPFS: ${ipfsHash}`);
      
      // Store in database
      addCFSLToDB({
        address: cfslAddress,
        ipfsHash,
        exists: true,
      });
      
      toast.success(`New CFSL added: ${cfslAddress.substring(0, 6)}...`);
    },
    
    onFSLAdded: (fslAddress, cfslAddress, ipfsHash) => {
      console.log(`FSL Added: ${fslAddress}, CFSL: ${cfslAddress}, IPFS: ${ipfsHash}`);
      
      // Store in database
      addFSLToDB({
        address: fslAddress,
        cfslAddress,
        ipfsHash,
        exists: true,
      });
      
      toast.success(`New FSL added: ${fslAddress.substring(0, 6)}...`);
    },
    
    onFSLMemberAdded: (memberAddress, ipfsHash, fslAddress) => {
      console.log(`FSL Member Added: ${memberAddress}, IPFS: ${ipfsHash}, FSL: ${fslAddress}`);
      
      // Store in database
      addFSLMemberToDB({
        address: memberAddress,
        ipfsHash,
        fslAddress,
        exists: true,
      });
      
      toast.success(`New FSL Member added: ${memberAddress.substring(0, 6)}...`);
    },
    
    onPoliceStationAdded: (policeStationAddress, fslAddress, ipfsHash) => {
      console.log(`Police Station Added: ${policeStationAddress}, FSL: ${fslAddress}, IPFS: ${ipfsHash}`);
      
      // Store in database
      addPoliceStationToDB({
        address: policeStationAddress,
        ipfsHash,
        fslAddress,
        exists: true,
      });
      
      toast.success(`New Police Station added: ${policeStationAddress.substring(0, 6)}...`);
    },
    
    onCaseAdded: (caseId, policeStationAddress, ipfsHash) => {
      console.log(`Case Added: ${caseId}, Police Station: ${policeStationAddress}, IPFS: ${ipfsHash}`);
      
      // Store in database
      addCase({
        id: caseId,
        ipfsHash,
        isAcceptedByFSL: false,
        policeStationAddress,
      });
      
      toast.success(`New Case added: ${caseId}`);
    },
    
    onCaseAcceptedByFSL: (fslAddress, caseData) => {
      const { ipfsHash, isAcceptedByFSL, policeStationAddress, finalReportId } = caseData;
      
      console.log(`Case Accepted by FSL: ${fslAddress}`);
      console.log("Case data:", { ipfsHash, isAcceptedByFSL, policeStationAddress, finalReportId });
      
      // Update case in database
      // Note: We need the caseId, but it's not directly available in the event
      // This is a limitation of the current event structure
      // In a real application, we would need to query the blockchain or modify the event
      
      toast.success(`Case accepted by FSL: ${fslAddress.substring(0, 6)}...`);
    },
    
    onTestReportInitialized: (reportId, caseId, head, members) => {
      console.log(`Test Report Initialized: ${reportId}, Case: ${caseId}, Head: ${head}`);
      console.log("Members:", members);
      
      // Store in database
      addTestReport({
        id: reportId,
        caseId,
        ipfsHash: "",
        reportHead: head,
        members,
        signatures: [],
        isReportFinalized: false,
      });
      
      toast.success(`New Test Report initialized: ${reportId}`);
    },
    
    onDigitalSignatureAdded: (reportId, memberAddress) => {
      console.log(`Digital Signature Added: ${reportId}, Member: ${memberAddress}`);
      
      // Update in database
      addSignatureToReport(reportId, memberAddress);
      
      toast.success(`Digital signature added by: ${memberAddress.substring(0, 6)}...`);
    },
  });
}
