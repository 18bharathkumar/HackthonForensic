// components/PoliceDashboard/ViewCases.tsx
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewCases = ({ cases }: { cases: any[] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
      {cases.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.slice(0, 6).map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="font-medium">{caseItem.id}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Status: {caseItem.isAcceptedByFSL ? "Accepted by FSL" : "Pending"}
              </div>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  alert("Navigate to case details");
                }}
              >
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
  );
};

export default ViewCases;