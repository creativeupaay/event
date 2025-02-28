import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import MainPage from "./pages/MainPage";
import ConnectPage from "./pages/ConnectPage";
import PendingConnectionsPage from "./pages/PendingConnectionsPage";
import Profile from "./pages/Profile";
import NotificatonsPage from "./pages/NotificationsPage";
import { SnackbarProvider } from "./hooks/SnackbarContext";
import LayoutWithHeader from "./layouts/LayoutWithHeader";
import LayoutWithOutHeader from "./layouts/LayoutWithOutHeader";
import RequestsPage from "./pages/RequestsPage";
import MyNetworkPage from "./pages/MyNetworkPage";
import LevelUpPage from "./pages/LevelUpPage";
import QRPage from "./pages/QRPage";

const App = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <Routes>
          <Route element={<LayoutWithHeader />}>
            <Route path="/home" element={<MainPage />} />

            <Route path="/connect/:eventId" element={<ConnectPage />} />
            <Route
              path="/connections/pending"
              element={<PendingConnectionsPage />}
            />
          </Route>
          <Route path="/" element={<FormPage />} />

          <Route element={<LayoutWithOutHeader />}>
            {/*temp form page in the index page*/}
            <Route path="/notifications" element={<NotificatonsPage />} />
            <Route path="requests/:rtype" element={<RequestsPage />} />
            <Route path="/network" element={<MyNetworkPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="qr" element={<QRPage />} />
          <Route path="/levelup" element={<LevelUpPage />} />
          <Route path="/form/:eventId" element={<FormPage />} />
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  );
};

export default App;
