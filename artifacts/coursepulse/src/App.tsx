import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import IndexPage from "@/pages/index";
import GovernancePage from "@/pages/governance";
import StudentIndexPage from "@/pages/student/index";
import StudentSubmitPage from "@/pages/student/submit";
import StudentThankYouPage from "@/pages/student/thank-you";
import FacultyLoginPage from "@/pages/faculty-login";
import FacultyDashboardPage from "@/pages/faculty/dashboard";
import FacultyCourseContextPage from "@/pages/faculty/course-context";
import FacultyImpactTrackerPage from "@/pages/faculty/impact-tracker";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/governance" component={GovernancePage} />
      
      <Route path="/student" component={StudentIndexPage} />
      <Route path="/student/submit" component={StudentSubmitPage} />
      <Route path="/student/thank-you" component={StudentThankYouPage} />
      
      <Route path="/faculty-login" component={FacultyLoginPage} />
      <Route path="/faculty/dashboard" component={FacultyDashboardPage} />
      <Route path="/faculty/course-context" component={FacultyCourseContextPage} />
      <Route path="/faculty/impact-tracker" component={FacultyImpactTrackerPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
