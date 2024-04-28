import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import AppointmentPage from "./pages/Appointment";
import DocumentPage from "./pages/Document";
import NoPage from "./pages/NoPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { OpenAPI } from "./services";
import { authorize, userManager } from "./AuthManager";
import Callback from "./pages/Callback";

OpenAPI.interceptors.response.use((response) => {
  if (response.status === 401) {
    authorize();
  }
  return response;
});

OpenAPI.interceptors.request.use(async (request) => {
  var user = await userManager.getUser();
  if (user) {
    request.headers!.Authorization = "Bearer " + user.access_token;
  } else {
    authorize();
  }
  return request;
});

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    
  
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="callback" element={<Callback />} />
                <Route path="appointments" element={<AppointmentPage />} />
                <Route path="documents" element={<DocumentPage />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
