import DataCard from "@/components/common/DataCard";

const DashboardStats = ({ cases }: { cases: any[] }) => {
  const casesWithReports = cases.filter((c) => c.isAcceptedByFSL);
  return (
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
  );
};

export default DashboardStats;