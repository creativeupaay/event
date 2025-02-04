import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout = () => {
  return (
    <div className="w-full h-screen flex flex-col flex-1">
      <div className="flex-[0.08] w-full h-full">
        <Header />
      </div>

      <div className="flex-[0.92] w-full h-full overflow-y-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
