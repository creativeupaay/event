import { NotificationsOutlined } from "@mui/icons-material";
import tempProfile from "../assets/tempProfile.svg";
import { useNavigate } from "react-router-dom";

// import { ChevronRight } from "@mui/icons-material";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-3 py-3 bg-transparent sticky top-0 left-0 w-full z-50">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold text-[#6B4FC8]"
      >
        Connekt
      </h1>

      <div className="flex items-center space-x-5 ">
        <div
          onClick={() => navigate("/notifications")}
          className="text-[#6B4FC8] text-3xl relative"
        >
          <div className="absolute w-fit h-fit px-2 py-[2px]  bg-red-600 -top-1 -left-[6px] rounded-full flex items-center justify-center">
            <p className="text-sm text-white font-semibold">5</p>
          </div>
          <NotificationsOutlined fontSize="inherit" />
        </div>

        <img
          onClick={() => navigate("/profile")}
          src={tempProfile}
          alt="profile img"
        />
        {/* <button className="bg-blue-600 font-semibold text-white px-3 py-2 rounded-md text-sm">
          Get Started <ChevronRight />
        </button> */}
      </div>
    </header>
  );
};

export default Header;
