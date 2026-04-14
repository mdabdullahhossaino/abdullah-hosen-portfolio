import { AdminContacts } from "@/admin/AdminContacts";
import { AdminProvider } from "@/admin/AdminContext";
import { AdminDashboard } from "@/admin/AdminDashboard";
import { AdminLayout } from "@/admin/AdminLayout";
import { AdminLogin } from "@/admin/AdminLogin";
import { AdminProjects } from "@/admin/AdminProjects";
import { MobileHeader } from "@/components/MobileHeader";
import { Sidebar } from "@/components/Sidebar";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { Portfolio } from "@/sections/Portfolio";
import { Services } from "@/sections/Services";
import { Skills } from "@/sections/Skills";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// ── Public portfolio page ────────────────────────────────────────────────────
function PortfolioPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Sidebar />
      <MobileHeader />
      <main
        className="lg:ml-[280px] min-h-screen overflow-x-hidden scrollbar-thin pt-14 lg:pt-0"
        id="main-content"
      >
        <Hero />
        <About />
        <Skills />
        <Services />
        <Portfolio />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

// ── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <div className="dark">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PortfolioPage,
});

const ridoyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ridoy",
  component: AdminLayout,
});

const ridoyIndexRoute = createRoute({
  getParentRoute: () => ridoyRoute,
  path: "/",
  component: AdminLogin,
});

const ridoyDashboardRoute = createRoute({
  getParentRoute: () => ridoyRoute,
  path: "/dashboard",
  component: AdminDashboard,
});

const ridoyProjectsRoute = createRoute({
  getParentRoute: () => ridoyRoute,
  path: "/projects",
  component: AdminProjects,
});

const ridoyContactsRoute = createRoute({
  getParentRoute: () => ridoyRoute,
  path: "/contacts",
  component: AdminContacts,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  ridoyRoute.addChildren([
    ridoyIndexRoute,
    ridoyDashboardRoute,
    ridoyProjectsRoute,
    ridoyContactsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  );
}
