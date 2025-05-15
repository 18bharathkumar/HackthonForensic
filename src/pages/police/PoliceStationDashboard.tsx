
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getCasesByPoliceStation } from "@/lib/database";
import { PlusIcon, FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliceStationDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get cases created by this police station
  const cases = user ? getCasesByPoliceStation(user.address) : [];
  
  // Get cases with reports
  const casesWithReports = cases.filter(c => c.isAcceptedByFSL);
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Police Station Dashboard" 
        description="Manage forensic cases and reports"
        actions={
          <Button onClick={() => navigate('/add-case')}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add New Case
          </Button>
        }
      />

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
                <div className="text-sm text-muted-foreground mt-1">Status: {caseItem.isAcceptedByFSL ? 'Accepted by FSL' : 'Pending'}</div>
                <Button size="sm" className="mt-2" onClick={() => navigate('/view-cases')}>
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
