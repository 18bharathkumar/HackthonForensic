import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";
import { toast } from "sonner";

interface CaseReport {
  id: string;
  ipfsHash: string;
  isAcceptedByFSL: boolean;
}

interface ViewReportsProps {
  cases: CaseReport[];
}

const ViewReports: FC<ViewReportsProps> = ({ cases }) => {
  const casesWithReports = cases.filter((c) => c.isAcceptedByFSL);

  const openIPFS = (hash: string) => {
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Reports</h2>

      {casesWithReports.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {casesWithReports.map((report) => (
            <Card key={report.id} className="p-4 shadow-md hover:shadow-lg transition">
              <div className="text-sm text-muted-foreground">Case ID:</div>
              <div className="text-lg font-semibold mb-2">{report.id}</div>

              <div className="text-sm text-muted-foreground">IPFS Hash:</div>
              <code className="block text-xs truncate bg-gray-100 px-2 py-1 rounded mt-1 mb-3">
                {report.ipfsHash}
              </code>

              <Button
                size="sm"
                onClick={() => openIPFS(report.ipfsHash)}
                className="w-full"
              >
                <FileSearch className="h-4 w-4 mr-2" /> View Report
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow text-sm text-muted-foreground text-center">
          No reports available yet.
        </div>
      )}
    </div>
  );
};

export default ViewReports;
