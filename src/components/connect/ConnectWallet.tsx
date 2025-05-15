
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { WalletIcon } from "lucide-react";

const ConnectWallet = () => {
  const { connect, isLoading } = useAuth();
 
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Connect Your Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to access the forensic management system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => connect()} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <WalletIcon className="h-5 w-5" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectWallet;
