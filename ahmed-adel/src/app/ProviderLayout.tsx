import { Outlet } from "react-router";
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";

export function ProviderLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SiteProvider>
          <Outlet />
        </SiteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
