// pages/PoliceStationDashboard.tsx
import { useState } from "react";
import axios from "axios";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getCasesByPoliceStation } from "@/lib/database";
import { PlusIcon, LayoutDashboardIcon, FileTextIcon, FileCheck2Icon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { addCase } from "@/lib/blockchain";

import DashboardStats from "./Dashboard";
import AddCaseForm from "./AddCaseForm";
import ViewCases from "./ViewCase";
import ViewReports from "./ViewReport"; // New Component

const PoliceStationDashboard = () => {
  const { user } = useAuth();
  const cases = user ? getCasesByPoliceStation(user.address) : [];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [caseId, setCaseId] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinataApiKey = "92a48571263ebef23d6c";
  const pinataSecretApiKey = "0188cab26e59a4a57c7e1becf8c3a2476180976c1f54ef5cfcf32cbb65a0c340";

  const uploadToPinata = async (metadata: object) => {
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
        setActiveTab("dashboard");
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
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 bg-gray-100 border-r min-h-screen p-4 space-y-4">
        <Button variant={activeTab === "dashboard" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("dashboard")}> <LayoutDashboardIcon className="h-4 w-4 mr-2" /> Dashboard </Button>
        <Button variant={activeTab === "add" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("add")}> <FileTextIcon className="h-4 w-4 mr-2" /> Add Case </Button>
        <Button variant={activeTab === "view" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("view")}> <EyeIcon className="h-4 w-4 mr-2" /> View Cases </Button>
        <Button variant={activeTab === "report" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("report")}> <FileCheck2Icon className="h-4 w-4 mr-2" /> View Reports </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        <PageTitle title="Police Station Dashboard" description="Manage forensic cases and reports" />

        {activeTab === "dashboard" && <DashboardStats cases={cases} />}

        {activeTab === "add" && (
          <AddCaseForm
            caseId={caseId}
            setCaseId={setCaseId}
            caseDetails={caseDetails}
            setCaseDetails={setCaseDetails}
            isSubmitting={isSubmitting}
            handleAddCase={handleAddCase}
          />
        )}

        {activeTab === "view" && <ViewCases cases={cases} />}

        {activeTab === "report" && <ViewReports cases={cases} />}
      </div>
    </div>
  );
};

export default PoliceStationDashboard;