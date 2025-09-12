import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./components/Theme/AppContext";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
