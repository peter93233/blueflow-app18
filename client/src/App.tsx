import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationContainer } from "@/components/ui/notification-toast";
import { useNotifications } from "@/hooks/use-notifications";
import SimpleHome from "@/pages/simple-home";
import SimpleBudgetSettings from "@/pages/simple-budget-settings";
import SimpleReports from "@/pages/simple-reports";
import ArchiveViewer from "@/pages/archive-viewer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/add-expense" component={SimpleHome} />
      <Route path="/budget-settings" component={SimpleBudgetSettings} />
      <Route path="/reports" component={SimpleReports} />
      <Route path="/archive" component={ArchiveViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { activeToasts, dismissToast } = useNotifications();

  return (
    <>
      <Router />
      <NotificationContainer 
        notifications={activeToasts}
        onDismiss={dismissToast}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
