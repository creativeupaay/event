import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import MainPage from "./pages/MainPage";
import ConnectPage from "./pages/ConnectPage";
import Layout from "./Layout";
import PendingConnectionsPage from "./pages/PendingConnectionsPage";
import AllConnectionsPage from "./pages/AllConnectionsPage";
import Profile from "./pages/Profile";
import NotificatonsPage from "./pages/NotificationsPage";
import { SnackbarProvider } from "./hooks/SnackbarContext";

const App = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/form/:eventId" element={<FormPage />} />
            <Route path="/home" element={<MainPage />} />
            <Route path="/connect/:eventId" element={<ConnectPage />} />
            <Route path="/notifications" element={<NotificatonsPage />} />
            <Route
              path="/connections/pending"
              element={<PendingConnectionsPage />}
            />
            <Route path="/connections/all" element={<AllConnectionsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  );
};

export default App;
