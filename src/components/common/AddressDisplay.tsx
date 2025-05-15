
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddressDisplayProps {
  address: string;
  label?: string;
  className?: string;
  truncate?: boolean;
}

const AddressDisplay = ({ 
  address, 
  label, 
  className,
  truncate = true 
}: AddressDisplayProps) => {
  const displayAddress = truncate 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : address;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm text-muted-foreground">{label}:</span>}
      <code className="bg-muted px-2 py-1 rounded text-sm">{displayAddress}</code>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={copyToClipboard}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default AddressDisplay;
