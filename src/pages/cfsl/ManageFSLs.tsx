
import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFSL } from "@/lib/blockchain";
import { useAuth } from "@/lib/auth";
import { getFSLsByCFSL } from "@/lib/database";
import { toast } from "sonner";
import AddressDisplay from "@/components/common/AddressDisplay";

const ManageFSLs = () => {
  const { user } = useAuth();
  const [newFslAddress, setNewFslAddress] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fsls = user ? getFSLsByCFSL(user.address) : [];

  const handleAddFSL = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFslAddress) {
      toast.error("FSL address is required");
      return;
    }

    if (!ipfsHash) {
      toast.error("IPFS Hash is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await addFSL(newFslAddress, ipfsHash);
      
      if (success) {
        setNewFslAddress("");
        setIpfsHash("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Manage FSLs" 
        description="Add and view Forensic Science Laboratories"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New FSL</CardTitle>
            <CardDescription>
              Register a new Forensic Science Laboratory to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFSL} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fsl-address">FSL Wallet Address</Label>
                <Input
                  id="fsl-address"
                  placeholder="0x..."
                  value={newFslAddress}
                  onChange={(e) => setNewFslAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipfs-hash">IPFS Hash (Metadata)</Label>
                <Input
                  id="ipfs-hash"
                  placeholder="QmZ9..."
                  value={ipfsHash}
                  onChange={(e) => setIpfsHash(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Store FSL details in IPFS and provide the hash
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add FSL"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered FSLs</CardTitle>
            <CardDescription>
              List of all registered Forensic Science Laboratories under your management
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fsls.length > 0 ? (
              <div className="space-y-4">
                {fsls.map((fsl) => (
                  <div key={fsl.address} className="border rounded-lg p-4">
                    <AddressDisplay address={fsl.address} label="Address" />
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">IPFS Hash:</span>
                      <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{fsl.ipfsHash}</code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No FSLs registered yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageFSLs;
