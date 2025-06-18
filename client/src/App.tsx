import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "@/pages/home";
import Campaigns from "@/pages/campaigns";
import CampaignDetail from "@/pages/campaign-detail";
import Boutique from "@/pages/boutique";
import MaterialDonation from "@/pages/material-donation";
import Login from "@/pages/login";
import Register from "@/pages/register";
import VerifyEmail from "@/pages/verify-email";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import FAQ from "@/pages/faq";
import LegalNotice from "@/pages/legal-notice";
import Dashboard from "@/pages/dashboard";
import BoutiqueItemDetail from "@/pages/boutique-item-detail";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminReports from "@/pages/admin/AdminReports";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminContent from "@/pages/admin/AdminContent";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminCampaigns from "@/pages/admin/AdminCampaigns";
import AdminDonations from "@/pages/admin/AdminDonations";
import AdminMaterialDonations from "@/pages/admin/AdminMaterialDonations";
import AdminBoutiqueOrders from "@/pages/admin/AdminBoutiqueOrders";

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/logs" component={AdminLogs} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route path="/admin/campaigns" component={AdminCampaigns} />
      <Route path="/admin/donations" component={AdminDonations} />
      <Route path="/admin/material-donations" component={AdminMaterialDonations} />
      <Route path="/admin/boutique-orders" component={AdminBoutiqueOrders} />
    </Switch>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/campaigns/:id" component={CampaignDetail} />
      <Route path="/boutique" component={Boutique} />
      <Route path="/boutique/:id" component={BoutiqueItemDetail} />
      <Route path="/material-donation" component={MaterialDonation} />
      <Route path="/donate-material" component={MaterialDonation} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/legal/notice" component={LegalNotice} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/profile" component={Dashboard} />
      <Route path="/dashboard/create-campaign" component={Dashboard} />
      <Route path="/dashboard/my-campaigns" component={Dashboard} />
      <Route path="/dashboard/my-orders" component={Dashboard} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Si l'URL commence par /admin, utiliser le routeur admin sans header/footer
  if (location.startsWith('/admin')) {
    return <AdminRouter />;
  }
  
  // Sinon, utiliser le routeur public avec header/footer
  return <PublicRouter />;
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          // Interface admin sans header/footer public
          <div className="min-h-screen">
            <Router />
            <Toaster />
          </div>
        ) : (
          // Interface publique avec header/footer
          <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <Toaster />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
