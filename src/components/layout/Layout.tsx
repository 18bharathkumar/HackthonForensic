
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex flex-1">
        {user && <Sidebar className="w-64 flex-shrink-0" />}
        <main className="flex-1 p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
