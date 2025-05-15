
import PageTitle from "@/components/common/PageTitle";
import DataCard from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getAllFSLs, getFSLsByCFSL } from "@/lib/database";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CFSLDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get FSLs managed by this CFSL
  const fsls = user ? getFSLsByCFSL(user.address) : [];
  
  return (
    <div className="space-y-6">
      <PageTitle 
        title="CFSL Dashboard" 
        description="Manage Forensic Science Laboratories"
        actions={
          <Button onClick={() => navigate('/manage-fsls')}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add FSL
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DataCard title="FSLs Under Management" className="bg-blue-50">
          <div className="text-3xl font-bold">{fsls.length}</div>
        </DataCard>

        <DataCard title="System Status" className="bg-green-50">
          <div className="text-lg font-medium text-green-600">Operational</div>
        </DataCard>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">FSLs Overview</h2>
        {fsls.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fsls.map((fsl) => (
              <div key={fsl.address} className="bg-white rounded-lg shadow p-4">
                <div className="font-medium truncate">{fsl.address}</div>
                <div className="text-sm text-muted-foreground mt-1">IPFS: {fsl.ipfsHash}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">
              No FSLs registered yet. Add an FSL to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CFSLDashboard;
