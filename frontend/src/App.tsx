import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FormPage from "./pages/FormPage";
import MainPage from "./pages/MainPage";
import ConnectPage from "./pages/ConnectPage";
import Layout from "./Layout";
import AlertsPage from "./pages/AlertsPage";
import PendingConnectionsPage from "./pages/PendingConnectionsPage";
import AllConnectionsPage from "./pages/AllConnectionsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route
            path="/connections/pending"
            element={<PendingConnectionsPage />}
          />
          <Route path="/connections/all" element={<AllConnectionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
