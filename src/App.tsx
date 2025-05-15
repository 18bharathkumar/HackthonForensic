
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManageCFSLs from "./pages/government/ManageCFSLs";
import ManageFSLs from "./pages/cfsl/ManageFSLs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manage-cfsls" element={<Index />} />
            <Route path="/view-cfsls" element={<Index />} />
            <Route path="/manage-fsls" element={<Index />} />
            <Route path="/view-fsls" element={<Index />} />
            <Route path="/manage-members" element={<Index />} />
            <Route path="/manage-stations" element={<Index />} />
            <Route path="/pending-cases" element={<Index />} />
            <Route path="/case-reports" element={<Index />} />
            <Route path="/add-case" element={<Index />} />
            <Route path="/view-cases" element={<Index />} />
            <Route path="/view-reports" element={<Index />} />
            <Route path="/my-reports" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
