import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getCasesByPoliceStation } from "@/lib/database";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { addCase } from "@/lib/blockchain";

const PoliceStationDashboard = () => {
  const { user } = useAuth();

  const cases = user ? getCasesByPoliceStation(user.address) : [];
  const casesWithReports = cases.filter((c) => c.isAcceptedByFSL);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared Pinata keys check
  const pinataApiKey = "92a48571263ebef23d6c"
  const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

  const uploadToPinata = async (metadata: object) => {
    if (!pinataApiKey || !pinataSecretApiKey) {
      throw new Error("Pinata API keys are not configured.");
    }

    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const file = new File([blob], `case-${Date.now()}.json`, {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return response.data.IpfsHash;
  };

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!caseId || !caseDetails) {
      toast.error("Please enter both Case ID and details.");
      return;
    }

    if (!user?.address) {
      toast.error("Police station wallet not connected.");
      return;
    }

    try {
      setIsSubmitting(true);

      const metadata = {
        caseId,
        details: caseDetails,
        createdBy: user.address,
        createdAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadToPinata(metadata);

      const success = await addCase(caseId, ipfsHash);

      if (success) {
        toast.success("Case added successfully.");
        setCaseId("");
        setCaseDetails("");
        setShowForm(false);
      } else {
        toast.error("Failed to add case on blockchain.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding case.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Police Station Dashboard"
        description="Manage forensic cases and reports"
        actions={
          <Button onClick={() => setShowForm((prev) => !prev)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add New Case"}
          </Button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleAddCase}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4"
        >
          <div>
            <label htmlFor="case-id" className="block font-medium mb-1">
              Case ID
            </label>
            <input
              id="case-id"
              type="text"
              placeholder="CASE-2025-001"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="case-details" className="block font-medium mb-1">
              Case Details
            </label>
            <textarea
              id="case-details"
              placeholder="Description of the case..."
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Add Case"}
          </button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="Total Cases" className="bg-blue-50">
          <div className="text-3xl font-bold">{cases.length}</div>
        </DataCard>

        <DataCard title="Cases With Reports" className="bg-green-50">
          <div className="text-3xl font-bold">{casesWithReports.length}</div>
        </DataCard>

        <DataCard title="Pending Cases" className="bg-amber-50">
          <div className="text-3xl font-bold">{cases.length - casesWithReports.length}</div>
        </DataCard>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
        {cases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.slice(0, 6).map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-medium">{caseItem.id}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Status:{" "}
                  {caseItem.isAcceptedByFSL ? "Accepted by FSL" : "Pending"}
                </div>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => alert("Navigate to case details")}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">
              No cases added yet. Add a case to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceStationDashboard;
