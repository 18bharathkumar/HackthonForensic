
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import Layout from "@/components/layout/Layout";
import ConnectWallet from "@/components/connect/ConnectWallet";
import RoleRouter from "./RoleRouter";
import { initializeEventHandlers } from "@/lib/event-handlers";

const Index = () => {
  const { user, isLoading } = useAuth();

  // Initialize blockchain event handlers
  useEffect(() => {
    if (user) {
      initializeEventHandlers();
    }
  }, [user]);

  // Render loading state while checking auth
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!user ? <ConnectWallet /> : <RoleRouter />}
    </Layout>
  );
};

export default Index;
