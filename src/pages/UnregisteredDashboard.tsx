
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";
import AddressDisplay from "@/components/common/AddressDisplay";
import { useAuth } from "@/lib/auth";

const UnregisteredDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Unregistered Account" 
        description="Your wallet is not registered in the system"
      />

      <Alert variant="destructive">
        <AlertTriangleIcon className="h-5 w-5" />
        <AlertTitle>Attention Required</AlertTitle>
        <AlertDescription>
          The connected wallet address is not registered in the system. 
          You will need to be assigned a role by the appropriate authority to access the system.
        </AlertDescription>
      </Alert>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Your Wallet Address</h3>
        <AddressDisplay address={user.address} truncate={false} />
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">How to get registered:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Contact the appropriate authority to register your account:</li>
          <ul className="list-disc list-inside ml-6 space-y-1">
            <li>For CFSL registration - Contact Indian Government administrators</li>
            <li>For FSL registration - Contact your CFSL administrators</li>
            <li>For FSL Member registration - Contact your FSL administrators</li>
            <li>For Police Station registration - Contact your FSL administrators</li>
          </ul>
          <li>Provide your wallet address shown above</li>
          <li>Once registered, disconnect and reconnect your wallet</li>
        </ol>
      </div>
    </div>
  );
};

export default UnregisteredDashboard;
