
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getTestReportsByMember } from "@/lib/database";
import { FileTextIcon, FileCheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FSLMemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get test reports this member is involved in
  const reports = user ? getTestReportsByMember(user.address) : [];
  
  // Get reports that need signatures
  const pendingSignatures = reports.filter(report => !report.signatures.includes(user?.address || ''));
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="FSL Member Dashboard" 
        description="Manage your forensic test reports"
        actions={
          <Button onClick={() => navigate('/my-reports')}>
            <FileTextIcon className="h-4 w-4 mr-2" /> View All Reports
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="Total Reports" className="bg-blue-50">
          <div className="text-3xl font-bold">{reports.length}</div>
        </DataCard>
        
        <DataCard title="Pending Signatures" className="bg-amber-50">
          <div className="text-3xl font-bold">{pendingSignatures.length}</div>
        </DataCard>
        
        <DataCard title="Completed Reports" className="bg-green-50">
          <div className="text-3xl font-bold">{reports.length - pendingSignatures.length}</div>
        </DataCard>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reports Needing Your Signature</h2>
        {pendingSignatures.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingSignatures.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-medium">Report ID: {report.id}</div>
                <div className="text-sm text-muted-foreground mt-1">Case: {report.caseId}</div>
                <div className="text-sm text-muted-foreground">Head: {report.reportHead.substring(0, 6)}...</div>
                <Button size="sm" className="mt-2" onClick={() => navigate('/my-reports')}>
                  <FileCheckIcon className="h-4 w-4 mr-2" /> Sign Report
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">
              No reports pending your signature.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FSLMemberDashboard;
