import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router } from "react-router"

import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext"

import "./index.css"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)