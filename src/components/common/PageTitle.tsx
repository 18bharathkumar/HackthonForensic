
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
}

const PageTitle = ({ title, description, className, actions }: PageTitleProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export default PageTitle;
