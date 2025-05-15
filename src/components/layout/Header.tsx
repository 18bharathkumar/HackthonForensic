
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookIcon, FileTextIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react";
import { USER_ROLES } from "@/lib/constants";

const Header = () => {
  const { user, connect, disconnect } = useAuth();

  const getRoleIcon = () => {
    if (!user) return <UserIcon className="h-5 w-5" />;

    switch (user.role) {
      case USER_ROLES.INDIAN_GOVT:
        return <ShieldIcon className="h-5 w-5" />;
      case USER_ROLES.CFSL:
        return <FileTextIcon className="h-5 w-5" />;
      case USER_ROLES.FSL:
        return <FileTextIcon className="h-5 w-5" />;
      case USER_ROLES.POLICE_STATION:
        return <ShieldIcon className="h-5 w-5" />;
      case USER_ROLES.FSL_MEMBER:
        return <BookIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getAddressDisplay = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold">Forensic Chain</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white">
                  <Avatar className="h-8 w-8 bg-secondary">
                    <AvatarFallback>{getRoleIcon()}</AvatarFallback>
                  </Avatar>
                  <span>{getAddressDisplay(user.address)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer font-medium">
                  Role: {user.role}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive" onClick={disconnect}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => connect()}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
