import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./components/theme/AppContext";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@/components/theme/theme-provider";

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
