import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { ProjectDetails } from "./pages/ProjectDetails";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AdminHero } from "./pages/admin/AdminHero";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminMessages } from "./pages/admin/AdminMessages";
import { AdminContact } from "./pages/admin/AdminContact";
import { AdminAbout } from "./pages/admin/AdminAbout";
import { AdminEducation } from "./pages/admin/AdminEducation";
import { AdminSkills } from "./pages/admin/AdminSkills";
import { AdminVolunteering } from "./pages/admin/AdminVolunteering";
import { AdminPlaceholder } from "./pages/admin/AdminPlaceholder";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProviderLayout } from "./ProviderLayout";

export const router = createBrowserRouter([
  {
    element: <ProviderLayout />,
    children: [
      {
        path: "/",
        Component: Root,
        children: [
          { index: true, Component: Home },
          { path: "projects/:id", Component: ProjectDetails },
        ],
      },
      {
        path: "/admin/login",
        Component: AdminLogin,
      },
      {
        path: "/admin",
        Component: ProtectedRoute,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, Component: AdminOverview },
              { path: "messages", Component: AdminMessages },
              { path: "hero", Component: AdminHero },
              { path: "projects", Component: AdminProjects },
              { path: "about", Component: AdminAbout },
              { path: "education", Component: AdminEducation },
              { path: "skills", Component: AdminSkills },
              { path: "certifications", Component: AdminVolunteering },
              { path: "contact", Component: AdminContact },
            ],
          },
        ],
      }
    ]
  }
]);
