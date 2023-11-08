import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SearchContextProvider from "./services/context.tsx";

import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </React.StrictMode>
    </QueryClientProvider>
  </BrowserRouter>,
);
