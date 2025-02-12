import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="w-full h-screen flex flex-col flex-1">
      <div className="flex-[0.08] w-full h-full">
        <Header />
      </div>

      <div className="flex-[0.84] w-full h-full py-3 overflow-y-hidden">
        <Outlet />
      </div>

      <div className="flex-[0.08] w-full h-full">
        <Navbar />
      </div>
    </div>
  );
};

export default Layout;
