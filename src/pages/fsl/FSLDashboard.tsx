// pages/FSLDashboard.tsx
import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getAllFSLMembers,
  getAllPoliceStations,
  getCasesByFSL,
  getNonAcceptedCases,
} from "@/lib/database";
import { addFSLMember, addPoliceStation } from "@/lib/blockchain";
import {
  UserPlusIcon,
  BuildingIcon,
  LayoutDashboardIcon,
  EyeIcon,
  PlusIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const FSLDashboard = () => {
  const { user } = useAuth();

  const members = user ? getAllFSLMembers(user.address) : [];
  const policeStations = user ? getAllPoliceStations(user.address) : [];
  const cases = user ? getCasesByFSL(user.address) : [];
  const pendingCases = user ? getNonAcceptedCases() : [];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [memberAddress, setMemberAddress] = useState("");
  const [memberName, setMemberName] = useState("");
  const [stationAddress, setStationAddress] = useState("");
  const [stationName, setStationName] = useState("");
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [isStationSubmitting, setIsStationSubmitting] = useState(false);

  const pinataApiKey = "92a48571263ebef23d6c";
  const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

  const uploadToPinata = async (metadata: object) => {
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const file = new File([blob], `metadata-${Date.now()}.json`, { type: "application/json" });
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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberAddress || !memberName || !user?.address) return;
    try {
      setIsMemberSubmitting(true);
      const hash = await uploadToPinata({ name: memberName, addedByFSL: user.address, timestamp: new Date().toISOString() });
      const success = await addFSLMember(memberAddress, hash);
      if (success) {
        toast.success("FSL Member added successfully.");
        setMemberAddress("");
        setMemberName("");
        setActiveTab("dashboard");
      } else toast.error("Failed to add member.");
    } catch (err) {
      toast.error("Error adding member.");
    } finally {
      setIsMemberSubmitting(false);
    }
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationAddress || !stationName || !user?.address) return;
    try {
      setIsStationSubmitting(true);
      const hash = await uploadToPinata({ name: stationName, managedByFSL: user.address, timestamp: new Date().toISOString() });
      const success = await addPoliceStation(stationAddress, hash);
      if (success) {
        toast.success("Police Station added successfully.");
        setStationAddress("");
        setStationName("");
        setActiveTab("dashboard");
      } else toast.error("Failed to add station.");
    } catch (err) {
      toast.error("Error adding station.");
    } finally {
      setIsStationSubmitting(false);
    }
  };

  const DashboardStats = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DataCard title="FSL Members" className="bg-blue-50"><div className="text-3xl font-bold">{members.length}</div></DataCard>
      <DataCard title="Police Stations" className="bg-green-50"><div className="text-3xl font-bold">{policeStations.length}</div></DataCard>
      <DataCard title="Total Cases" className="bg-purple-50"><div className="text-3xl font-bold">{cases.length}</div></DataCard>
      <DataCard title="Pending Cases" className="bg-amber-50"><div className="text-3xl font-bold">{pendingCases.length}</div></DataCard>
    </div>
  );

  const AddMemberForm = () => (
    <form onSubmit={handleAddMember} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
      <input type="text" placeholder="0x..." value={memberAddress} onChange={(e) => setMemberAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="text" placeholder="Member Name" value={memberName} onChange={(e) => setMemberName(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button type="submit" disabled={isMemberSubmitting} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">{isMemberSubmitting ? "Adding..." : "Add Member"}</button>
    </form>
  );

  const AddStationForm = () => (
    <form onSubmit={handleAddStation} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4">
      <input type="text" placeholder="0x..." value={stationAddress} onChange={(e) => setStationAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="text" placeholder="Station Name" value={stationName} onChange={(e) => setStationName(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button type="submit" disabled={isStationSubmitting} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60">{isStationSubmitting ? "Adding..." : "Add Station"}</button>
    </form>
  );

  const ViewPendingCases = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Pending Cases</h2>
      {pendingCases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingCases.map((pendingCase) => (
            <div key={pendingCase.id} className="bg-white rounded-lg shadow p-4">
              <div className="font-medium">{pendingCase.id}</div>
              <div className="text-sm text-muted-foreground mt-1">IPFS: {pendingCase.ipfsHash}</div>
              <Button size="sm" className="mt-2" onClick={() => alert('Navigate to case details')}>View Details</Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-sm text-muted-foreground">No pending cases to review.</div>
      )}
    </div>
  );

  return (
    <div className="flex">
      <div className="w-60 bg-gray-100 border-r min-h-screen p-4 space-y-4">
        <Button variant={activeTab === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("dashboard")}><LayoutDashboardIcon className="h-4 w-4 mr-2" /> Dashboard</Button>
        <Button variant={activeTab === "member" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("member")}><UserPlusIcon className="h-4 w-4 mr-2" /> Add Member</Button>
        <Button variant={activeTab === "station" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("station")}><BuildingIcon className="h-4 w-4 mr-2" /> Add Station</Button>
        <Button variant={activeTab === "pending" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("pending")}><EyeIcon className="h-4 w-4 mr-2" /> Pending Cases</Button>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <PageTitle title="FSL Dashboard" description="Manage Forensic Science Laboratory operations" />
        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "member" && <AddMemberForm />}
        {activeTab === "station" && <AddStationForm />}
        {activeTab === "pending" && <ViewPendingCases />}
      </div>
    </div>
  );
};

export default FSLDashboard;
