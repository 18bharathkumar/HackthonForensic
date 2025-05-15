// pages/CFSLDashboard.tsx
import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import AddressDisplay from "@/components/common/AddressDisplay";
import { getAllFSLs } from "@/lib/database";
import { addFSL } from "@/lib/blockchain";
import { toast } from "sonner";
import { PlusIcon, LayoutDashboardIcon, FileTextIcon, EyeIcon } from "lucide-react";

const CFSLDashboard = () => {
  const fsls = getAllFSLs();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [newfslAddress, setNewfslAddress] = useState("");
  const [fslName, setfslName] = useState("");
  const [fslPhysicalAddress, setfslPhysicalAddress] = useState("");
  const [govtId, setGovtId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFSL = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newfslAddress || !fslName || !fslPhysicalAddress || !govtId) {
      toast.error("All fields are required.");
      return;
    }

    const pinataApiKey = "92a48571263ebef23d6c";
    const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

    try {
      setIsSubmitting(true);

      const metadata = {
        name: fslName,
        physicalAddress: fslPhysicalAddress,
        governmentId: govtId,
        timestamp: new Date().toISOString(),
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const file = new File([metadataBlob], `fsl-metadata-${Date.now()}.json`, { type: "application/json" });

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const { IpfsHash } = response.data;
      const success = await addFSL(newfslAddress, IpfsHash);

      if (success) {
        toast.success("FSL added successfully.");
        setNewfslAddress("");
        setfslName("");
        setfslPhysicalAddress("");
        setGovtId("");
        setActiveTab("dashboard");
      } else {
        toast.error("Failed to add FSL on blockchain.");
      }
    } catch (error) {
      console.error("Error uploading to Pinata or adding FSL:", error);
      toast.error("An error occurred while adding FSL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const DashboardStats = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DataCard title="Total FSLs" className="bg-blue-50">
        <div className="text-3xl font-bold">{fsls.length}</div>
      </DataCard>

      <DataCard title="System Status" className="bg-green-50">
        <div className="text-lg font-medium text-green-600">Operational</div>
      </DataCard>
    </div>
  );

  const AddFSLForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
      <form onSubmit={handleAddFSL} className="space-y-4">
        <input id="fsl-address" type="text" placeholder="0x..." value={newfslAddress} onChange={(e) => setNewfslAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input id="fsl-name" type="text" placeholder="Central Lab Delhi" value={fslName} onChange={(e) => setfslName(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input id="fsl-physical-address" type="text" placeholder="1234 Science Road, Delhi" value={fslPhysicalAddress} onChange={(e) => setfslPhysicalAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input id="govt-id" type="text" placeholder="FSL-DELHI-GOV-0001" value={govtId} onChange={(e) => setGovtId(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? "Adding..." : "Add FSL"}
        </button>
      </form>
    </div>
  );

  const ViewFSLs = () => (
    <div className="space-y-6">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {fsls.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">No recent activities to display</div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">No FSLs registered yet. Add a FSL to get started.</div>
          </div>
        )}
      </div>

      {fsls.length > 0 && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Registered FSLs</h2>
          <div className="space-y-4">
            {fsls.map((fsl) => (
              <div key={fsl.address} className="border rounded-lg p-4 bg-white shadow">
                <AddressDisplay address={fsl.address} label="Address" />
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">IPFS Hash:</span>
                  <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{fsl.ipfsHash}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-100 border-r min-h-screen p-4 space-y-4">
        <Button variant={activeTab === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("dashboard")}> <LayoutDashboardIcon className="h-4 w-4 mr-2" /> Dashboard </Button>
        <Button variant={activeTab === "add" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("add")}> <FileTextIcon className="h-4 w-4 mr-2" /> Add FSL </Button>
        <Button variant={activeTab === "view" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("view")}> <EyeIcon className="h-4 w-4 mr-2" /> View FSLs </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <PageTitle title="CFSL Dashboard" description="Manage Central Forensic Science Laboratories" />

        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "add" && <AddFSLForm />}
        {activeTab === "view" && <ViewFSLs />}
      </div>
    </div>
  );
};

export default CFSLDashboard;