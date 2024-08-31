import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

// React Router
import { BrowserRouter } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";

function ClientApp() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );
}

hydrate(document, <ClientApp />);
