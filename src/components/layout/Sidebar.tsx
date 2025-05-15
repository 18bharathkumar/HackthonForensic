
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { USER_ROLES } from "@/lib/constants";
import { 
  HomeIcon, 
  FilesIcon, 
  UserPlusIcon, 
  BuildingIcon, 
  ClipboardIcon, 
  FileEditIcon,
  FileTextIcon,
  FileCheckIcon
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  
  if (!user) return null;

  // Define navigation links based on user role
  let navItems: { title: string; href: string; icon: React.ReactNode }[] = [];
  
  // All roles have access to home
  navItems.push({
    title: "Dashboard",
    href: "/",
    icon: <HomeIcon className="h-5 w-5" />,
  });

  // Role-specific navigation
  switch (user.role) {
    case USER_ROLES.INDIAN_GOVT:
      navItems = [
        ...navItems,
        {
          title: "Manage CFSLs",
          href: "/manage-cfsls",
          icon: <UserPlusIcon className="h-5 w-5" />,
        },
        {
          title: "View All CFSLs",
          href: "/view-cfsls",
          icon: <FilesIcon className="h-5 w-5" />,
        },
      ];
      break;
      
    case USER_ROLES.CFSL:
      navItems = [
        ...navItems,
        {
          title: "Manage FSLs",
          href: "/manage-fsls",
          icon: <UserPlusIcon className="h-5 w-5" />,
        },
        {
          title: "View FSLs",
          href: "/view-fsls",
          icon: <FilesIcon className="h-5 w-5" />,
        },
      ];
      break;
      
    case USER_ROLES.FSL:
      navItems = [
        ...navItems,
        {
          title: "Manage Members",
          href: "/manage-members",
          icon: <UserPlusIcon className="h-5 w-5" />,
        },
        {
          title: "Manage Stations",
          href: "/manage-stations",
          icon: <BuildingIcon className="h-5 w-5" />,
        },
        {
          title: "Pending Cases",
          href: "/pending-cases",
          icon: <ClipboardIcon className="h-5 w-5" />,
        },
        {
          title: "Case Reports",
          href: "/case-reports",
          icon: <FileEditIcon className="h-5 w-5" />,
        },
      ];
      break;
      
    case USER_ROLES.POLICE_STATION:
      navItems = [
        ...navItems,
        {
          title: "Add Case",
          href: "/add-case",
          icon: <FileTextIcon className="h-5 w-5" />,
        },
        {
          title: "View Cases",
          href: "/view-cases",
          icon: <ClipboardIcon className="h-5 w-5" />,
        },
        {
          title: "View Reports",
          href: "/view-reports",
          icon: <FileCheckIcon className="h-5 w-5" />,
        },
      ];
      break;
      
    case USER_ROLES.FSL_MEMBER:
      navItems = [
        ...navItems,
        {
          title: "My Reports",
          href: "/my-reports",
          icon: <FileEditIcon className="h-5 w-5" />,
        },
      ];
      break;
  }

  return (
    <div className={cn("h-full border-r bg-sidebar text-sidebar-foreground", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-sidebar-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "transparent"
                  )
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
