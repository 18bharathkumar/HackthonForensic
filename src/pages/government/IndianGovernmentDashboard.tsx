// pages/IndianGovernmentDashboard.tsx
import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import AddressDisplay from "@/components/common/AddressDisplay";
import { Button } from "@/components/ui/button";
import { PlusIcon, LayoutDashboardIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { getAllCFSLs } from "@/lib/database";
import { addCFSL } from "@/lib/blockchain";

const IndianGovernmentDashboard = () => {
  const cfsls = getAllCFSLs();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [newCfslAddress, setNewCfslAddress] = useState("");
  const [cfslName, setCfslName] = useState("");
  const [cfslPhysicalAddress, setCfslPhysicalAddress] = useState("");
  const [govtId, setGovtId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinataApiKey = "92a48571263ebef23d6c";
  const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

  const uploadToPinata = async (metadata: object) => {
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const file = new File([blob], `cfsl-metadata-${Date.now()}.json`, { type: "application/json" });
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });
    return response.data.IpfsHash;
  };

  const handleAddCFSL = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCfslAddress || !cfslName || !cfslPhysicalAddress || !govtId) return;
    try {
      setIsSubmitting(true);
      const hash = await uploadToPinata({ name: cfslName, physicalAddress: cfslPhysicalAddress, governmentId: govtId, timestamp: new Date().toISOString() });
      const success = await addCFSL(newCfslAddress, hash);
      if (success) {
        toast.success("CFSL added successfully.");
        setNewCfslAddress(""); setCfslName(""); setCfslPhysicalAddress(""); setGovtId("");
        setActiveTab("dashboard");
      } else toast.error("Failed to add CFSL.");
    } catch (err) {
      toast.error("Error adding CFSL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const DashboardStats = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DataCard title="Total CFSLs" className="bg-blue-50"><div className="text-3xl font-bold">{cfsls.length}</div></DataCard>
      <DataCard title="System Status" className="bg-green-50"><div className="text-lg font-medium text-green-600">Operational</div></DataCard>
    </div>
  );

  const AddCFSLForm = () => (
    <form onSubmit={handleAddCFSL} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
      <input type="text" placeholder="Wallet Address" value={newCfslAddress} onChange={(e) => setNewCfslAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="text" placeholder="CFSL Name" value={cfslName} onChange={(e) => setCfslName(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="text" placeholder="Physical Address" value={cfslPhysicalAddress} onChange={(e) => setCfslPhysicalAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="text" placeholder="Govt ID" value={govtId} onChange={(e) => setGovtId(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? "Adding..." : "Add CFSL"}</button>
    </form>
  );

  const ViewRegisteredCFSLs = () => (
    <div className="space-y-6">
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white p-4 rounded-lg shadow text-sm text-muted-foreground">
          {cfsls.length ? "No recent activities to display" : "No CFSLs registered yet. Add a CFSL to get started."}
        </div>
      </div>
      {cfsls.length > 0 && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Registered CFSLs</h2>
          <div className="space-y-4">
            {cfsls.map((cfsl) => (
              <div key={cfsl.address} className="border rounded-lg p-4 bg-white shadow">
                <AddressDisplay address={cfsl.address} label="Address" />
                <div className="mt-2 text-sm text-muted-foreground">IPFS: <code className="bg-muted px-2 py-1 rounded">{cfsl.ipfsHash}</code></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex">
      <div className="w-60 bg-gray-100 border-r min-h-screen p-4 space-y-4">
        <Button variant={activeTab === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("dashboard")}><LayoutDashboardIcon className="h-4 w-4 mr-2" /> Dashboard</Button>
        <Button variant={activeTab === "add" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("add")}><PlusIcon className="h-4 w-4 mr-2" /> Add CFSL</Button>
        <Button variant={activeTab === "view" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("view")}><EyeIcon className="h-4 w-4 mr-2" /> View CFSLs</Button>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <PageTitle title="Indian Government Dashboard" description="Manage Central Forensic Science Laboratories" />
        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "add" && <AddCFSLForm />}
        {activeTab === "view" && <ViewRegisteredCFSLs />}
      </div>
    </div>
  );
};

export default IndianGovernmentDashboard;