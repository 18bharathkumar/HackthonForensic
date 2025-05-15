// components/PoliceDashboard/AddCaseForm.tsx
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  caseId: string;
  setCaseId: (val: string) => void;
  caseDetails: string;
  setCaseDetails: (val: string) => void;
  isSubmitting: boolean;
  handleAddCase: (e: React.FormEvent) => void;
};

const AddCaseForm = ({
  caseId,
  setCaseId,
  caseDetails,
  setCaseDetails,
  isSubmitting,
  handleAddCase,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleAddCase}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-4 animate-fade-in"
    >
      <div>
        <label htmlFor="case-id" className="block font-medium mb-1">
          Case ID
        </label>
        <input
          id="case-id"
          type="text"
          placeholder="CASE-2025-001"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="case-details" className="block font-medium mb-1">
          Case Details
        </label>
        <textarea
          id="case-details"
          placeholder="Description of the case..."
          value={caseDetails}
          onChange={(e) => setCaseDetails(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 min-h-[100px]"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Add Case"}
      </button>
    </form>
  );
};

export default AddCaseForm;