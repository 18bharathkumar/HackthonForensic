import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { getAllFSLs } from "@/lib/database";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import AddressDisplay from "@/components/common/AddressDisplay";
import { addFSL } from "@/lib/blockchain";

const FSLDashboard = () => {
  const fsls = getAllFSLs();

  // Form state
  const [showForm, setShowForm] = useState(false);
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
    const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340"
    if (!pinataApiKey || !pinataSecretApiKey) {
      toast.error("Pinata API keys are not configured.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare metadata JSON as a Blob/File
      const metadata = {
        name: fslName,
        physicalAddress: fslPhysicalAddress,
        governmentId: govtId,
        timestamp: new Date().toISOString(),
      };
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: "application/json",
      });
      const file = new File([metadataBlob], `fsl-metadata-${Date.now()}.json`, {
        type: "application/json",
      });

      // Prepare FormData for Pinata
      const formData = new FormData();
      formData.append("file", file);

      // Pinata API endpoint
      const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      // Upload metadata file to Pinata
      const response = await axios.post(pinataUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      const { IpfsHash } = response.data;

      // Call blockchain contract function addFSL with wallet address and IpfsHash
      const success = await addFSL(newfslAddress, IpfsHash);

      if (success) {
        toast.success("FSL added successfully.");
        setNewfslAddress("");
        setfslName("");
        setfslPhysicalAddress("");
        setGovtId("");
        setShowForm(false);
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

  return (
    <div className="space-y-6">
      <PageTitle
        title="Central Forensic Science Laboratories"
        description="Manage Central Forensic Science Laboratories"
        actions={
          <Button onClick={() => setShowForm((prev) => !prev)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add FSL"}
          </Button>
        }
      />

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
          <form onSubmit={handleAddFSL} className="space-y-4">
            <div>
              <label htmlFor="fsl-address" className="block font-medium mb-1">
                FSL Wallet Address
              </label>
              <input
                id="fsl-address"
                type="text"
                placeholder="0x..."
                value={newfslAddress}
                onChange={(e) => setNewfslAddress(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="fsl-name" className="block font-medium mb-1">
                FSL Name
              </label>
              <input
                id="fsl-name"
                type="text"
                placeholder="Central Lab Delhi"
                value={fslName}
                onChange={(e) => setfslName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="fsl-physical-address" className="block font-medium mb-1">
                Physical Address
              </label>
              <input
                id="fsl-physical-address"
                type="text"
                placeholder="1234 Science Road, Delhi"
                value={fslPhysicalAddress}
                onChange={(e) => setfslPhysicalAddress(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="govt-id" className="block font-medium mb-1">
                Govt. Registered Identity
              </label>
              <input
                id="govt-id"
                type="text"
                placeholder="FSL-DELHI-GOV-0001"
                value={govtId}
                onChange={(e) => setGovtId(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add FSL"}
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="Total FSLs" className="bg-blue-50">
          <div className="text-3xl font-bold">{fsls.length}</div>
        </DataCard>

        <DataCard title="System Status" className="bg-green-50">
          <div className="text-lg font-medium text-green-600">Operational</div>
        </DataCard>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {fsls.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">No recent activities to display</div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">
              No FSLs registered yet. Add a FSL to get started.
            </div>
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
                  <span className="text-sm text-muted-foreground">IPFS Hash:</span>{" "}
                  <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{fsl.ipfsHash}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FSLDashboard ;
