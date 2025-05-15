import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  getAllFSLMembers,
  getAllPoliceStations,
  getCasesByFSL,
  getNonAcceptedCases,
} from "@/lib/database";
import { PlusIcon, UserPlusIcon, BuildingIcon } from "lucide-react";
import { toast } from "sonner";

import { addFSLMember, addPoliceStation } from "@/lib/blockchain"; // your blockchain functions

const FSLDashboard = () => {
  const { user } = useAuth();

  // Data fetch
  const members = user ? getAllFSLMembers(user.address) : [];
  const policeStations = user ? getAllPoliceStations(user.address) : [];
  const cases = user ? getCasesByFSL(user.address) : [];
  const pendingCases = user ? getNonAcceptedCases() : [];

  // Form states & toggles
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showStationForm, setShowStationForm] = useState(false);

  // Member form
  const [memberAddress, setMemberAddress] = useState("");
  const [memberName, setMemberName] = useState("");
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);

  // Station form
  const [stationAddress, setStationAddress] = useState("");
  const [stationName, setStationName] = useState("");
  const [isStationSubmitting, setIsStationSubmitting] = useState(false);

  // Shared Pinata keys check
  const pinataApiKey = "92a48571263ebef23d6c"
  const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

  // Helper: Upload JSON metadata to Pinata and return IPFS hash
  const uploadToPinata = async (metadata: object) => {
    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error("Pinata API keys are not configured.");
    }
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const file = new File([blob], `metadata-${Date.now()}.json`, { type: "application/json" });

    const formData = new FormData();
    formData.append("file", file);

    const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    const response = await axios.post(pinataUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    return response.data.IpfsHash;
  };

  // Submit handlers

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberAddress || !memberName) {
      toast.error("Please fill in all member fields.");
      return;
    }

    if (!user?.address) {
      toast.error("User wallet not connected.");
      return;
    }

    try {
      setIsMemberSubmitting(true);

      const metadata = {
        name: memberName,
        addedByFSL: user.address,
        timestamp: new Date().toISOString(),
      };

      const ipfsHash = await uploadToPinata(metadata);

      const success = await addFSLMember(memberAddress, ipfsHash);

      if (success) {
        toast.success("FSL Member added successfully.");
        setMemberAddress("");
        setMemberName("");
        setShowMemberForm(false);
      } else {
        toast.error("Failed to add member on blockchain.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding member.");
    } finally {
      setIsMemberSubmitting(false);
    }
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stationAddress || !stationName) {
      toast.error("Please fill in all station fields.");
      return;
    }

    if (!user?.address) {
      toast.error("User wallet not connected.");
      return;
    }

    try {
      setIsStationSubmitting(true);

      const metadata = {
        name: stationName,
        managedByFSL: user.address,
        timestamp: new Date().toISOString(),
      };

      const ipfsHash = await uploadToPinata(metadata);

      const success = await addPoliceStation(stationAddress, ipfsHash);

      if (success) {
        toast.success("Police Station added successfully.");
        setStationAddress("");
        setStationName("");
        setShowStationForm(false);
      } else {
        toast.error("Failed to add station on blockchain.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding station.");
    } finally {
      setIsStationSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="FSL Dashboard"
        description="Manage Forensic Science Laboratory operations"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setShowMemberForm((v) => !v)}>
              <UserPlusIcon className="h-4 w-4 mr-2" /> {showMemberForm ? "Cancel" : "Add Member"}
            </Button>
            <Button onClick={() => setShowStationForm((v) => !v)}>
              <BuildingIcon className="h-4 w-4 mr-2" /> {showStationForm ? "Cancel" : "Add Station"}
            </Button>
          </div>
        }
      />

      {/* Add Member Form */}
      {showMemberForm && (
        <form
          onSubmit={handleAddMember}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
        >
          <div>
            <label htmlFor="member-address" className="block font-medium mb-1">
              Member Wallet Address
            </label>
            <input
              id="member-address"
              type="text"
              placeholder="0x..."
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="member-name" className="block font-medium mb-1">
              Member Name
            </label>
            <input
              id="member-name"
              type="text"
              placeholder="John Doe"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isMemberSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {isMemberSubmitting ? "Adding..." : "Add Member"}
          </button>
        </form>
      )}

      {/* Add Station Form */}
      {showStationForm && (
        <form
          onSubmit={handleAddStation}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
        >
          <div>
            <label htmlFor="station-address" className="block font-medium mb-1">
              Police Station Wallet Address
            </label>
            <input
              id="station-address"
              type="text"
              placeholder="0x..."
              value={stationAddress}
              onChange={(e) => setStationAddress(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="station-name" className="block font-medium mb-1">
              Police Station Name
            </label>
            <input
              id="station-name"
              type="text"
              placeholder="Central Police Station"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isStationSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {isStationSubmitting ? "Adding..." : "Add Station"}
          </button>
        </form>
      )}

      {/* Dashboard stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DataCard title="FSL Members" className="bg-blue-50">
          <div className="text-3xl font-bold">{members.length}</div>
        </DataCard>

        <DataCard title="Police Stations" className="bg-green-50">
          <div className="text-3xl font-bold">{policeStations.length}</div>
        </DataCard>

        <DataCard title="Total Cases" className="bg-purple-50">
          <div className="text-3xl font-bold">{cases.length}</div>
        </DataCard>

        <DataCard title="Pending Cases" className="bg-amber-50">
          <div className="text-3xl font-bold">{pendingCases.length}</div>
        </DataCard>
      </div>

      {/* Pending cases */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Pending Cases</h2>
        {pendingCases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingCases.map((pendingCase) => (
              <div
                key={pendingCase.id}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="font-medium">{pendingCase.id}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  IPFS: {pendingCase.ipfsHash}
                </div>
                <Button size="sm" className="mt-2" onClick={() => alert('Navigate to case details')}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">
              No pending cases to review.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FSLDashboard;
