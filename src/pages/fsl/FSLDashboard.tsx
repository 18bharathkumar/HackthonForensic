
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { 
  getAllFSLMembers, 
  getAllPoliceStations, 
  getCasesByFSL,
  getNonAcceptedCases
} from "@/lib/database";
import { PlusIcon, UserPlusIcon, BuildingIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FSLDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get FSL members managed by this FSL
  const members = user ? getAllFSLMembers(user.address) : [];
  
  // Get police stations managed by this FSL
  const policeStations = user ? getAllPoliceStations(user.address) : [];
  
  // Get cases assigned to this FSL
  const cases = user ? getCasesByFSL(user.address) : [];
  
  // Get pending cases
  const pendingCases = user ? getNonAcceptedCases() : [];
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="FSL Dashboard" 
        description="Manage Forensic Science Laboratory operations"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => navigate('/manage-members')}>
              <UserPlusIcon className="h-4 w-4 mr-2" /> Add Member
            </Button>
            <Button onClick={() => navigate('/manage-stations')}>
              <BuildingIcon className="h-4 w-4 mr-2" /> Add Station
            </Button>
          </div>
        }
      />

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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Pending Cases</h2>
        {pendingCases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingCases.map((pendingCase) => (
              <div key={pendingCase.id} className="bg-white rounded-lg shadow p-4">
                <div className="font-medium">{pendingCase.id}</div>
                <div className="text-sm text-muted-foreground mt-1">IPFS: {pendingCase.ipfsHash}</div>
                <Button size="sm" className="mt-2" onClick={() => navigate('/pending-cases')}>
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
