import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationContainer } from "@/components/ui/notification-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import SimpleHome from "@/pages/simple-home";
import SimpleBudgetSettings from "@/pages/simple-budget-settings";
import SimpleReports from "@/pages/simple-reports";
import ArchiveViewer from "@/pages/archive-viewer";
import AddExpense from "@/pages/add-expense";
import { Login } from "@/pages/login";
import NotFound from "@/pages/not-found";
import { SplashScreen } from "@/components/ui/splash-screen";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <AuthGuard>
          <SimpleHome />
        </AuthGuard>
      </Route>
      <Route path="/add-expense">
        <AuthGuard>
          <AddExpense />
        </AuthGuard>
      </Route>
      <Route path="/budget-settings">
        <AuthGuard>
          <SimpleBudgetSettings />
        </AuthGuard>
      </Route>
      <Route path="/reports">
        <AuthGuard>
          <SimpleReports />
        </AuthGuard>
      </Route>
      <Route path="/archive">
        <AuthGuard>
          <ArchiveViewer />
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { activeToasts, dismissToast } = useNotifications();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Store in sessionStorage to prevent showing again in the same session
    sessionStorage.setItem('blueflow-splash-shown', 'true');
  };

  // Check if splash was already shown in this session
  useEffect(() => {
    if (sessionStorage.getItem('blueflow-splash-shown')) {
      setShowSplash(false);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <Router />
      <NotificationContainer 
        notifications={activeToasts}
        onDismiss={dismissToast}
      />
    </AuthProvider>
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
