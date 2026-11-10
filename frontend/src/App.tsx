import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./routes/AppRoutes";
import { SettingsThemeProvider } from "./theme/settings-theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SettingsThemeProvider>
    </QueryClientProvider>
  );
}
