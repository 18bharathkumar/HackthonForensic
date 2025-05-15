
import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCFSL } from "@/lib/blockchain";
import { getAllCFSLs } from "@/lib/database";
import { toast } from "sonner";
import AddressDisplay from "@/components/common/AddressDisplay";

const ManageCFSLs = () => {
  const [newCfslAddress, setNewCfslAddress] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cfsls = getAllCFSLs();

  const handleAddCFSL = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCfslAddress) {
      toast.error("CFSL address is required");
      return;
    }

    if (!ipfsHash) {
      toast.error("IPFS Hash is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await addCFSL(newCfslAddress, ipfsHash);
      
      if (success) {
        setNewCfslAddress("");
        setIpfsHash("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Manage CFSLs" 
        description="Add and view Central Forensic Science Laboratories"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New CFSL</CardTitle>
            <CardDescription>
              Register a new Central Forensic Science Laboratory to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCFSL} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cfsl-address">CFSL Wallet Address</Label>
                <Input
                  id="cfsl-address"
                  placeholder="0x..."
                  value={newCfslAddress}
                  onChange={(e) => setNewCfslAddress(e.target.value)}
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
                  Store CFSL details in IPFS and provide the hash
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add CFSL"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered CFSLs</CardTitle>
            <CardDescription>
              List of all registered Central Forensic Science Laboratories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cfsls.length > 0 ? (
              <div className="space-y-4">
                {cfsls.map((cfsl) => (
                  <div key={cfsl.address} className="border rounded-lg p-4">
                    <AddressDisplay address={cfsl.address} label="Address" />
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">IPFS Hash:</span>
                      <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{cfsl.ipfsHash}</code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No CFSLs registered yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageCFSLs;
